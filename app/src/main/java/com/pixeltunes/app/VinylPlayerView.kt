package com.pixeltunes.app

import android.animation.ObjectAnimator
import android.content.Context
import android.util.AttributeSet
import android.view.GestureDetector
import android.view.MotionEvent
import android.view.View
import android.view.animation.LinearInterpolator
import android.widget.FrameLayout
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

class VinylPlayerView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    private var rotationAnimator: ObjectAnimator? = null
    private var currentRotation = 0f
    private var lastAngle = 0f
    private var isRotating = false
    private var centerX = 0f
    private var centerY = 0f
    private var isUserRotating = false
    
    var onSeekListener: ((Float) -> Unit)? = null
    var onPlayPauseListener: ((Boolean) -> Unit)? = null
    var onPitchChangeListener: ((Float) -> Unit)? = null  // New: for pitch adjustment
    
    private val gestureDetector = GestureDetector(context, object : GestureDetector.SimpleOnGestureListener() {
        override fun onSingleTapConfirmed(e: MotionEvent): Boolean {
            // Toggle play/pause
            onPlayPauseListener?.invoke(!isRotating)
            return true
        }
    })

    init {
        setOnTouchListener { _, event ->
            gestureDetector.onTouchEvent(event)
            handleRotationTouch(event)
            true
        }
    }

    private fun handleRotationTouch(event: MotionEvent): Boolean {
        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                centerX = width / 2f
                centerY = height / 2f
                lastAngle = getAngle(event.x, event.y)
                isUserRotating = true
                return true
            }
            MotionEvent.ACTION_MOVE -> {
                val newAngle = getAngle(event.x, event.y)
                var deltaAngle = newAngle - lastAngle
                
                // Normalize angle difference to -180 to 180
                if (deltaAngle > 180) deltaAngle -= 360
                if (deltaAngle < -180) deltaAngle += 360
                
                if (kotlin.math.abs(deltaAngle) > 2) { // Threshold to detect intentional rotation
                    currentRotation += deltaAngle
                    rotation = currentRotation
                    
                    // Calculate seek percentage based on rotation
                    val seekPercent = (deltaAngle / 360f) * 0.1f // 0.1% per degree
                    onSeekListener?.invoke(seekPercent)
                    
                    // Calculate pitch adjustment based on rotation speed
                    // Normal speed = 1.0, faster = >1.0, slower/backward = <1.0
                    val pitch = 1.0f + (deltaAngle / 20f).coerceIn(-0.5f, 0.5f)
                    onPitchChangeListener?.invoke(pitch)
                    
                    lastAngle = newAngle
                }
                return true
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                isUserRotating = false
                // Reset pitch to normal when user stops rotating
                onPitchChangeListener?.invoke(1.0f)
                return true
            }
        }
        return false
    }

    private fun getAngle(touchX: Float, touchY: Float): Float {
        val dx = touchX - centerX
        val dy = touchY - centerY
        return Math.toDegrees(atan2(dy.toDouble(), dx.toDouble())).toFloat()
    }

    fun startRotation() {
        stopRotation()
        rotationAnimator = ObjectAnimator.ofFloat(this, View.ROTATION, currentRotation, currentRotation + 360f).apply {
            duration = 3000 // 3 seconds per rotation
            interpolator = LinearInterpolator()
            repeatCount = ObjectAnimator.INFINITE
            repeatMode = ObjectAnimator.RESTART
            start()
        }
        isRotating = true
    }

    fun stopRotation() {
        rotationAnimator?.cancel()
        rotationAnimator = null
        currentRotation = rotation
        isRotating = false
    }

    fun updateRotation(progress: Float) {
        if (!isRotating) {
            currentRotation = progress * 360f
            rotation = currentRotation
        }
    }
}
