import { useEffect, useMemo, useRef } from "react"
import debounce from "lodash.debounce"

const DEBOUNCE_TIME_IN_MS = 500

const useDebounce = (callback: () => void) => {
  const ref = useRef<() => void>()

  useEffect(() => {
    ref.current = callback
  }, [callback])

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.()
    }

    return debounce(func, DEBOUNCE_TIME_IN_MS)
  }, [])

  return debouncedCallback
}

export default useDebounce
