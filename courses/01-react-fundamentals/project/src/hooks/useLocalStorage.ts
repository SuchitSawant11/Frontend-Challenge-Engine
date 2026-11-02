import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  deserialize?: (value: unknown) => T,
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item === null) return initialValue

      let parsedValue: unknown
      try {
        parsedValue = JSON.parse(item)
      } catch {
        // Let custom deserializers handle legacy raw strings when needed.
        if (!deserialize) return initialValue
        return deserialize(item)
      }

      return deserialize ? deserialize(parsedValue) : (parsedValue as T)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // Keep the in-memory state usable if storage is unavailable.
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
