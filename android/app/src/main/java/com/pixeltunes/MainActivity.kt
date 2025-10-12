package com.pixeltunes

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.Button
import android.widget.SeekBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit var mediaPlayer: MediaPlayer
    private lateinit var trackTitle: TextView
    private lateinit var trackArtist: TextView
    private lateinit var currentTime: TextView
    private lateinit var duration: TextView
    private lateinit var seekBar: SeekBar
    private lateinit var playBtn: Button
    private lateinit var prevBtn: Button
    private lateinit var nextBtn: Button
    private lateinit var selectFilesBtn: Button

    private var playlist = mutableListOf<Uri>()
    private var currentTrackIndex = 0
    private var isPlaying = false
    private val handler = Handler(Looper.getMainLooper())

    private val pickAudioLauncher = registerForActivityResult(
        ActivityResultContracts.GetMultipleContents()
    ) { uris ->
        if (uris.isNotEmpty()) {
            handleAudioFiles(uris)
        }
    }

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            selectAudioFiles()
        } else {
            Toast.makeText(this, "Permission required to access audio files", Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initViews()
        initMediaPlayer()
        setupListeners()
    }

    private fun initViews() {
        trackTitle = findViewById(R.id.track_title)
        trackArtist = findViewById(R.id.track_artist)
        currentTime = findViewById(R.id.current_time)
        duration = findViewById(R.id.duration)
        seekBar = findViewById(R.id.seek_bar)
        playBtn = findViewById(R.id.play_btn)
        prevBtn = findViewById(R.id.prev_btn)
        nextBtn = findViewById(R.id.next_btn)
        selectFilesBtn = findViewById(R.id.select_files_btn)
    }

    private fun initMediaPlayer() {
        mediaPlayer = MediaPlayer().apply {
            setOnCompletionListener {
                nextTrack()
            }
            setOnPreparedListener {
                updateDuration()
                seekBar.max = duration
            }
        }
    }

    private fun setupListeners() {
        playBtn.setOnClickListener {
            togglePlayPause()
        }

        prevBtn.setOnClickListener {
            previousTrack()
        }

        nextBtn.setOnClickListener {
            nextTrack()
        }

        selectFilesBtn.setOnClickListener {
            checkPermissionAndSelectFiles()
        }

        seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                if (fromUser) {
                    mediaPlayer.seekTo(progress)
                }
            }

            override fun onStartTrackingTouch(seekBar: SeekBar?) {}
            override fun onStopTrackingTouch(seekBar: SeekBar?) {}
        })
    }

    private fun checkPermissionAndSelectFiles() {
        val permission = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Manifest.permission.READ_MEDIA_AUDIO
        } else {
            Manifest.permission.READ_EXTERNAL_STORAGE
        }

        when {
            ContextCompat.checkSelfPermission(
                this,
                permission
            ) == PackageManager.PERMISSION_GRANTED -> {
                selectAudioFiles()
            }
            else -> {
                permissionLauncher.launch(permission)
            }
        }
    }

    private fun selectAudioFiles() {
        pickAudioLauncher.launch("audio/*")
    }

    private fun handleAudioFiles(uris: List<Uri>) {
        playlist.clear()
        playlist.addAll(uris)
        currentTrackIndex = 0
        loadTrack(0)
        Toast.makeText(this, "${uris.size} tracks loaded", Toast.LENGTH_SHORT).show()
    }

    private fun loadTrack(index: Int) {
        if (index < 0 || index >= playlist.size) return

        currentTrackIndex = index
        val uri = playlist[index]

        mediaPlayer.apply {
            reset()
            setDataSource(applicationContext, uri)
            prepareAsync()
        }

        updateTrackInfo(uri)
    }

    private fun updateTrackInfo(uri: Uri) {
        val fileName = uri.lastPathSegment ?: "Unknown Track"
        trackTitle.text = fileName
        trackArtist.text = "Playing from device"
    }

    private fun togglePlayPause() {
        if (playlist.isEmpty()) {
            Toast.makeText(this, "Please select audio files first", Toast.LENGTH_SHORT).show()
            return
        }

        if (isPlaying) {
            pausePlayback()
        } else {
            startPlayback()
        }
    }

    private fun startPlayback() {
        mediaPlayer.start()
        isPlaying = true
        playBtn.text = "⏸"
        updateSeekBar()
    }

    private fun pausePlayback() {
        mediaPlayer.pause()
        isPlaying = false
        playBtn.text = "▶"
    }

    private fun nextTrack() {
        if (playlist.isEmpty()) return
        val nextIndex = (currentTrackIndex + 1) % playlist.size
        loadTrack(nextIndex)
        if (isPlaying) {
            handler.postDelayed({ startPlayback() }, 100)
        }
    }

    private fun previousTrack() {
        if (playlist.isEmpty()) return
        val prevIndex = (currentTrackIndex - 1 + playlist.size) % playlist.size
        loadTrack(prevIndex)
        if (isPlaying) {
            handler.postDelayed({ startPlayback() }, 100)
        }
    }

    private fun updateSeekBar() {
        seekBar.progress = mediaPlayer.currentPosition
        currentTime.text = formatTime(mediaPlayer.currentPosition)

        if (isPlaying) {
            handler.postDelayed({ updateSeekBar() }, 100)
        }
    }

    private fun updateDuration() {
        duration.text = formatTime(mediaPlayer.duration)
        seekBar.max = mediaPlayer.duration
    }

    private fun formatTime(millis: Int): String {
        val seconds = millis / 1000
        val minutes = seconds / 60
        val secs = seconds % 60
        return String.format("%d:%02d", minutes, secs)
    }

    override fun onDestroy() {
        super.onDestroy()
        mediaPlayer.release()
        handler.removeCallbacksAndMessages(null)
    }

    override fun onPause() {
        super.onPause()
        if (isPlaying) {
            pausePlayback()
        }
    }
}
