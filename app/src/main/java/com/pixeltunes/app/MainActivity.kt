package com.pixeltunes.app

import android.Manifest
import android.content.ComponentName
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.widget.SeekBar
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.session.MediaController
import androidx.media3.session.SessionToken
import com.bumptech.glide.Glide
import com.google.common.util.concurrent.ListenableFuture
import com.google.common.util.concurrent.MoreExecutors
import com.pixeltunes.app.databinding.ActivityMainBinding
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var repository: MusicRepository
    private var songs = listOf<Song>()
    private lateinit var controllerFuture: ListenableFuture<MediaController>
    private val controller: MediaController?
        get() = if (controllerFuture.isDone) controllerFuture.get() else null
    
    private val handler = Handler(Looper.getMainLooper())
    private var isUserSeeking = false
    private var isVinylMode = false
    private var vinylDisc: VinylPlayerView? = null
    private var needleArm: DraggableNeedleView? = null
    private var vinylContainer: View? = null
    private lateinit var normalPlayerContainer: View
    private var playlistPreviewAdapter: PlaylistPreviewAdapter? = null
    private var isNeedleControlled = false  // Track if playback is controlled by needle

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            loadMusic()
        }
    }
    
    private val settingsLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            // Theme was changed, recreate the activity
            recreate()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        applyTheme()
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        repository = MusicRepository(this)
        setupViews()
        setupVinylPlayer()
        checkPermissions()
        
        // Load vinyl mode preference
        val prefs = getSharedPreferences("settings", MODE_PRIVATE)
        isVinylMode = prefs.getBoolean("vinyl_mode", false)
        updatePlayerMode()
    }

    private fun applyTheme() {
        val prefs = getSharedPreferences("settings", MODE_PRIVATE)
        val theme = prefs.getString("theme", "system")
        when (theme) {
            "light" -> setTheme(R.style.Theme_PixelTunes)
            "dark" -> setTheme(R.style.Theme_PixelTunes_Dark)
            else -> {
                // System default - check system theme
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
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
    }

    private fun setupViews() {
        normalPlayerContainer = binding.albumArtCard
        
        binding.btnSettings.setOnClickListener {
            settingsLauncher.launch(Intent(this, SettingsActivity::class.java))
        }

        binding.btnPlayPause.setOnClickListener {
            controller?.let {
                if (it.isPlaying) {
                    it.pause()
                } else {
                    it.play()
                }
            }
        }

        binding.btnNext.setOnClickListener {
            controller?.seekToNext()
        }

        binding.btnPrevious.setOnClickListener {
            controller?.seekToPrevious()
        }

        binding.playlistButton.setOnClickListener {
            val intent = Intent(this, PlaylistActivity::class.java)
            intent.putParcelableArrayListExtra("songs", ArrayList(songs))
            startActivity(intent)
        }

        binding.styleModeButton.setOnClickListener {
            isVinylMode = !isVinylMode
            getSharedPreferences("settings", MODE_PRIVATE)
                .edit()
                .putBoolean("vinyl_mode", isVinylMode)
                .apply()
            updatePlayerMode()
        }

        binding.btnGrantPermission.setOnClickListener {
            requestPermission()
        }

        binding.seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                if (fromUser) {
                    controller?.let {
                        val position = (it.duration * progress / 100)
                        binding.currentTime.text = formatTime(position)
                    }
                }
            }

            override fun onStartTrackingTouch(seekBar: SeekBar?) {
                isUserSeeking = true
            }

            override fun onStopTrackingTouch(seekBar: SeekBar?) {
                isUserSeeking = false
                controller?.let {
                    val position = (it.duration * seekBar!!.progress / 100)
                    it.seekTo(position)
                }
            }
        })
    }

    private fun checkPermissions() {
        val permission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Manifest.permission.READ_MEDIA_AUDIO
        } else {
            Manifest.permission.READ_EXTERNAL_STORAGE
        }

        when {
            ContextCompat.checkSelfPermission(this, permission) == 
                PackageManager.PERMISSION_GRANTED -> {
                loadMusic()
            }
            else -> {
                showPermissionView()
            }
        }
    }

    private fun requestPermission() {
        val permission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Manifest.permission.READ_MEDIA_AUDIO
        } else {
            Manifest.permission.READ_EXTERNAL_STORAGE
        }
        requestPermissionLauncher.launch(permission)
    }

    private fun showPermissionView() {
        binding.permissionView.visibility = View.VISIBLE
    }

    private fun hidePermissionView() {
        binding.permissionView.visibility = View.GONE
    }

    private fun loadMusic() {
        hidePermissionView()
        lifecycleScope.launch {
            songs = repository.getAllSongs()
            if (songs.isNotEmpty()) {
                initializeMediaController()
            } else {
                binding.songTitle.text = getString(R.string.no_songs)
            }
        }
    }

    private fun initializeMediaController() {
        val sessionToken = SessionToken(this, ComponentName(this, MusicService::class.java))
        controllerFuture = MediaController.Builder(this, sessionToken).buildAsync()
        
        controllerFuture.addListener({
            val mediaController = controller ?: return@addListener
            
            // Set up playlist
            val mediaItems = songs.map { song ->
                MediaItem.Builder()
                    .setUri(song.uri)
                    .setMediaId(song.id.toString())
                    .build()
            }
            mediaController.setMediaItems(mediaItems)
            mediaController.prepare()

            // Add listener for playback state changes
            mediaController.addListener(object : Player.Listener {
                override fun onIsPlayingChanged(isPlaying: Boolean) {
                    updatePlayPauseButton(isPlaying)
                }

                override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
                    updateCurrentSongInfo()
                }
            })

            updateCurrentSongInfo()
            startProgressUpdate()
            
        }, MoreExecutors.directExecutor())
    }

    private fun updatePlayPauseButton(isPlaying: Boolean) {
        if (isPlaying) {
            binding.btnPlayPause.setImageResource(R.drawable.ic_pause)
            binding.btnPlayPause.contentDescription = getString(R.string.pause)
            
            // Vinyl mode animations
            if (isVinylMode && !isNeedleControlled) {
                vinylDisc?.startRotation()
                needleArm?.setNeedleOn(true)
            }
        } else {
            binding.btnPlayPause.setImageResource(R.drawable.ic_play)
            binding.btnPlayPause.contentDescription = getString(R.string.play)
            
            // Vinyl mode animations
            if (isVinylMode && !isNeedleControlled) {
                vinylDisc?.stopRotation()
                needleArm?.setNeedleOn(false)
            }
        }
    }

    private fun updateCurrentSongInfo() {
        controller?.let { mediaController ->
            val currentIndex = mediaController.currentMediaItemIndex
            if (currentIndex >= 0 && currentIndex < songs.size) {
                val song = songs[currentIndex]
                binding.songTitle.text = song.title
                binding.artistName.text = song.artist
                binding.albumName.text = song.album
                binding.yearText.text = song.year ?: ""
                
                Glide.with(this)
                    .load(song.albumArtUri)
                    .error(R.drawable.default_album_art)
                    .into(binding.albumArtImage)
                
                binding.totalTime.text = formatTime(song.duration)
                
                // Update vinyl player if in vinyl mode
                if (isVinylMode) {
                    updateVinylPlayerInfo()
                }
            }
        }
    }

    private fun startProgressUpdate() {
        handler.post(object : Runnable {
            override fun run() {
                controller?.let { mediaController ->
                    if (!isUserSeeking) {
                        val currentPosition = mediaController.currentPosition
                        val duration = mediaController.duration
                        
                        if (duration > 0) {
                            val progress = ((currentPosition * 100) / duration).toInt()
                            binding.seekBar.progress = progress
                            
                            // Update vinyl rotation based on progress
                            if (isVinylMode) {
                                val rotationProgress = currentPosition.toFloat() / duration.toFloat()
                                vinylDisc?.updateRotation(rotationProgress)
                            }
                        }
                        
                        binding.currentTime.text = formatTime(currentPosition)
                        
                        // Update vinyl time display if in vinyl mode
                        if (isVinylMode) {
                            findViewById<android.widget.TextView>(R.id.vinylCurrentTime)?.text = formatTime(currentPosition)
                        }
                    }
                }
                handler.postDelayed(this, 1000)
            }
        })
    }

    private fun formatTime(timeMs: Long): String {
        val seconds = (timeMs / 1000).toInt()
        val minutes = seconds / 60
        val remainingSeconds = seconds % 60
        return String.format("%d:%02d", minutes, remainingSeconds)
    }

    private fun setupVinylPlayer() {
        vinylContainer = findViewById(R.id.vinylPlayerContainer)
        vinylDisc = findViewById(R.id.vinylDisc)
        needleArm = findViewById(R.id.needleArm)
        
        // Setup playlist preview
        val playlistRecyclerView = findViewById<androidx.recyclerview.widget.RecyclerView>(R.id.vinylPlaylistPreview)
        playlistPreviewAdapter = PlaylistPreviewAdapter()
        playlistRecyclerView?.apply {
            adapter = playlistPreviewAdapter
            layoutManager = androidx.recyclerview.widget.LinearLayoutManager(this@MainActivity)
        }
        
        // Setup vinyl disc listeners
        vinylDisc?.onPlayPauseListener = { shouldPlay ->
            if (!isNeedleControlled) {  // Only respond if not controlled by needle
                controller?.let {
                    if (shouldPlay) {
                        it.play()
                        needleArm?.setNeedleOn(true)
                    } else {
                        it.pause()
                        needleArm?.setNeedleOn(false)
                    }
                }
            }
        }
        
        vinylDisc?.onSeekListener = { seekPercent ->
            controller?.let {
                val currentPos = it.currentPosition
                val newPos = (currentPos + (it.duration * seekPercent)).toLong()
                    .coerceIn(0, it.duration)
                it.seekTo(newPos)
            }
        }
        
        // Setup pitch adjustment listener
        vinylDisc?.onPitchChangeListener = { pitch ->
            controller?.let {
                // ExoPlayer supports playback speed adjustment
                if (pitch != 1.0f) {
                    it.setPlaybackSpeed(pitch)
                } else {
                    it.setPlaybackSpeed(1.0f)
                }
            }
        }
        
        // Setup needle arm drag listener
        needleArm?.onNeedleStateChanged = { isOnVinyl ->
            isNeedleControlled = true
            controller?.let {
                if (isOnVinyl) {
                    it.play()
                } else {
                    it.pause()
                }
            }
            // Reset flag after a short delay
            handler.postDelayed({ isNeedleControlled = false }, 500)
        }
        
        // Setup vinyl control buttons
        findViewById<android.widget.ImageButton>(R.id.vinylBtnPrevious)?.setOnClickListener {
            controller?.seekToPrevious()
        }
        
        findViewById<android.widget.ImageButton>(R.id.vinylBtnNext)?.setOnClickListener {
            controller?.seekToNext()
        }
        
        // Setup attribution buttons
        findViewById<android.widget.Button>(R.id.btnLinkedIn)?.setOnClickListener {
            val intent = Intent(Intent.ACTION_VIEW, android.net.Uri.parse(getString(R.string.linkedin_url)))
            startActivity(intent)
        }
        
        findViewById<android.widget.Button>(R.id.btnGitHub)?.setOnClickListener {
            val intent = Intent(Intent.ACTION_VIEW, android.net.Uri.parse(getString(R.string.github_url)))
            startActivity(intent)
        }
    }

    private fun updatePlayerMode() {
        if (isVinylMode) {
            // Show vinyl player, hide normal player
            vinylContainer?.visibility = View.VISIBLE
            normalPlayerContainer.visibility = View.GONE
            binding.songInfoContainer.visibility = View.GONE
            binding.progressContainer.visibility = View.GONE
            binding.controlsContainer.visibility = View.GONE
            binding.styleModeButton.text = getString(R.string.normal_player)
            
            // Update vinyl player info
            updateVinylPlayerInfo()
        } else {
            // Show normal player, hide vinyl player
            vinylContainer?.visibility = View.GONE
            normalPlayerContainer.visibility = View.VISIBLE
            binding.songInfoContainer.visibility = View.VISIBLE
            binding.progressContainer.visibility = View.VISIBLE
            binding.controlsContainer.visibility = View.VISIBLE
            binding.styleModeButton.text = getString(R.string.vinyl_player)
        }
    }

    private fun updateVinylPlayerInfo() {
        controller?.let { mediaController ->
            val currentIndex = mediaController.currentMediaItemIndex
            if (currentIndex >= 0 && currentIndex < songs.size) {
                val song = songs[currentIndex]
                findViewById<android.widget.TextView>(R.id.vinylSongTitle)?.text = song.title
                findViewById<android.widget.TextView>(R.id.vinylArtistName)?.text = song.artist
                
                // Update both album arts (center of vinyl and left panel)
                findViewById<android.widget.ImageView>(R.id.vinylAlbumArt)?.let { imageView ->
                    Glide.with(this)
                        .load(song.albumArtUri)
                        .error(R.drawable.default_album_art)
                        .into(imageView)
                }
                
                findViewById<android.widget.ImageView>(R.id.vinylLeftAlbumArt)?.let { imageView ->
                    Glide.with(this)
                        .load(song.albumArtUri)
                        .error(R.drawable.default_album_art)
                        .into(imageView)
                }
                
                findViewById<android.widget.TextView>(R.id.vinylTotalTime)?.text = formatTime(song.duration)
                
                // Update playlist preview
                playlistPreviewAdapter?.updatePlaylist(songs, currentIndex)
            }
        }
    }

    override fun onStart() {
        super.onStart()
        if (::controllerFuture.isInitialized && controllerFuture.isDone) {
            controller?.let { updatePlayPauseButton(it.isPlaying) }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
        if (::controllerFuture.isInitialized) {
            MediaController.releaseFuture(controllerFuture)
        }
    }
}
