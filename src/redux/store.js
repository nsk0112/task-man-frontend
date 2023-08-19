import { configureStore } from "@reduxjs/toolkit";
// import authSlice from "./Login/authSlice";
// import sidebarSlice from "./Sidebar/sidebarSlice";
import sidebarReducer from "./Sidebar/sidebarSlice";
import authReducer from "./Login/authSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';


const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedReducer,
        sidebar: sidebarReducer
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk]
})



export const persistor = persistStore(store)


