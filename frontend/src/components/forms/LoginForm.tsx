"use client"

import { useLogin } from "@/hooks"
import { Form } from "@/components/forms"

export default function LoginForm() {
    const {
        email,
        password,
        isLoading,
        onChange,
        onSubmit
    } = useLogin();

    const config = [
        {
            labelId: "email",
            type: "email",
            value: email,
            labelText: "Email",
            required: true
        },
        {
            labelId: "password",
            type: "password",
            value: password,
            link: {
                linkText: "Forgot password?",
                linkUrl: "/password-reset"
            },
            labelText: "Password",
            required: true
        }
    ]
    return (
        <Form
            config={config}
            isLoading={isLoading}
            btnText="Sign in"
            onChange={onChange}
            onSubmit={onSubmit}
        />
    )
}