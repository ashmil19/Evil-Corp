import { configureStore, combineReducers } from "@reduxjs/toolkit"
import authSlice from "../features/authSlice"
import uiSettingsSlice from '../features/uiSettingsSlice '
import { persistReducer, persistStore } from 'redux-persist'
import storage from "redux-persist/lib/storage"

const authPersitConfig = {
    key: 'auth',
    storage
}

const uiSettingsPersitConfig = {
    key: 'uiSettings',
    storage
}


const persistedAuthReducer = persistReducer(authPersitConfig, authSlice)
const persisteduiSettingsReducer = persistReducer(uiSettingsPersitConfig, uiSettingsSlice)

const rootReducer = combineReducers({
    auth: persistedAuthReducer,
    uiSettings: persisteduiSettingsReducer,

})

export const store = configureStore({
    reducer: rootReducer
})


export const persistor = persistStore(store)