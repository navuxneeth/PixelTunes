package com.pixeltunes.app

import android.content.Context
import android.util.AttributeSet
import android.view.MotionEvent
import androidx.appcompat.widget.AppCompatImageView
import kotlin.math.max
import kotlin.math.min

class DraggableNeedleView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : AppCompatImageView(context, attrs, defStyleAttr) {

    private var lastTouchY = 0f
    private var isDragging = false
    private var initialRotation = 0f
    
    var onNeedleStateChanged: ((Boolean) -> Unit)? = null  // true = on vinyl (playing), false = off vinyl (paused)
    
    private val minRotation = 0f  // Off vinyl
    private val maxRotation = 25f  // On vinyl
    
    init {
        // Make the needle arm clickable and draggable
        isClickable = true
        pivotX = 0f  // Set pivot to top-left for rotation
        pivotY = 0f
    }
    
    override fun onTouchEvent(event: MotionEvent): Boolean {
        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                lastTouchY = event.rawY
                isDragging = true
                initialRotation = rotation
                parent?.requestDisallowInterceptTouchEvent(true)
                return true
            }
            MotionEvent.ACTION_MOVE -> {
                if (isDragging) {
                    val deltaY = event.rawY - lastTouchY
                    // Convert Y movement to rotation (negative Y = more rotation)
                    val newRotation = (initialRotation - deltaY / 10f).coerceIn(minRotation, maxRotation)
                    rotation = newRotation
                    
                    // Notify state change when crossing the threshold (12.5 degrees)
                    val threshold = (maxRotation + minRotation) / 2f
                    val isOnVinyl = newRotation > threshold
                    onNeedleStateChanged?.invoke(isOnVinyl)
                    
                    lastTouchY = event.rawY
                    initialRotation = newRotation
                    return true
                }
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                if (isDragging) {
                    isDragging = false
                    parent?.requestDisallowInterceptTouchEvent(false)
                    
                    // Snap to either fully on or fully off
                    val threshold = (maxRotation + minRotation) / 2f
                    val targetRotation = if (rotation > threshold) maxRotation else minRotation
                    animate()
                        .rotation(targetRotation)
                        .setDuration(200)
                        .start()
                    
                    val isOnVinyl = targetRotation == maxRotation
                    onNeedleStateChanged?.invoke(isOnVinyl)
                    return true
                }
            }
        }
        return super.onTouchEvent(event)
    }
    
    fun setNeedleOn(isOn: Boolean, animate: Boolean = true) {
        val targetRotation = if (isOn) maxRotation else minRotation
        if (animate) {
            this.animate()
                .rotation(targetRotation)
                .setDuration(300)
                .start()
        } else {
            rotation = targetRotation
        }
    }
}
