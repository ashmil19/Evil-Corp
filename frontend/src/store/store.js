import { configureStore } from "@reduxjs/toolkit"
import authSlice from "../features/authSlice"
import { persistReducer, persistStore } from 'redux-persist'
import storage from "redux-persist/lib/storage"

const persitConfig = {
    key: 'persist-store',
    storage
}

const persistedReducer = persistReducer(persitConfig, authSlice)

export const store = configureStore({
    reducer: {
        auth: persistedReducer
    }
})


export const persistor = persistStore(store)