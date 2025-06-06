import Link from "next/link"
import { LoginForm } from "@/components/forms"
import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
    title: "Notes | Login",
    description: "Notes login page",
}
export default function Page() {
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">           
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Image
              src="/logo-blue.png"
              alt="CodeHub Logo"
              width={300}
              height={300}
              className="mx-auto block dark:hidden"
            />
            <Image
              src="/logo-white.png"
              alt="CodeHub Logo"
              width={100}
              height={100}
              className="mx-auto hidden dark:block"
            />   
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Sign in
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <LoginForm />          

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}