import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import '../../../styles/tabs.css';
import { Modal } from '@/components/Modal';
import { useUserContext } from '@/providers/userContextProvider';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Database } from '@/types/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BusinessData } from '@/types/types';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useBusinessContext } from '@/providers/businessContextProvider';

interface UserDataModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type UserData = Database["public"]["Tables"]["users"]["Row"]
type BusinessType = Database["public"]["Tables"]["business-type-info-linker"]["Row"]

export const SettingsModal = ({ onClose, isOpen }: UserDataModalProps) => {
    const { userRole, userId } = useUserContext();
    const queryClient = useQueryClient();
    const supabase = createClientComponentClient<Database>();
    const [selectedOption, setSelectedOption] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [businessEmail, setBusinessEmail] = useState('');
    const [businessPhone, setBusinessPhone] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [businessCountry, setBusinessCountry] = useState('');
    const [businessCity, setBusinessCity] = useState('');
    const { businessId } = useBusinessContext();

    const { data: businessTypes } = useQuery(
        ['businessTypes'],
        async () => {
            const { data } = await supabase
                .from('business-types')
                .select('*');

            return data;
        }
    )

    const createBusinessMutation = useMutation(
        async (newBusiness: BusinessData) => {
            await supabase
                .from('business-info')
                .upsert(newBusiness)
                .eq('business_owner', userId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['users']);
                toast.success('Business created successfully!');

                onClose();
            },

            onError: () => {
                toast.error('Error creating the business!')
            }
        }
    )

    const changeUserRoleMutation = useMutation(
        async (role: UserData) => {
            await supabase
                .from('users')
                .upsert(role)
                .eq('id', userId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['users']);
                toast.success('Role changed successfully!');

                onClose();
            },

            onError: () => {
                toast.error('Error changing the role!')
            }
        }
    )

    const setBusinessTypeMutation = useMutation(
        async (type: BusinessType) => {
            await supabase
                .from('business-type-info-linker')
                .upsert(type);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['businessTypes']);
                toast.success('Business type added successfully!');

                onClose();
            },

            onError: () => {
                toast.error('Error adding the business type!')
            }
        }
    )


    const bodyContent = (
        <>
            <Tabs.Root className="TabsRoot" defaultValue="tab1">
                <Tabs.List className="TabsList" aria-label="Manage your account">
                    <Tabs.Trigger className="TabsTrigger" value="tab1">
                        Email templates
                    </Tabs.Trigger>
                    {userRole === "Client" && (
                        <Tabs.Trigger className="TabsTrigger" value="tab2">
                            <p className='font-semibold'>
                                Visio <span className="bg-gradient-to-br from-[#FF1B6B] to-[#8390CE] bg-clip-text text-transparent">PRO</span>
                            </p>
                        </Tabs.Trigger>
                    )}
                    {userRole === "Employer" && (
                        <Tabs.Trigger className="TabsTrigger" value="tab2">
                            <p className='font-semibold'>
                                Business settings
                            </p>
                        </Tabs.Trigger>
                    )}
                </Tabs.List>
                <Tabs.Content className="TabsContent" value="tab1">
                    <p className="Text">Make changes to your account here. Click save when you're done.</p>
                    <fieldset className="Fieldset">
                        <label className="Label" htmlFor="name">
                            Name
                        </label>
                        <input className="Input" id="name" defaultValue="Pedro Duarte" />
                    </fieldset>
                    <fieldset className="Fieldset">
                        <label className="Label" htmlFor="username">
                            Username
                        </label>
                        <input className="Input" id="username" defaultValue="@peduarte" />
                    </fieldset>
                    <div style={{ display: 'flex', marginTop: 20, justifyContent: 'flex-end' }}>
                        <button className="Button green">Save changes</button>
                    </div>
                </Tabs.Content>
                {userRole === "Client" && (
                    <Tabs.Content className="TabsContent" value="tab2">
                        <p className="Text">Here you can switch to Visio Business</p>
                        <fieldset className="Fieldset">
                            <label className="Label"
                                htmlFor="businessName">
                                Business name
                            </label>
                            <input className="Input"
                                onChange={(e) => setBusinessName(e.target.value)}
                                id="businessName"
                                type="text" />
                        </fieldset>
                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="businessEmail">
                                Business email
                            </label>
                            <input className="Input"
                                onChange={(e) => setBusinessEmail(e.target.value)}
                                id="businessEmail"
                                type="text" />
                        </fieldset>
                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="businessPhone">
                                Business phone
                            </label>
                            <input className="Input"
                                onChange={(e) => setBusinessPhone(e.target.value)}
                                id="businessPhone"
                                type="text" />
                        </fieldset>
                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="businessAddress">
                                Address
                            </label>
                            <input className="Input"
                                onChange={(e) => setBusinessAddress(e.target.value)}
                                id="businessAddress"
                                type="text" />
                        </fieldset>
                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="businessCountry">
                                Country
                            </label>
                            <input className="Input"
                                onChange={(e) => setBusinessCountry(e.target.value)}
                                id="businessCountry"
                                type="text" />
                        </fieldset>
                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="businessCity">
                                City
                            </label>
                            <input className="Input"
                                onChange={(e) => setBusinessCity(e.target.value)}
                                id="businessCity"
                                type="text" />
                        </fieldset>
                        <div style={{ display: 'flex', marginTop: 20, justifyContent: 'flex-end' }}>
                            <button onClick={() => {
                                Swal.fire({
                                    title: 'Are you sure?',
                                    text: "You are about to create a business, after this you'll have to select business type in settings",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, create business!'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        createBusinessMutation.mutateAsync({
                                            business_name: businessName,
                                            business_email: businessEmail,
                                            business_phone_number: businessPhone,
                                            business_address: businessAddress,
                                            business_country: businessCountry,
                                            business_city: businessCity,
                                            business_owner: userId
                                        } as BusinessData)

                                        changeUserRoleMutation.mutateAsync({
                                            id: userId,
                                            role: 'Employer'
                                        } as UserData)
                                    }
                                })
                            }}
                                className="Button green">Create business</button>
                        </div>
                    </Tabs.Content>
                )}
                {userRole === "Employer" && (
                    <Tabs.Content className="TabsContent" value="tab2">
                        <p className="Text">Here you can switch to Visio Business</p>
                        <fieldset className="Fieldset">
                            <label className="Label" htmlFor="businessType">
                                Business type
                            </label>
                            <div className='flex gap-4'>
                                <select className="Input outline-none"
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                    id="businessType">
                                    <option value="">Select business type</option>
                                    {businessTypes?.map((type) => (
                                        <option key={type.id} value={type.id}>{type['business-type']}</option>
                                    ))}
                                </select>
                                <button className="Button green cursor-pointer"
                                    onClick={() => {
                                        setBusinessTypeMutation.mutateAsync({
                                            business_type_id: selectedOption,
                                            business_id: businessId,
                                            business_city_name: businessCity,
                                        } as BusinessType)
                                    }}>Save</button>
                            </div>
                        </fieldset>
                    </Tabs.Content>
                )}
            </Tabs.Root>
        </>
    )

    return (
        <>
            <Modal isOpen={isOpen}
                onClose={onClose}
                title=''
                body={bodyContent}
            />
        </>
    )
}