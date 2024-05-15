"use client"

import { useBusinessContext } from "@/providers/businessContextProvider";
import { useUserContext } from "@/providers/userContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { PieChart } from "./PieChart";
import "@/styles/statistic.css"
import toast from "react-hot-toast";

export default function StatisticInfo() {
    const { businessId } = useBusinessContext();
    const [monthlyClients, setMonthlyClinets] = useState<number>();
    let profit = 0.0;
    const [everyServiceCount, setEveryServiceCount] = useState<Map<number, number>>();
    const [serviceName, setServiceName] = useState<Map<number, string>>();
    const [currentProfit, setCurrentProfit] = useState<number>(0);
    const servicesMap = new Map<number, number>();
    const servicesNameMap = new Map<number, string>();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const firstDayOfCurrentMonth = `${year}-${month}-01T00:00:00+00:00`;
    const { userId } = useUserContext();
    const supabase = createClientComponentClient<Database>();
    const [selectedFirstDate, setSelectedFirstDate] = useState<Date | null>(null);
    const [selectedSecondDate, setSelectedSecondDate] = useState<Date | null>(null);

    useEffect(() => {
        if (userId) {
            const getMonthlyClients = async () => {
                const { data: clientsData, error } = await supabase
                    .from("visits")
                    .select("service_id,end_time", { count: 'exact' })
                    .eq("business_id", businessId)
                    .eq("status", "Finished")
                    .gt('end_time', firstDayOfCurrentMonth)
                    .lt('end_time', currentDate.toISOString())
                if (error) {
                    console.log(error);
                }
                if (clientsData) {
                    setMonthlyClinets(clientsData.length);
                    getCurrentMonthProfit(clientsData);
                    getEveryServiceCount(clientsData);
                } else {
                    setMonthlyClinets(0);
                }
            };
            getMonthlyClients();
        }
    }, [userId, supabase]);

    useEffect(() => {
        if (userId) {
            const getServicesForBusiness = async () => {
                const { data: services, error } = await supabase
                    .from("services")
                    .select("service_id,price,title")
                    .eq("business_id", businessId)
                if (services) {
                    services.forEach((service) => {
                        servicesMap.set(service.service_id, parseFloat(service.price));
                        servicesNameMap.set(service.service_id, service.title);
                    });
                    setServiceName(servicesNameMap);
                } else {
                    toast.error("Something went wrong with downloading service data");
                }
            };
            getServicesForBusiness();
        }
    }, [userId, supabase]);

    const getCurrentMonthProfit = (clientsData: { service_id: number | null; end_time: string | null; }[]) => {
        clientsData.forEach((visit) => {
            if (servicesMap.has(visit.service_id as any)) {
                profit += parseFloat(servicesMap.get(visit.service_id as any) as any);
            } else {
                toast.error("You dont have acces to this service");
            }
        })
        setCurrentProfit(profit)
    }


    const getEveryServiceCount = (clientsData: { service_id: number | null; end_time: string | null; }[]) => {
        const serviceCount = new Map<number, number>();

        clientsData.forEach((value) => {
            if (value.service_id !== null && serviceCount.has(value.service_id as any)) {
                let oldValue = serviceCount.get(value.service_id as any) || 0;
                serviceCount.set(value.service_id, oldValue + 1);
            } else {
                serviceCount.set(value.service_id as any, 1);
            }
        });
        setEveryServiceCount(serviceCount);
    }

    const getVisitsInSelectedRange = async () => {
        if (selectedFirstDate && selectedSecondDate) {
            const { data: visitsData, error } = await supabase
                .from("visits")
                .select("service_id,end_time", { count: 'exact' })
                .eq("business_id", businessId)
                .eq("status", "Finished")
                .gt('end_time', selectedFirstDate.toISOString())
                .lt('end_time', selectedSecondDate.toISOString())
            if (error) {
                console.log(error);
            }
            if (visitsData) {

            } else {
                console.log("Missing Data");
            }
        }
    }

    const getClientsInSelectedRange = async () => {
        if (selectedFirstDate && selectedSecondDate) {
            const { data: clientsData, error } = await supabase
                .from("visits")
                .select("service_id,end_time", { count: 'exact' })
                .eq("business_id", businessId)
                .eq("status", "Finished")
                .gt('end_time', selectedFirstDate.toISOString())
                .lt('end_time', selectedSecondDate.toISOString())
            if (error) {
                console.log(error);
            }
            if (clientsData) {
                setMonthlyClinets(clientsData.length);
                getCurrentMonthProfit(clientsData);
                getEveryServiceCount(clientsData);
            } else {
                setMonthlyClinets(0);
            }
        }
    }

    const getServicesInSelectedRange = async () => {
        if (selectedFirstDate && selectedSecondDate) {
            const { data: services, error } = await supabase
                .from("services")
                .select("service_id,price,title")
                .eq("business_id", businessId)
            if (error) {
                console.log(error);
            }
            if (services) {
                services.forEach((service) => {
                    servicesMap.set(service.service_id, service.price as any)
                    servicesNameMap.set(service.service_id, service.title)
                });
                setServiceName(servicesNameMap)
                
            } else {
                toast.error("Something went wrong with downloanding service data");
            }
        }
    }

    return (
        <>
            <main className="flex min-h-screen flex-col items-center justify-between">
                <div style={{ width: "500px", height: "300px" }}>
                    <PieChart serviceNameMap={serviceName || new Map<number, string>()} serviceCountMap={everyServiceCount || new Map<number, number>()} />
                    profit w tym miesiacu :{currentProfit}<br></br>
                    wizyty w tym miesiacu :{monthlyClients} <br /><br />
                </div>
                <div className="flex items-center justify-between w-[500px] h-[300px] bg-[#f5f5f5]">
                    <input type="date" id="datePicker"
                        min="2021-01-01"
                        max="2099-12-31"
                        onChange={(e) => {
                            setSelectedFirstDate(new Date(e.target.value));
                        }}
                    />
                    <input type="date" id="datePicker"
                        min="2021-01-01"
                        max="2099-12-31"
                        onChange={(e) => {
                            setSelectedSecondDate(new Date(e.target.value));
                        }}
                    />
                    <button onClick={() => {
                        getVisitsInSelectedRange();
                        getClientsInSelectedRange();
                        getServicesInSelectedRange();
                    }}>Wybierz</button>
                </div>
            </main>
        </>
    );
}

