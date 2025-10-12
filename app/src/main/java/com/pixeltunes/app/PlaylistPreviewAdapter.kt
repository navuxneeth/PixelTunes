package com.pixeltunes.app

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class PlaylistPreviewAdapter : RecyclerView.Adapter<PlaylistPreviewAdapter.ViewHolder>() {

    private var songs = listOf<Song>()
    private var currentIndex = 0

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView = view.findViewById(android.R.id.text1)
        val artist: TextView = view.findViewById(android.R.id.text2)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(android.R.layout.simple_list_item_2, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        if (songs.isEmpty()) return
        
        // Calculate the actual position in the playlist (wrapping around)
        val actualPosition = (currentIndex + position + 1) % songs.size
        val song = songs[actualPosition]
        holder.title.text = song.title
        holder.artist.text = song.artist
    }

    override fun getItemCount(): Int {
        // Show up to 3 upcoming songs (not including current song)
        return if (songs.size <= 1) 0 else minOf(3, songs.size - 1)
    }

    fun updatePlaylist(newSongs: List<Song>, currentIdx: Int) {
        songs = newSongs
        currentIndex = currentIdx
        notifyDataSetChanged()
    }
}
