package com.pixeltunes.app

import android.content.ComponentName
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.documentfile.provider.DocumentFile
import androidx.lifecycle.lifecycleScope
import androidx.media3.session.MediaController
import androidx.media3.session.SessionToken
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.common.util.concurrent.ListenableFuture
import com.google.common.util.concurrent.MoreExecutors
import com.pixeltunes.app.databinding.ActivityPlaylistBinding
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class PlaylistActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPlaylistBinding
    private lateinit var adapter: SongAdapter
    private lateinit var controllerFuture: ListenableFuture<MediaController>
    private val controller: MediaController?
        get() = if (controllerFuture.isDone) controllerFuture.get() else null
    
    private var currentSongs = listOf<Song>()
    private lateinit var repository: MusicRepository
    
    private val folderPickerLauncher = registerForActivityResult(
        ActivityResultContracts.OpenDocumentTree()
    ) { uri ->
        uri?.let {
            contentResolver.takePersistableUriPermission(
                it,
                Intent.FLAG_GRANT_READ_URI_PERMISSION
            )
            loadSongsFromFolder(it)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        applyTheme()
        binding = ActivityPlaylistBinding.inflate(layoutInflater)
        setContentView(binding.root)

        repository = MusicRepository(this)
        setupViews()
        initializeMediaController()
    }

    private fun applyTheme() {
        val prefs = getSharedPreferences("settings", MODE_PRIVATE)
        val theme = prefs.getString("theme", "system")
        when (theme) {
            "light" -> setTheme(R.style.Theme_PixelTunes)
            "dark" -> setTheme(R.style.Theme_PixelTunes_Dark)
            else -> {
                // System default - check system theme
                val nightMode = resources.configuration.uiMode and 
                    android.content.res.Configuration.UI_MODE_NIGHT_MASK
                if (nightMode == android.content.res.Configuration.UI_MODE_NIGHT_YES) {
                    setTheme(R.style.Theme_PixelTunes_Dark)
                } else {
                    setTheme(R.style.Theme_PixelTunes)
                }
            }
        }
    }

    private fun setupViews() {
        binding.btnBack.setOnClickListener {
            finish()
        }

        binding.btnSort.setOnClickListener {
            if (binding.sortOptions.visibility == View.VISIBLE) {
                binding.sortOptions.visibility = View.GONE
            } else {
                binding.sortOptions.visibility = View.VISIBLE
            }
        }

        binding.btnBrowse.setOnClickListener {
            folderPickerLauncher.launch(null)
        }

        binding.btnSortTitle.setOnClickListener {
            sortSongs(SortOrder.TITLE)
        }

        binding.btnSortDate.setOnClickListener {
            sortSongs(SortOrder.DATE_ADDED)
        }

        binding.btnSortSize.setOnClickListener {
            sortSongs(SortOrder.SIZE)
        }

        currentSongs = intent.getParcelableArrayListExtra<Song>("songs") ?: emptyList()
        
        if (currentSongs.isEmpty()) {
            binding.emptyText.visibility = View.VISIBLE
            binding.playlistRecyclerView.visibility = View.GONE
            binding.btnSort.visibility = View.GONE
        } else {
            binding.emptyText.visibility = View.GONE
            binding.playlistRecyclerView.visibility = View.VISIBLE
            binding.btnSort.visibility = View.VISIBLE
            
            displaySongs(currentSongs)
        }
    }

    private fun displaySongs(songs: List<Song>) {
        adapter = SongAdapter(songs) { song, position ->
            controller?.let {
                // Find the original index of the clicked song in currentSongs
                val originalIndex = currentSongs.indexOfFirst { it.id == song.id }
                if (originalIndex >= 0) {
                    it.seekToDefaultPosition(originalIndex)
                    it.play()
                }
            }
            finish()
        }
        
        binding.playlistRecyclerView.layoutManager = LinearLayoutManager(this)
        binding.playlistRecyclerView.adapter = adapter
    }

    private fun sortSongs(sortOrder: SortOrder) {
        val sortedSongs = when (sortOrder) {
            SortOrder.TITLE -> currentSongs.sortedBy { it.title.lowercase() }
            SortOrder.DATE_ADDED -> currentSongs.sortedByDescending { it.dateAdded }
            SortOrder.SIZE -> currentSongs.sortedByDescending { it.size }
        }
        displaySongs(sortedSongs)
        binding.sortOptions.visibility = View.GONE
    }

    private enum class SortOrder {
        TITLE,
        DATE_ADDED,
        SIZE
    }

    private fun initializeMediaController() {
        val sessionToken = SessionToken(this, ComponentName(this, MusicService::class.java))
        controllerFuture = MediaController.Builder(this, sessionToken).buildAsync()
    }

    private fun loadSongsFromFolder(folderUri: android.net.Uri) {
        lifecycleScope.launch {
            val songsFromFolder = withContext(Dispatchers.IO) {
                repository.getSongsFromFolder(folderUri)
            }
            
            if (songsFromFolder.isNotEmpty()) {
                currentSongs = songsFromFolder
                binding.emptyText.visibility = View.GONE
                binding.playlistRecyclerView.visibility = View.VISIBLE
                binding.btnSort.visibility = View.VISIBLE
                displaySongs(currentSongs)
            } else {
                binding.emptyText.visibility = View.VISIBLE
                binding.emptyText.text = "No audio files found in selected folder"
                binding.playlistRecyclerView.visibility = View.GONE
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        MediaController.releaseFuture(controllerFuture)
    }
}
