// src/features/auth/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: any | null;
}

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<any>) => {
            state.user = action.payload;
        },
        logoutAction: (state) => {
            state.user = null;
        },
    },
});

export const { setCredentials, logoutAction } = authSlice.actions;
export default authSlice.reducer;
