import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type UserFilter = number | 'all'
export type PostSortOrder = 'newest' | 'oldest'

interface FiltersState {
  userId: UserFilter
  sortOrder: PostSortOrder
}

const initialState: FiltersState = {
  userId: 'all',
  sortOrder: 'newest',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setUserFilter: (state, action: PayloadAction<UserFilter>) => {
      state.userId = action.payload
    },
    setPostSortOrder: (state, action: PayloadAction<PostSortOrder>) => {
      state.sortOrder = action.payload
    },
  },
})

export const { setUserFilter, setPostSortOrder } = filtersSlice.actions
export default filtersSlice.reducer
