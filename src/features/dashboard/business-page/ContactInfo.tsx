import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Call, Message } from "iconsax-react";
import Link from "next/link";
import { useQuery } from "react-query";

type Business = Database['public']['Tables']['business-info']['Row'];

export const ContactInfo = () => {
    const supabase = createClientComponentClient<Database>();
    const businessName = "Visio";

    const { data: contactInformation } = useQuery<Business>(
        ['business'],
        async () => {
            const { data, error } = await supabase
                .from('business-info')
                .select('*')
                .eq('business_name', businessName);
            if (error) {
                throw error;
            }
            return data?.[0];
        }
    )

    return (
        <>
            <div className="flex flex-col gap-2 py-4 w-full">
                {contactInformation?.business_email &&
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Message size="24" />
                            <p>{contactInformation?.business_email}</p>
                        </div>
                        <Link href={`mailto:${contactInformation?.business_email}`}>
                            <button>
                                Email
                            </button>
                        </Link>
                    </div>

                }
                {contactInformation?.business_email &&
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Call size="24" />
                            <p>{contactInformation?.business_phone_number}</p>
                        </div>
                        <Link href={`tel:${contactInformation?.business_phone_number}`}>
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