"use client"

import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { OpinionForm } from "./OpinionForm";
import { Rating } from '@mui/material';
import { BusinessSlugIdProps, OpinionsData } from "@/types/types";
import { useUserContext } from "@/providers/userContextProvider";

export const BusinessOpinions = ({ businessSlugId }: BusinessSlugIdProps) => {
    const queryClient = useQueryClient();
    const supabase = createClientComponentClient<Database>();
    const [opinions, setOpinions] = useState<OpinionsData[]>([]);
    const [opinionsPerPage, setOpinionsPerPage] = useState(10);
    const { userRole } = useUserContext();

    const loadOpinions = useQuery(
        ['opinions', opinionsPerPage],
        async () => {
            const { data, error, status } = await supabase
                .from("opinions")
                .select("*")
                .eq("business_id", businessSlugId || "")
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
        loadOpinions.refetch();
    }, [opinionsPerPage]);

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
                                <h2 className="text-lg max-[150px] truncate">{opinion.user_name}</h2>
                                <Rating
                                    name="rating"
                                    value={opinion.opinion_rating}
                                    readOnly
                                />
                            </div>
                            <p className="text-black/70 max-w-[450px]">{opinion.opinion_text}</p>
                        </div>
                        <p className="text-black/70">{opinion.created_at}</p>
                    </div>
                ))}
                {opinions.length > 9 && (
                    <button onClick={() => {
                        setOpinionsPerPage(prevOpinionsPerPage => {
                            const newOpinionsPerPage = prevOpinionsPerPage + 10;
                            loadOpinions.refetch(newOpinionsPerPage as any);
                            return newOpinionsPerPage;
                        });
                    }}
                        className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-2 rounded-full font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm outline-none">Show more</button>
                )}
                {!userRole && (
                    <OpinionForm businessSlugId={businessSlugId} />
                )}
            </div >
        </>
    )
}