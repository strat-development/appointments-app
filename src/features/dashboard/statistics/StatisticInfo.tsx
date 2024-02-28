"use client"
import { useUserContext } from "@/providers/userContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function StatisticInfo() {
    const [monthlyClients, setMonthlyClinets] = useState<number>();
    const dayFrom=30;
    const monthFrom=1;
    const yearFrom=2024;

    const dayTo=1;
    const monthTo=5;
    const yearTo=2024;

    
    const dateFrom="["+yearFrom+"-"+monthFrom+"-"+dayFrom+" 00:00]";
    const dateTo = "["+yearTo+"-"+monthTo+"-"+dayTo+" 00:00]";

    const businessId= "8666e1af-d200-4e9f-99a4-91c820fdb498";
    const {userId} = useUserContext();
    const supabase=createClientComponentClient<Database>();

    useEffect(() => {
        if (userId) {
            const getMonthlyClients = async () => {
                const { data: clientsData, error } = await supabase
                .from("visits")
                .select("*",  {count: 'exact'})
                .eq("business_id", businessId)
                .eq("status","Finished")
                .gt('end_time',dateFrom)
                .lt('end_time',dateTo)
                if (error) {
                    console.log(error);
                }
                if (clientsData) {
                    console.log(clientsData.length)
                    setMonthlyClinets(clientsData.length);
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
                     obecny miesiac={monthlyClients}
                </h1>
            </main>
        </>
    );
}


