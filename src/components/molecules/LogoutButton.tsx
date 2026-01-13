"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import Button from "@/components/atoms/Button";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.replace("/signin");
    };

    return (
        <Button variant="danger" onClick={handleLogout}>
            Logout
        </Button>
    );
}
