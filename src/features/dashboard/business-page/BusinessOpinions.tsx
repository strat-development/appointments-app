"use client"

import { useBusinessContext } from "@/providers/businessContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

type Opinions = Database["public"]["Tables"]["opinions"]["Row"];

export const BusinessOpinions = ({ businessSlugId }: { businessSlugId: string }) => {
    const queryClient = useQueryClient();
    const businessId = useBusinessContext();
    const supabase = createClientComponentClient<Database>();
    const [opinions, setOpinions] = useState<Opinions[]>([]);

    const { data: opinionsData, isLoading, isError } = useQuery(
        ['opinions'],
        async () => {
            const { data, error, status } = await supabase
                .from("opinions")
                .select("*")
                .or(`business_id.eq.${businessSlugId || businessId}`)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setOpinions(data);
                queryClient.invalidateQueries(['opinions']);
            }
        },
    );

    return (
        <>
            <div>
                {opinions.map((opinion) => (
                    <div className="border-[.5px] rounded-2xl p-4 flex justify-between"
                        key={opinion.id}>
                        <div className="flex flex-col gap-2">
                            <h2>{opinion.user_name}</h2>
                            <div className="flex gap-4">
                                <p>{opinion.opinion_rating}</p>
                                <p>{opinion.opinion_text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}