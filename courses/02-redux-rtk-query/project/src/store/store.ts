import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'
import counterReducer from './slices/counterSlice'
import filtersReducer from './slices/filtersSlice'
import uiReducer from './slices/uiSlice'
import usersReducer from './slices/usersSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    counter: counterReducer,
    filters: filtersReducer,
    ui: uiReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
