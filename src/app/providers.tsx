"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { SnackbarProvider } from "notistack";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SnackbarProvider
                    maxSnack={3}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    style={{ marginTop: "70px" }}
                >
                    {children}
                </SnackbarProvider>
            </PersistGate>
        </Provider>
    );
}
