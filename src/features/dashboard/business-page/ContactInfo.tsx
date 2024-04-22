import { useBusinessContext } from "@/providers/businessContextProvider";
import { Database } from "@/types/supabase";
import { BusinessSlugIdProps } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Call, Message } from "iconsax-react";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";

interface ContactInfoProps {
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
}

export const ContactInfo = ({ businessSlugId }: ContactInfoProps) => {
    const [businessEmail, setBusinessEmail] = useState<string>("")
    const [businessPhoneNumber, setBusinessPhoneNumber] = useState<string>("")
    const supabase = createClientComponentClient<Database>();

    const { data: contactInfo } = useQuery(
        ['contactInfo', businessSlugId],
        async () => {
            const { data, error } = await supabase
                .from('business-info')
                .select('business_email, business_phone_number')
                .eq('id', businessSlugId || "")
                .single()
            if (error) {
                throw error;
            } else {
                setBusinessEmail(data?.business_email || "");
                setBusinessPhoneNumber(data?.business_phone_number || "");
            }

            return data || [];
        }
    )

    return (
        <>
            <div className="flex flex-col gap-2 p-4 w-full">
                {businessEmail &&
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Message size="24" />
                            <p>{businessEmail}</p>
                        </div>
                        <Link href={`mailto:${businessEmail}`}>
                            <button>
                                Email
                            </button>
                        </Link>
                    </div>

                }
                {businessPhoneNumber &&
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Call size="24" />
                            <p>{businessPhoneNumber}</p>
                        </div>
                        <Link href={`tel:${businessEmail}`}>
                            <button>
                                Call
                            </button>
                        </Link>
                    </div>
                }
            </div>
        </>
    )
}