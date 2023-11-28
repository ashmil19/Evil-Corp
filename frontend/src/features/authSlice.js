import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {user: null, accessToken: null, role: []},
    reducers: {
        setCredentials: (state, action) =>{
            const {user, accessToken, role} = action.payload
            state.user = user
            state.accessToken = accessToken
            state.role = role !== undefined ? [role] : state.role
        },
        logOut: (state, action) =>{
            state.user = null
            state.accessToken = null
            state.role = []
        }
    }
})


export const { setCredentials, updateToken, logOut } = authSlice.actions

export default authSlice.reducer