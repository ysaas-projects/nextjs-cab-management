"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RootState } from "@/store";

interface Props {
    allowedRoles: string[];
    children: React.ReactNode;
}

export default function RequireRole({ allowedRoles, children }: Props) {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (!user) {
            router.replace("/login");
            return;
        }

        const hasAccess = user.roles?.some((role: string) =>
            allowedRoles.includes(role)
        );

        if (!hasAccess) {
            router.replace("/unauthorized");
        }
    }, [user, allowedRoles, router]);

    if (!user) return null;

    const hasAccess = user.roles?.some((role: string) =>
        allowedRoles.includes(role)
    );

    if (!hasAccess) return null;

    return <>{children}</>;
}
