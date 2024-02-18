'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/supabase'
import { useMutation } from 'react-query'
import { useUserContext } from '@/providers/userContextProvider'
import { Modal } from '../Modal'
import toast from 'react-hot-toast'
import { Input } from '../Input'

export default function UserDetailsModal() {
    const supabase = createClientComponentClient<Database>()
    const [fullname, setFullname] = useState<string | null>(null)
    const [email, setEmail] = useState<string | null>(null)
    const [role, setRole] = useState<string | null>(null)
    const [companyAddres, setAddres] = useState<string | null>(null)
    const router = useRouter();
    const { userRole, userId } = useUserContext();

    // useEffect(() => {
    //     if (userRole) {
    //         router.push("/dashboard/schedule");
    //     }
    // }, [userRole, router])

    const updateProfile = useMutation(
        async ({
            fullname,
            email,
            role
        }: {
            fullname: string | null | undefined;
            email: string | null | undefined;
            role: string | null | undefined;
        }) => {
            await supabase
                .from('users')
                .upsert([
                    {
                        email: email ?? '',
                        full_name: fullname ?? '',
                        role: role ?? '',
                        id: userId ?? ''
                    },
                ])
        },
        {
            onSuccess: () => {
                toast.success('Profile updated!')
            },
            onError: () => {
                toast.error('Error updating the data!')
            },
        }
    );

    const updateSubordinate = useMutation(
        async ({
            fullname,
            email,
            role,
            id
        }: {
            fullname: string | null | undefined;
            email: string | null | undefined;
            role: string | null | undefined;
            id: string | null | undefined;
        }) => {
            await supabase
                .from('subordinates')
                .update({
                    email: email ?? '',
                    full_name: fullname ?? '',
                    role: role ?? '',
                    id: id ?? ''
                })
                .eq('email', email ?? '')
        },
        {
            onSuccess: () => {
                toast.success('Profile updated!')
            },
            onError: () => {
                toast.error('Error updating the data!')
            },
        }
    );

    const bodyContent = (
        <>
            {!userRole && (
                <div className="form-widget flex flex-col gap-4">
                    <div className='flex flex-col gap-2'>
                        <label className='font-bold text-base'
                            htmlFor="email">Email</label>
                        <Input
                            id="email"
                            label="Email"
                            type="text"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email || ''}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='font-bold text-base'
                            htmlFor="fullName">Full name</label>
                        <Input
                            id="fullName"
                            label="Full name"
                            type="text"
                            onChange={(e) => setFullname(e.target.value)}
                            value={fullname || ''}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            onChange={(e) => setRole(e.target.value)}>
                            <option value="Employer">Employer</option>
                            <option value="Employee">Employee</option>
                            <option value="Client">Client</option>
                        </select>
                    </div>
                    <div>
                        <button
                            className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                            onClick={() => {
                                updateProfile.mutateAsync({ fullname, email, role })

                                console.log('fullname', fullname)
                                console.log('email', email)
                                console.log('role', role)

                                updateSubordinate.mutateAsync({ fullname, email, role, id: userId })

                                router.push('/dashboard/schedule')
                            }
                            }
                        >
                            Update profile
                        </button>
                    </div>
                    <div>
                        <button onClick={async () => {
                            await supabase.auth.signOut();
                            router.push('/')
                        }} className="px-4 py-2 rounded-full hover:opacity-90 transition bg-violet-400 text-white w-full" type="submit">
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </>
    )

    return (
        <>
            <Modal isOpen={true}
                onClose={() => { }}
                title='User details'
                body={bodyContent}
            />
        </>
    )
}