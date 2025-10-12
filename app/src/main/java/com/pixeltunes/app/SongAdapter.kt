package com.pixeltunes.app

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.pixeltunes.app.databinding.ItemSongBinding

class SongAdapter(
    private val songs: List<Song>,
    private val onSongClick: (Song, Int) -> Unit
) : RecyclerView.Adapter<SongAdapter.SongViewHolder>() {

    inner class SongViewHolder(private val binding: ItemSongBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(song: Song, position: Int) {
            binding.songItemTitle.text = song.title
            binding.songItemArtist.text = song.artist
            binding.songItemAlbum.text = song.album
            binding.songItemYear.text = if (!song.year.isNullOrEmpty()) song.year else ""
            binding.songItemDuration.text = formatDuration(song.duration)

            Glide.with(binding.root.context)
                .load(song.albumArtUri)
                .error(R.drawable.default_album_art)
                .into(binding.songThumbnail)

            binding.songCard.setOnClickListener {
                onSongClick(song, position)
            }
        }

        private fun formatDuration(duration: Long): String {
            val seconds = (duration / 1000).toInt()
            val minutes = seconds / 60
            val remainingSeconds = seconds % 60
            return String.format("%d:%02d", minutes, remainingSeconds)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SongViewHolder {
        val binding = ItemSongBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return SongViewHolder(binding)
    }

    override fun onBindViewHolder(holder: SongViewHolder, position: Int) {
        holder.bind(songs[position], position)
    }

    override fun getItemCount() = songs.size
}
