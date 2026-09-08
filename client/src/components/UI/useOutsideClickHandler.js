import { useEffect } from 'react'

// Hook that calls the callback function if you click anywhere outside of the ref
function useOutsideClickHandler(ref, callback) {
  useEffect(() => {
    const handleClick = (event) => {
      if (!ref?.current.contains(event.target)) {
        callback()

        // Menu will be closed, but since the ref is to the button container, we need to remove the
        // click handler here (the container ref will never be null). This can probably be improved.
        document.removeEventListener('mousedown', handleClick)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [ref, callback])
}

export default useOutsideClickHandler
