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
    let profit=0.0;
    const [totalProfit,setTotalProfit]=useState<number>();
    const [newClients,setNewClients]=useState<number>();
    const [currentProfit,setCurrentProfit]=useState<number>(0);
    const servicesMap=new Map();

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const firstDayOfCurrentMonth = `${year}-${month}-01T00:00:00+00:00`;
    const {userId} = useUserContext();
    const supabase=createClientComponentClient<Database>();

    //Getting current month visits

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
                    getCurrentMonthProfit(clientsData);
                } else {
                    console.log("Missing Data");
                    setMonthlyClinets(0);
                }
            };
            getMonthlyClients();
        }
    }, [userId, supabase]);

    //Getting current month profit

    useEffect(() => {
        if (userId) {
            const getServicesForBusiness = async () => {
                const { data: services, error } = await supabase
                .from("services")
                .select("service_id,price")
                .eq("business_id", businessId)
                if (error) {
                    console.log(error);
                }
                if (services) {
                    services.forEach((service)=>{
                        servicesMap.set(service.service_id,service.price)
                    });
                } else {
                    console.log("Something went wrong with downloanding service data");
                }
            };
            getServicesForBusiness();
        }
    }, [userId, supabase]);



    function getCurrentMonthProfit(clientsData: { service_id: number | null; end_time: string | null; }[]){
        console.log("Mapa:"+servicesMap)
        console.log("Data:"+clientsData)
        clientsData.forEach((visit)=>{
            if(servicesMap.has(visit.service_id)){
             profit+=parseFloat(servicesMap.get(visit.service_id));   
            }else{
                console.log("You dont have acces to this service");
            }
        })
        setCurrentProfit(profit)
    }

    //Getting visits in selected range time






    return (
        <>
            <main>
                <h1>
                    <VerticalChart></VerticalChart>
                     profit w tym miesiacu :{currentProfit}<br></br>
                     wizyty w tym miesiacu :{monthlyClients} 
                </h1>
            </main>
        </>
    );
}


