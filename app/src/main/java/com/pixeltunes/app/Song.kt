package com.pixeltunes.app

import android.net.Uri
import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Song(
    val id: Long,
    val title: String,
    val artist: String,
    val album: String,
    val duration: Long,
    val uri: Uri,
    val albumArtUri: Uri?,
    val year: String?,
    val dateAdded: Long = 0,
    val size: Long = 0
) : Parcelable
