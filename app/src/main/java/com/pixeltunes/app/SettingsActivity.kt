package com.pixeltunes.app

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.pixeltunes.app.databinding.ActivitySettingsBinding

class SettingsActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySettingsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        applyTheme()
        binding = ActivitySettingsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupViews()
        loadSettings()
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

        binding.themeRadioGroup.setOnCheckedChangeListener { _, checkedId ->
            val theme = when (checkedId) {
                R.id.radioLight -> "light"
                R.id.radioDark -> "dark"
                else -> "system"
            }
            saveTheme(theme)
            recreateApp()
        }

        binding.linkedinLink.setOnClickListener {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(getString(R.string.linkedin_url)))
            startActivity(intent)
        }

        binding.githubLink.setOnClickListener {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(getString(R.string.github_url)))
            startActivity(intent)
        }
    }

    private fun loadSettings() {
        val prefs = getSharedPreferences("settings", MODE_PRIVATE)
        val theme = prefs.getString("theme", "system")
        
        when (theme) {
            "light" -> binding.radioLight.isChecked = true
            "dark" -> binding.radioDark.isChecked = true
            else -> binding.radioSystem.isChecked = true
        }
    }

    private fun saveTheme(theme: String) {
        getSharedPreferences("settings", MODE_PRIVATE)
            .edit()
            .putString("theme", theme)
            .apply()
    }

    private fun recreateApp() {
        // Just finish this activity and let MainActivity handle the theme change
        setResult(RESULT_OK)
        finish()
    }
}
