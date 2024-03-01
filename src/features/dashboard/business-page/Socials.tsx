import { useQuery } from "react-query";
import { AddSocialsModal } from "./AddSocialsModal";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { useState } from "react";
import { Edit, Facebook, Instagram } from "iconsax-react";
import { IoLogoTwitter } from "react-icons/io";
import Link from "next/link";
import { EditSocialsModal } from "./EditSocialsModal";

type Socials = Database["public"]["Tables"]["socials"]["Row"];
type SocialMediaTypes = 'Facebook' | 'Instagram' | 'Twitter';

export const Socials = () => {
    const supabase = createClientComponentClient<Database>();
    const { businessName } = useBusinessContext()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const socialMediaIcons: Record<SocialMediaTypes, JSX.Element> = {
        Facebook: <Facebook />,
        Instagram: <Instagram />,
        Twitter: <IoLogoTwitter />,
    };


    const handleClose = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
    }

    const { data: socials, isLoading } = useQuery<Socials>(
        ['socials'],
        async () => {
            const { data, error } = await supabase
                .from('socials')
                .select('*')
                .eq('business_name', businessName);
            if (error) {
                throw error;
            }
            return data?.[0];
        }
    )

    if (isLoading) {
        return <div>Loading...</div>;

    }

    console.log(socials)

    const parsedSocials = JSON.parse(socials?.socials_data as string);

    console.log(socials)

    return (
        <>

            {isLoading ?
                <div>Loading...</div>
                :
                <div>
                    <div>
                        <h2>Socials</h2>
                        <div>
                            {parsedSocials && Object.entries(parsedSocials).map(([socialsType, value]) => {
                                const socialsAsObj = value as { link: string };
                                const Icon = socialMediaIcons[socialsType as SocialMediaTypes]; // Cast socialsType to SocialMediaTypes
                                return (
                                    <div key={socialsType}>
                                        <h3>{socialsType}</h3>
                                        {Icon && <Link href={socialsAsObj.link}>{Icon}</Link>} {/* Render the icon with the link */}
                                    </div>
                                );
                            })}
                        </div>
                        <div>
                            {!socials &&
                                < button onClick={() => setIsModalOpen(true)}>
                                    Add Socials
                                </button>
                            }
                            {socials &&
                                <button onClick={() => setIsEditModalOpen(true)}>
                                    Edit Socials
                                </button>
                            }
                            <AddSocialsModal isOpen={isModalOpen}
                                onClose={handleClose} />
                            <EditSocialsModal isOpen={isEditModalOpen}
                                onClose={handleClose} />
                        </div >
                    </div>
                </div>
            }
        </>
    );
}