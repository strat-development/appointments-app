"use client"
import { BusinessContext, useBusinessContext } from "@/providers/businessContextProvider";
import { useUserContext } from "@/providers/userContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { count } from "console";
import { useEffect, useState } from "react";
import { VerticalChart } from "./VerticalChart";
  
export default function StatisticInfo() {
    const {businessId}= useBusinessContext();

    //Getting current month visits
    const [monthlyClients, setMonthlyClinets] = useState<number>();
    console.log(businessId)

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const firstDayOfCurrentMonth = `${year}-${month}-01T00:00:00+00:00`;

    const {userId} = useUserContext();
    const supabase=createClientComponentClient<Database>();

    useEffect(() => {
        if (userId) {
            const getMonthlyClients = async () => {
                const { data: clientsData, error } = await supabase
                .from("visits")
                .select("service_id,end_time",{ count: 'exact' })
                .eq("business_id", businessId)
                .eq("status","Finished")
                .gt('end_time',firstDayOfCurrentMonth)
                .lt('end_time',currentDate.toISOString())
                if (error) {
                    console.log(error);
                }
                if (clientsData) {
                    setMonthlyClinets(clientsData.length);
                } else {
                    console.log("Missing Data");
                    setMonthlyClinets(0);
                }
            };
            getMonthlyClients();
        }
    }, [userId, supabase]);

    //Getting visits in selected range time






    return (
        <>
            <main>
                <h1>
                    <VerticalChart></VerticalChart>
                     obecny miesiac={monthlyClients} 
                </h1>
            </main>
        </>
    );
}


