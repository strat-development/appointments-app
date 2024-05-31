import { useQuery } from "react-query";
import { AddSocialsModal } from "./AddSocialsModal";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { useState } from "react";
import { Facebook, Instagram } from "iconsax-react";
import { IoLogoTwitter } from "react-icons/io";
import Link from "next/link";
import { EditSocialsModal } from "./EditSocialsModal";
import { useUserContext } from "@/providers/userContextProvider";
import { BusinessSlugIdProps, SocialMediaTypes, SocialsData } from "@/types/types";

export const Socials = ({ businessSlugId }: BusinessSlugIdProps) => {
    const supabase = createClientComponentClient<Database>();
    const { businessId } = useBusinessContext()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { userRole } = useUserContext();
    const socialMediaIcons: Record<SocialMediaTypes, JSX.Element> = {
        Facebook: <Facebook />,
        Instagram: <Instagram />,
        Twitter: <IoLogoTwitter />,
    };


    const handleClose = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
    }

    const { data: socials, isLoading } = useQuery<SocialsData>(
        ['socials'],
        async () => {
            const { data, error } = await supabase
                .from('socials')
                .select('*')
                .or(`business_id.eq.${businessSlugId || businessId}`)
            if (error) {
                throw error;
            }
            return data?.[0];
        }
    )

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const parsedSocials = socials?.socials_data ? JSON.parse(socials?.socials_data as string) : null;

    return (
        <>

            {isLoading ?
                <div>Loading...</div>
                :
                <div className="w-full flex flex-col gap-4 max-[1024px]:mb-24">
                    <div className="flex gap-8 items-center w-full">
                        {parsedSocials && Object.entries(parsedSocials).map(([socialsType, value]) => {
                            const socialsAsObj = value as { link: string };
                            const Icon = socialMediaIcons[socialsType as SocialMediaTypes];
                            return (
                                <div className="flex flex-col gap-2 items-center"
                                    key={socialsType}>
                                    {Icon && <Link href={socialsAsObj.link}>
                                        <div className="flex flex-col gap-2 items-center">
                                            {Icon}
                                            <h3>{socialsType}</h3>
                                        </div>
                                    </Link>}
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        {!socials && userRole === "Employer" && (
                            < button onClick={() => setIsModalOpen(true)}>
                                Add Socials
                            </button>
                        )}
                        {socials && userRole === "Employer" && (
                            <button onClick={() => setIsEditModalOpen(true)}>
                                Edit Socials
                            </button>
                        )}
                        <AddSocialsModal isOpen={isModalOpen}
                            onClose={handleClose} />
                        <EditSocialsModal isOpen={isEditModalOpen}
                            onClose={handleClose} />
                    </div>
                </div>
            }
        </>
    );
}