"use client";

import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { Spinner } from "@/components/common";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { finishInitialLoad, clearJustLoggedOut } from "@/redux/features/authSlice";
import { useVerify } from "@/hooks";

interface Props {
    children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated, isLoading, justLoggedOut } = useAppSelector((state) => state.auth);
    const [shouldRender, setShouldRender] = useState(false);

    useVerify();
    // Safety: Ensure finishInitialLoad is always called once on mount if stuck
    useEffect(() => {
        // If isLoading is still true after 1 second, force finishInitialLoad
        if (!isLoading) return;
        const timeout = setTimeout(() => {
            dispatch(finishInitialLoad());
        }, 1000);
        return () => clearTimeout(timeout);
    }, [isLoading, dispatch]);

    // Track previous value of justLoggedOut to prevent double toasts
    const prevJustLoggedOut = useRef(justLoggedOut);

    useEffect(() => {
        if (isLoading) return; // return early if still loading
        if (isAuthenticated) {
            setShouldRender(true); // Proceed with rendering if authenticated
        } else if (prevJustLoggedOut.current) {
            toast.info("You have been logged out.");
            dispatch(clearJustLoggedOut());
            router.push("/auth/login");
            prevJustLoggedOut.current = false;
            return;
        } else if (justLoggedOut) {
            // Don't show toast, just clear the flag
            dispatch(clearJustLoggedOut());
            router.push("/auth/login");
            prevJustLoggedOut.current = false;
            return;
        } else {
            toast.error("You must be logged in to view this page.");
            router.push("/auth/login");
        }
    }, [isLoading, isAuthenticated, justLoggedOut, router, dispatch]);

    useEffect(() => {
        prevJustLoggedOut.current = justLoggedOut;
    }, [justLoggedOut]);

    if (isLoading || !shouldRender) {
        // Only show the spinner while loading or if the page hasn't been rendered yet
        return (
            <div className="flex justify-center my-8">
                <Spinner lg />
            </div>
        );
    }

    return <>{children}</>;
}
