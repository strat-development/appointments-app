"use client"

import { useBusinessContext } from "@/providers/businessContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { use, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { OpinionForm } from "./OpinionForm";
import { Rating } from '@mui/material';

type Opinions = Database["public"]["Tables"]["opinions"]["Row"];

export const BusinessOpinions = ({ businessSlugId }: { businessSlugId: string }) => {
    const queryClient = useQueryClient();
    const businessId = useBusinessContext();
    const supabase = createClientComponentClient<Database>();
    const [opinions, setOpinions] = useState<Opinions[]>([]);
    const [opinionsPerPage, setOpinionsPerPage] = useState(10);

    const loadOpinions = useQuery(
        ['opinions'],
        async () => {
            const { data, error, status } = await supabase
                .from("opinions")
                .select("*")
                .or(`business_id.eq.${businessSlugId || businessId}`)
                .limit(opinionsPerPage)
                .order('created_at', { ascending: false });

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setOpinions(data);
                queryClient.invalidateQueries(['opinions']);
            }
        },
    );

    useEffect(() => {
        loadOpinions;
    }, []);

    return (
        <>
            <div className="flex flex-col gap-4 mb-24">
                <>
                    <h1 className="text-xl font-bold">Opinions</h1>
                </>
                {opinions.map((opinion) => (
                    <div className="border-[.5px] rounded-2xl p-4 flex justify-between"
                        key={opinion.id}>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-4">
                                <h2>{opinion.user_name}</h2>
                                <Rating
                                    name="rating"
                                    value={opinion.opinion_rating}
                                    readOnly
                                />
                            </div>
                            <p>{opinion.opinion_text}</p>
                        </div>
                        <p className="text-black/70">{opinion.created_at}</p>
                    </div>
                ))}
                {opinions.length > 10 && (
                    <button onClick={() => {
                        setOpinionsPerPage(prevOpinionsPerPage => {
                            const newOpinionsPerPage = prevOpinionsPerPage + 10;
                            loadOpinions.refetch();
                            return newOpinionsPerPage;
                        });
                    }}
                        className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-2 rounded-full font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm outline-none">Show more</button>
                )}
                <OpinionForm businessSlugId={businessSlugId} />
            </div >
        </>
    )
}