import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {user: null, userId: null, accessToken: null, role: []},
    reducers: {
        setCredentials: (state, action) =>{
            const {user, userId, accessToken, role} = action.payload
            state.user = user
            state.userId = userId,
            state.accessToken = accessToken
            state.role = role !== undefined ? [role] : state.role
        },
        updateToken: (state, action) =>{
            const { accessToken } = action.payload
            state.accessToken = accessToken
        },
        logOut: (state, action) =>{
            state.user = null
            state.userId = null
            state.accessToken = null
            state.role = []
        }
    }
})


export const { setCredentials, updateToken, logOut } = authSlice.actions

export default authSlice.reducer