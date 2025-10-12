package com.pixeltunes.app

import android.content.ContentUris
import android.content.Context
import android.net.Uri
import android.provider.MediaStore
import androidx.documentfile.provider.DocumentFile
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class MusicRepository(private val context: Context) {

    suspend fun getAllSongs(sortOrder: String = "${MediaStore.Audio.Media.TITLE} ASC"): List<Song> = withContext(Dispatchers.IO) {
        val songs = mutableListOf<Song>()
        val projection = arrayOf(
            MediaStore.Audio.Media._ID,
            MediaStore.Audio.Media.TITLE,
            MediaStore.Audio.Media.ARTIST,
            MediaStore.Audio.Media.ALBUM,
            MediaStore.Audio.Media.DURATION,
            MediaStore.Audio.Media.ALBUM_ID,
            MediaStore.Audio.Media.YEAR,
            MediaStore.Audio.Media.DATE_ADDED,
            MediaStore.Audio.Media.SIZE
        )

        val selection = "${MediaStore.Audio.Media.IS_MUSIC} != 0"

        context.contentResolver.query(
            MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
            projection,
            selection,
            null,
            sortOrder
        )?.use { cursor ->
            val idColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
            val titleColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
            val artistColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
            val albumColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
            val durationColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
            val albumIdColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM_ID)
            val yearColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.YEAR)
            val dateAddedColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_ADDED)
            val sizeColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE)

            while (cursor.moveToNext()) {
                val id = cursor.getLong(idColumn)
                val title = cursor.getString(titleColumn)
                val artist = cursor.getString(artistColumn)
                val album = cursor.getString(albumColumn)
                val duration = cursor.getLong(durationColumn)
                val albumId = cursor.getLong(albumIdColumn)
                val year = if (!cursor.isNull(yearColumn)) cursor.getString(yearColumn) else null
                val dateAdded = cursor.getLong(dateAddedColumn)
                val size = cursor.getLong(sizeColumn)

                val contentUri = ContentUris.withAppendedId(
                    MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                    id
                )

                val albumArtUri = ContentUris.withAppendedId(
                    Uri.parse("content://media/external/audio/albumart"),
                    albumId
                )

                songs.add(
                    Song(
                        id = id,
                        title = title,
                        artist = artist ?: "Unknown Artist",
                        album = album ?: "Unknown Album",
                        duration = duration,
                        uri = contentUri,
                        albumArtUri = albumArtUri,
                        year = year,
                        dateAdded = dateAdded,
                        size = size
                    )
                )
            }
        }
        songs
    }

    suspend fun getSongsFromFolder(folderUri: Uri): List<Song> = withContext(Dispatchers.IO) {
        val songs = mutableListOf<Song>()
        val folder = DocumentFile.fromTreeUri(context, folderUri)
        
        folder?.listFiles()?.forEach { file ->
            if (file.isFile && file.name?.endsWith(".mp3", ignoreCase = true) == true ||
                file.name?.endsWith(".flac", ignoreCase = true) == true ||
                file.name?.endsWith(".wav", ignoreCase = true) == true ||
                file.name?.endsWith(".ogg", ignoreCase = true) == true ||
                file.name?.endsWith(".m4a", ignoreCase = true) == true) {
                
                // Query MediaStore to get song metadata
                val projection = arrayOf(
                    MediaStore.Audio.Media._ID,
                    MediaStore.Audio.Media.TITLE,
                    MediaStore.Audio.Media.ARTIST,
                    MediaStore.Audio.Media.ALBUM,
                    MediaStore.Audio.Media.DURATION,
                    MediaStore.Audio.Media.ALBUM_ID,
                    MediaStore.Audio.Media.YEAR,
                    MediaStore.Audio.Media.DATE_ADDED,
                    MediaStore.Audio.Media.SIZE,
                    MediaStore.Audio.Media.DATA
                )
                
                val selection = "${MediaStore.Audio.Media.DATA} LIKE ?"
                val selectionArgs = arrayOf("%${file.name}%")
                
                context.contentResolver.query(
                    MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                    projection,
                    selection,
                    selectionArgs,
                    null
                )?.use { cursor ->
                    if (cursor.moveToFirst()) {
                        val idColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
                        val titleColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
                        val artistColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
                        val albumColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
                        val durationColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
                        val albumIdColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM_ID)
                        val yearColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.YEAR)
                        val dateAddedColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_ADDED)
                        val sizeColumn = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE)
                        
                        val id = cursor.getLong(idColumn)
                        val title = cursor.getString(titleColumn)
                        val artist = cursor.getString(artistColumn)
                        val album = cursor.getString(albumColumn)
                        val duration = cursor.getLong(durationColumn)
                        val albumId = cursor.getLong(albumIdColumn)
                        val year = if (!cursor.isNull(yearColumn)) cursor.getString(yearColumn) else null
                        val dateAdded = cursor.getLong(dateAddedColumn)
                        val size = cursor.getLong(sizeColumn)
                        
                        val contentUri = ContentUris.withAppendedId(
                            MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                            id
                        )
                        
                        val albumArtUri = ContentUris.withAppendedId(
                            Uri.parse("content://media/external/audio/albumart"),
                            albumId
                        )
                        
                        songs.add(
                            Song(
                                id = id,
                                title = title ?: file.name ?: "Unknown",
                                artist = artist ?: "Unknown Artist",
                                album = album ?: "Unknown Album",
                                duration = duration,
                                uri = contentUri,
                                albumArtUri = albumArtUri,
                                year = year,
                                dateAdded = dateAdded,
                                size = size
                            )
                        )
                    }
                }
            }
        }
        
        songs
    }
}
