import { useEffect } from 'react'

// Hook that calls the callback function if you click anywhere outside of the ref
function useOutsideClickHandler(refs, callback) {
  useEffect(() => {
    const handleClick = (event) => {
      for (let ref of refs) {
        if (ref?.current.contains(event.target)) {
          return // Click was inside a ref, do not execute callback
        }
      }

      callback()
    }

    // Bind the event listener and clean it up when done
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [refs])
}

export default useOutsideClickHandler
