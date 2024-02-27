import { useBusinessContext } from "@/providers/businessContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Call, Message } from "iconsax-react";
import Link from "next/link";
import { useQuery } from "react-query";

type Business = Database['public']['Tables']['business-info']['Row'];

export const ContactInfo = () => {
    const supabase = createClientComponentClient<Database>();
    const { businessName, businessEmail, businessPhoneNumber } = useBusinessContext();

    return (
        <>
            <div className="flex flex-col gap-2 py-4 w-full">
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