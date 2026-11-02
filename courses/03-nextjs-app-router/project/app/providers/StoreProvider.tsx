'use client'

import { useRef, type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../store/store'

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof makeStore> | null>(null)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
