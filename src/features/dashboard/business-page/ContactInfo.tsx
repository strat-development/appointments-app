import { useBusinessContext } from "@/providers/businessContextProvider";
import { Call, Message } from "iconsax-react";
import Link from "next/link";

export const ContactInfo = () => {
    const { businessEmail, businessPhoneNumber } = useBusinessContext();

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