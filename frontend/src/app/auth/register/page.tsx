import Link from "next/link"
import type { Metadata } from "next"
import { RegisterForm } from "@/components/forms"

export const metadata: Metadata = {
    title: "Notes | Register",
    description: "Notes App register page",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-2 py-12 lg:px-2">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Sign up
            </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <RegisterForm />

            <p className="mt-10 text-center text-sm/6 text-gray-500">
                Allready have an account?{' '}
                <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Login
                </Link>
            </p>
        </div>
    </div>
)
}
