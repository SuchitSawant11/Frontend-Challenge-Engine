'use client'

import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store/store'
import { increment } from '../store/store'

export default function Counter() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <section aria-label="Interactive counter">
      <h2>Counter</h2>
      <p aria-live="polite">Count: {count}</p>
      <button type="button" onClick={() => dispatch(increment())}>
        Increment
      </button>
    </section>
  )
}
