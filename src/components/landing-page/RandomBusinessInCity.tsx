import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface RandomBusinessInCityProps {
    city: string | null;
}

export const RandomBusinessInCity = ({ city }: RandomBusinessInCityProps) => {
    const supabase = createClientComponentClient<Database>();
    const [imageUrls, setImageUrls] = useState<{ businessId: string, publicUrl: string }[]>([]);
    const [businessData, setBusinessData] = useState<any>([]);

    const { data: businessTypesData, isLoading: isLoadingTypes, isError: isErrorTypes } = useQuery(
        ['businessTypes'],
        async () => {
            const { data, error } = await supabase
                .from('business-types')
                .select('*')

            if (error) {
                throw error;
            }

            const randomIndex = Math.floor(Math.random() * data.length);
            const selectedBusinessType = data[randomIndex];

            return selectedBusinessType;
        }
    )

    const { data: businessPagesDataNotAll, isLoading: isLoadingNotAll, isError: isErrorNotAll } = useQuery(
        ['businessPagesNotAll', businessTypesData],
        async () => {
            if (!businessTypesData) {
                return;
            }

            const { data, error, status } = await supabase
                .from("business-type-info-linker")
                .select(`
                    business-info (
                        business_name,
                        business_address,
                        id
                    )
                `)
                .eq('business_type_id', businessTypesData.id || "")
                .eq('business_city_name', city || "")

            if (error) {
                throw error;
            }

            console.log('Returned data:', data);

            setBusinessData(data);

            return data;
        },
        {
            enabled: !!businessTypesData,
        }
    )

    const { data: fetchedBusinessData, isLoading: isLoadingBusiness, isError: isErrorBusiness } = useQuery(
        ['businessData', businessTypesData],
        async () => {
            if (!businessTypesData) {
                return;
            }
    
            const { data, error } = await supabase
                .from("business-type-info-linker")
                .select(`
                    business-info (
                        business_name,
                        business_address,
                        id
                    )
                `)
                .eq('business_type_id', businessTypesData.id)
                .eq('business_city_name', city || "")
    
            if (error) {
                throw error;
            }
    
            return data;
        },
        {
            enabled: !!businessTypesData,
        }
    )

    const { data: images } = useQuery(
        ['random-business-images', fetchedBusinessData],
        async () => {
            if (!businessData) {
                return;
            }
    
            const { data, error } = await supabase
                .from("business-images")
                .select("*")
    
            if (error) {
                throw error;
            }
    
            return data;
        },
        {
            enabled: !!businessData,
        }
    )

    useEffect(() => {
        if (images) {
            Promise.all(images.map(async (image: any) => {
                const { data: publicURL } = await supabase.storage
                    .from('business-page-photos')
                    .getPublicUrl(image.image_url)

                return { businessId: image.business_id, publicUrl: publicURL.publicUrl };
            }))
                .then((publicUrls) => {
                    const filteredUrls = publicUrls.filter(url => url.businessId !== null);
                    setImageUrls(filteredUrls as { businessId: string, publicUrl: string }[]);
                })
                .catch(console.error);
        }
    }, [images]);

    return (
        <>
            <h1>
                {businessTypesData?.["business-type"]} in {city}
            </h1>
            {businessData && (
                <div>
                    {isLoadingTypes && <p>Loading...</p>}
                    {isErrorTypes && <p>Error loading business types</p>}

                    {businessData.map((business: any) => (
                        business["business-info"] ? (
                            <div key={business.id}>
                                <h2>{business["business-info"].business_name}</h2>
                                <p>{business["business-info"].business_address}</p>
                                <Image
                                    src={imageUrls.find((image) => image.businessId === business["business-info"].id)?.publicUrl || "/images/placeholder.jpg"}
                                    alt={business["business-info"].business_name}
                                    width={200}
                                    height={200}
                                />
                            </div>
                        ) : (
                            <p>No business data available for this type.</p>
                        )
                    ))}
                </div>
            ) || (
                    <p>Loading...</p>
                )}
        </>
    )
}