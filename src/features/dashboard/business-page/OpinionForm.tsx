"use client"

import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { Rating } from '@mui/material';
import { BusinessSlugIdProps, OpinionsData } from "@/types/types";

export const OpinionForm = ({ businessSlugId }: BusinessSlugIdProps) => {
    const supabase = createClientComponentClient<Database>();
    const queryClient = useQueryClient();
    const [fullName, setFullName] = useState("");
    const [rating, setRating] = useState(0);
    const [opinion, setOpinion] = useState("");
    const opinionDate = new Date().toISOString();

    const AddOpinionMutation = useMutation(
        async (newOpinion: OpinionsData[]) => {
            await supabase
                .from("opinions")
                .insert(newOpinion)
                .eq("business_id", businessSlugId || "");
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['opinions']);
                toast.success('Opinion added!')
            },

            onError: () => {
                toast.error('Error adding the opinion!')
            }
        }
    );

    return (
        <div className="flex flex-col gap-4 mt-16">
            <h1 className="text-xl font-bold">Add your opinion</h1>
            <div className="border-[.5px] rounded-2xl p-4 flex justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex gap-4">
                        <input onChange={(e) => setFullName(e.target.value)}
                            type="text"
                            placeholder="Your name"
                            className="border-[.5px] rounded-2xl p-2 outline-none" />
                        <Rating
                            name="rating"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue as number);
                            }}
                        />
                    </div>
                    <textarea onChange={(e) => setOpinion(e.target.value)}
                        placeholder="Your opinion"
                        className="border-[.5px] rounded-2xl p-2 outline-none" />
                    <button onClick={() => {
                        AddOpinionMutation.mutateAsync([{
                            id: businessSlugId || "",
                            user_name: fullName,
                            opinion_rating: rating,
                            opinion_text: opinion,
                            created_at: opinionDate,
                            business_id: ""
                        }])

                        setFullName("");
                        setOpinion("");
                        setRating(0);
                    }}
                        className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-2 rounded-full font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm">
                        Submit
                    </button>
                </div>
            </div>
        </div >
    )
}