"use client";

import { useRouter } from "next/navigation";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";

interface Props {
    children: React.ReactNode;
}

import { useEffect } from "react";

export default function RequireAuth({ children }: Props) {
    const router = useRouter();
    const { data: user, isLoading } = useRetrieveUserQuery();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/login");
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="text-lg animate-pulse">Loading...</span>
            </div>
        );
    }

    if (!user) {
        // Avoid rendering anything while redirecting
        return null;
    }

    return <>{children}</>;
}

