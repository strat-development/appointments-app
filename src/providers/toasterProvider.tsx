"use client"

import { Toaster } from "react-hot-toast"

export const ToasterProvider = () => {
    return (
        <Toaster
            toastOptions={{
                style: {
                    background: "#fff",
                    color: "#000",
                },
            }}
        />
    )
}