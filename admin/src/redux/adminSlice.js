import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentAdmin: null,
  loading: false,
  error: false,
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
   loginStart: (state) => {
    state.loading = true
   },
   loginSuccess: (state, action) => {
    state.loading = false
    state.currentAdmin = action.payload
   },
   loginFailure: (state) => {
    state.loading = false
    state.error = true
   },
   logout: (state) => {
    state.currentAdmin = null
    state.loading = false
    state.error = false
   },
  },
})

// Action creators are generated for each case reducer function
export const { loginStart, loginSuccess, loginFailure, logout } = adminSlice.actions

export default adminSlice.reducer