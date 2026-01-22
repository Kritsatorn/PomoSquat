import { useEffect } from 'react'

interface SquatCharacterProps {
  isSquatting: boolean
  onSquatsComplete: () => void
}

export function SquatCharacter({ isSquatting, onSquatsComplete }: SquatCharacterProps) {
  // After 3 squat animations (0.8s each = 2.4s), complete the squats
  useEffect(() => {
    if (isSquatting) {
      const timeout = setTimeout(() => {
        onSquatsComplete()
      }, 2400)
      return () => clearTimeout(timeout)
    }
  }, [isSquatting, onSquatsComplete])

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`character-container ${isSquatting ? 'character-squatting' : 'character-idle'}`}
        style={{
          width: '128px',
          height: '160px',
          position: 'relative',
        }}
      >
        {/* Pixel art character using CSS */}
        <div className="pixel-character">
          {/* Head */}
          <div
            style={{
              position: 'absolute',
              top: '0px',
              left: '40px',
              width: '48px',
              height: '48px',
              backgroundColor: '#fbbf24',
              border: '3px solid #1c1917',
            }}
          >
            {/* Eyes */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '8px',
                width: '8px',
                height: '8px',
                backgroundColor: '#1c1917',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '8px',
                width: '8px',
                height: '8px',
                backgroundColor: '#1c1917',
              }}
            />
            {/* Mouth */}
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '4px',
                backgroundColor: '#1c1917',
              }}
            />
          </div>

          {/* Body */}
          <div
            className="character-body"
            style={{
              position: 'absolute',
              top: '48px',
              left: '32px',
              width: '64px',
              height: '56px',
              backgroundColor: '#1c1917',
              border: '3px solid #1c1917',
            }}
          />

          {/* Arms */}
          <div
            className="character-arm-left"
            style={{
              position: 'absolute',
              top: '56px',
              left: '8px',
              width: '24px',
              height: '16px',
              backgroundColor: '#fbbf24',
              border: '3px solid #1c1917',
            }}
          />
          <div
            className="character-arm-right"
            style={{
              position: 'absolute',
              top: '56px',
              right: '8px',
              width: '24px',
              height: '16px',
              backgroundColor: '#fbbf24',
              border: '3px solid #1c1917',
            }}
          />

          {/* Legs */}
          <div
            className="character-legs"
            style={{
              position: 'absolute',
              top: '104px',
              left: '32px',
              width: '64px',
              height: '48px',
              display: 'flex',
              gap: '16px',
            }}
          >
            <div
              className="character-leg-left"
              style={{
                width: '24px',
                height: '48px',
                backgroundColor: '#fbbf24',
                border: '3px solid #1c1917',
              }}
            />
            <div
              className="character-leg-right"
              style={{
                width: '24px',
                height: '48px',
                backgroundColor: '#fbbf24',
                border: '3px solid #1c1917',
              }}
            />
          </div>
        </div>
      </div>

      {/* Status text */}
      <span
        className="text-lg font-medium"
        style={{
          fontFamily: 'var(--font-body)',
          color: '#1c1917',
        }}
      >
        {isSquatting ? 'Doing squats!' : 'Ready to work'}
      </span>
    </div>
  )
}
