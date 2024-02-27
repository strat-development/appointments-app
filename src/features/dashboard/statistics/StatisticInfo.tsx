"use client"
import { useUserContext } from "@/providers/userContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function StatisticInfo() {
    const [monthlyClients, setMonthlyClinets] = useState("");
    const dateFrom = "2024-01-01 00:00:00";
    const dateTo = "2024-04-01 00:00:00";
    const {userId} = useUserContext();
    const supabase=createClientComponentClient<Database>();

    // od pierwszego do pierwszego popbieramy kazdego klienta i sumujemy
    useEffect(() => {
        if (userId) {
            const getMonthlyClients = async () => {
                const { data: clientsData, error } = await supabase
                    .from("hours")
                    .select("*",  {count: 'exact'})
                    .eq("business_owner", userId)
                    .rangeAdjacent('endTime', '[' + dateFrom + ',' + dateTo + ']')

                if (error) {
                    console.log(error);
                }
                if (clientsData) {
                    console.log(clientsData)
                    // setMonthlyClinets(clientsData.);
                } else {
                    console.log("Missing Data");
                }
            };
            getMonthlyClients();
        }
    }, [userId, supabase]);


    return (
        <>
            <main>
                <h1>
                    {monthlyClients}
                </h1>
            </main>
        </>
    );
}