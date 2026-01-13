import { logoutAction } from "@/features/auth/authSlice";
import { store, persistor } from "@/store";

export const logout = async () => {
    try {
        // 🔹 Tell backend to clear HttpOnly cookie
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include", // IMPORTANT
        });
    } catch (error) {
        console.error("Logout API failed", error);
    }

    // 🔹 Clear redux state
    store.dispatch(logoutAction());

    // 🔹 Clear persisted redux store
    await persistor.purge();

    // 🔹 Redirect to login
    window.location.replace("/signin");
};
