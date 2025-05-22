"use client"

import {useRegister} from "@/hooks"
import { Form } from "@/components/forms"

export default function RegisterForm() {
    const {
        first_name,
        last_name,
        email,
        password,
        re_password,
        isLoading,
        onChange,
        onSubmit
    } = useRegister();

    const config = [
        {
            labelId: "first_name",
            type: "text",
            value: first_name,
            labelText: "First name",
            required: true
        },
        {
            labelId: "last_name",
            type: "text",
            value: last_name,
            labelText: "Last name",
            required: true
        },
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
            labelText: "Password",
            required: true
        },
        {
            labelId: "re_password",
            type: "password",
            value: re_password,
            labelText: "Repeat password",
            required: true
        },
    ]
    return (
        <Form
            config={config}
            isLoading={isLoading}
            btnText="Sign up"
            onChange={onChange}
            onSubmit={onSubmit}
        />
    )
}