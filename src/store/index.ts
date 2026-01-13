import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "@/features/auth/authSlice";
import { api } from "./api";
import { companyApi } from "@/features/company/companyApi";

// 🔹 Root reducer
const rootReducer = combineReducers({
    auth: authReducer,
    [api.reducerPath]: api.reducer,
});

// 🔹 Persist config
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"], // persist only auth state
};

// 🔹 Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(api.middleware),
    devTools: process.env.NODE_ENV !== "production",
});

// 🔹 Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
