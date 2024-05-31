import { useUserContext } from "@/providers/userContextProvider";
import { Database } from "@/types/supabase";
import { BusinessData, BusinessSlugIdProps } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Heart, Share } from "iconsax-react";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";

export const BusinessDescription = ({ businessSlugId }: BusinessSlugIdProps) => {
    const supabase = createClientComponentClient<Database>();
    const [businessInfoData, setBusinessInfoData] = useState<BusinessData>();
    const { userId } = useUserContext();
    const [isFavorite, setIsFavorite] = useState(false);

    const checkFavoriteStatus = async () => {
        const { data, error } = await supabase
            .from('favourite-businesses')
            .select('*')
            .eq('user_id', userId)
            .eq('business_id', businessSlugId || "")
            .single();

        setIsFavorite(!!data);
    };

    useEffect(() => {
        checkFavoriteStatus();
    }, [businessSlugId]);

    const copyToClipboard = async (text: string) => {
        if ('clipboard' in navigator) {
            try {
                await navigator.clipboard.writeText(text);
                toast.success('Link copied to clipboard!');
            } catch (err) {
                toast.error('Failed to copy!');
            }
        } else {
            toast.error('Clipboard not supported!');
        }
    };

    const { data: businessData, isLoading } = useQuery(
        ['business-data', businessSlugId],
        async () => {
            const { data, error } = await supabase
                .from('business-info')
                .select('*')
                .eq('id', businessSlugId || "")
                .single()
            if (error) {
                throw error;
            } else {
                setBusinessInfoData(data);
            }
        }
    )

    const toggleFavorite = async () => {
        if (!businessSlugId) {
            return;
        }

        if (isFavorite) {
            const { error } = await supabase
                .from('favourite-businesses')
                .delete()
                .match({ user_id: userId, business_id: businessSlugId });

            if (error) {
                toast.error('Failed to remove from favourites!');
            } else {
                toast.success('Business removed from favourites!');
                setIsFavorite(false);
            }
        } else {
            const { error } = await supabase
                .from('favourite-businesses')
                .insert([
                    { user_id: userId, business_id: businessSlugId }
                ]);

            if (error) {
                toast.error('Failed to add to favourites!');
            } else {
                toast.success('Business added to favourites!');
                setIsFavorite(true);
            }
        }
    };

    return (
        <>
            {isLoading ? <div>Loading...</div> : (
                <div className="flex items-start justify-between w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-semibold max-[600px]:text-base w-fit">{businessInfoData?.business_name}</h1>
                        <p className="text-black/70 max-[600px]:text-sm max-[480px]:w-[80%]">{businessInfoData?.business_address}</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => copyToClipboard(window.location.href)}>
                            <Share className="hover:text-blue-500 transition" />
                        </button>
                        {userId && (
                            <button
                                onClick={toggleFavorite}>
                                <Heart className="hover:text-red-500 transition" />
                            </button>
                        )}
                        {!userId && (
                            <button onClick={() => toast.error("You have to create an account!")}>
                                <Heart />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}