import { PasswordResetConfirmForm } from "@/components/forms"
import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
    title: "Full Auth | Password Reset Confim",
    description: "Full Auth password reset confirm page",
}

interface Props {
    params: { uid: string, token: string }
}

const Page = async ({ params }: Props) => {
    const { uid, token } = params;
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                    alt="Full Auth"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="mx-auto h-10 w-auto"
                    width={40}
                    height={40}
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Reset your password
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <PasswordResetConfirmForm uid={uid} token={token} />
            </div>
        </div>
    )
}

export default Page