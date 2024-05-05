"use client"

import { Auth } from "@supabase/auth-ui-react";
import { Modal } from "./Modal"
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useModal } from "@/hooks/useModal";
import toast from "react-hot-toast";


export const AuthModal = () => {
    const supabaseClient = createClientComponentClient<Database>()
    const router = useRouter()
    const { session } = useSessionContext();
    const { onClose, isOpen } = useModal();
    const onChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    useEffect(() => {
        if (session) {
            onClose();
            const createProfil =
                async () => {
                    const { data, error, status, count } = await supabaseClient
                        .from("users")
                        .upsert(
                            {
                                email: session.user.email ?? '',
                                id: session.user.id ?? ''
                            },
                        )

                    if (error && status !== 406) {
                        toast.error('Error logging in!')
                    }
                };
            createProfil();
        }
    }, [session, router, onClose])

    return (
        <Modal
            title="Welcome back!"
            description="Login to your account"
            isOpen={isOpen}
            onChange={onChange}>
            <Auth
                theme="dark"
                magicLink={false}
                providers={[]}
                supabaseClient={supabaseClient}
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                brand: '#854FF3',
                                brandAccent: "#8e5cf1",
                                inputText: "#FF",
                            }
                        }
                    }
                }}
            />
        </Modal>
    )
}