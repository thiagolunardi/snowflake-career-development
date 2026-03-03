import React, { useEffect } from 'react'

type Props = {
  increaseFocusedMilestoneFn: () => void,
  selectNextTrackFn: () => void,
  decreaseFocusedMilestoneFn: () => void,
  selectPrevTrackFn: () => void
}

function KeyboardListener({ increaseFocusedMilestoneFn, selectNextTrackFn, decreaseFocusedMilestoneFn, selectPrevTrackFn }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'ArrowUp':
          increaseFocusedMilestoneFn()
          e.preventDefault()
          break
        case 'ArrowRight':
          selectNextTrackFn()
          e.preventDefault()
          break
        case 'ArrowDown':
          decreaseFocusedMilestoneFn()
          e.preventDefault()
          break
        case 'ArrowLeft':
          selectPrevTrackFn()
          e.preventDefault()
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [increaseFocusedMilestoneFn, selectNextTrackFn, decreaseFocusedMilestoneFn, selectPrevTrackFn])

  return null
}

export default KeyboardListener
