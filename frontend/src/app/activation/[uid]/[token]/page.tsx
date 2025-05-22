"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActivationMutation } from "@/redux/features/authApiSlice";
import { toast } from "react-toastify";

interface Params {
  uid: string;
  token: string;
}
interface Props {
  params: Params | Promise<Params>;
}

export default function Page({ params }: Props) {
  const router = useRouter();
  const [activation] = useActivationMutation();

  useEffect(() => {
    (async () => {
      // Await if params is a Promise, otherwise use as is
      const resolvedParams: Params =
        typeof (params as any).then === "function"
          ? await params
          : (params as Params);

      const { uid, token } = resolvedParams;
      activation({ uid, token })
        .unwrap()
        .then(() => {
          toast.success("Account activated successfully");
        })
        .catch(() => {
          toast.error("Failed to activate account");
        })
        .finally(() => {
          router.push("/auth/login");
        });
    })();
  }, [activation, router, params]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Activating your account...
        </h1>
      </div>
    </div>
  );
}