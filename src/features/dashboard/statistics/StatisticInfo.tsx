"use client"

import { useBusinessContext } from "@/providers/businessContextProvider";
import { useUserContext } from "@/providers/userContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { PieChart } from "./PieChart";
import "@/styles/statistic.css"
import toast from "react-hot-toast";
import { Graph } from "iconsax-react";
import CountUp from 'react-countup';
import { StatisticsTable } from "./StatisticsTable";
import { ServicesData, VisitsData } from "@/types/types";

export default function StatisticInfo() {
    const { businessId } = useBusinessContext();
    const [monthlyClients, setMothlyClients] = useState<number>();
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
    const [visitsData, setVisitsData] = useState<VisitsData[]>([]);
    const [servicesData, setServicesData] = useState<ServicesData[]>([]);


    useEffect(() => {
        if (userId) {
            const getMonthlyClients = async () => {
                const { data: clientsData, error } = await supabase
                    .from("visits")
                    .select("service_id,end_time, client_name", { count: 'exact' })
                    .eq("business_id", businessId)
                    .eq("status", "Finished")
                    .gt('end_time', firstDayOfCurrentMonth)
                    .lt('end_time', currentDate.toISOString())
                if (error) {
                    console.log(error);
                }
                if (clientsData) {
                    setMothlyClients(clientsData.length);
                    getCurrentMonthProfit(clientsData);
                    getEveryServiceCount(clientsData);
                    setVisitsData(clientsData as VisitsData[]);
                } else {
                    setMothlyClients(0);
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
                    setServicesData(services as ServicesData[]);

                } else {
                    toast.error("Something went wrong with downloading service data");
                }
            };
            getServicesForBusiness();
        }
    }, [userId, supabase]);

    const getCurrentMonthProfit = (clientsData: { service_id: number | null; end_time: string | null; }[]) => {
        let profit = 0;
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
                setMothlyClients(clientsData.length);
                getCurrentMonthProfit(clientsData);
                getEveryServiceCount(clientsData);
                setVisitsData(clientsData as VisitsData[]);
            } else {
                setMothlyClients(0);
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
                setServicesData(services as ServicesData[]);

            } else {
                toast.error("Something went wrong with downloanding service data");
            }
        }
    }

    return (
        <>
            <div className="p-4 rounded-lg bg-white w-full h-[90vh] overflow-y-auto flex flex-col gap-8">
                <div className="flex items-start justify-start self-start w-full border-b-[1px] pb-4 gap-2">
                    <Graph className="w-6 h-6 text-violet-500" />
                    <p className="text-lg font-medium">Statistics</p>
                </div>
                <div className="relative border-[1px] rounded-lg p-4 bg-white w-full h-[90vh] overflow-y-auto flex flex-col items-center justify-center gap-8">
                    <div className="absolute top-4 self-center flex items-center gap-8 w-fit h-fit">
                        <input className="py-2 px-4 border-[1px] rounded-md cursor-pointer"
                            type="date" id="datePicker"
                            min="2021-01-01"
                            max="2099-12-31"
                            onChange={(e) => {
                                setSelectedFirstDate(new Date(e.target.value));
                            }}
                        />
                        <input className="py-2 px-4 border-[1px] rounded-md cursor-pointer"
                            type="date" id="datePicker"
                            min="2021-01-01"
                            max="2099-12-31"
                            onChange={(e) => {
                                setSelectedSecondDate(new Date(e.target.value));
                            }}
                        />
                        <button className="py-2 px-4 border-[1px] border-violet-500 rounded-md text-violet-500 hover:bg-violet-500 hover:text-white transition-all duration-300"
                            onClick={() => {
                                getVisitsInSelectedRange();
                                getServicesInSelectedRange();
                            }}>Select</button>
                    </div>
                    <div className="flex gap-16 border-[1px] w-full h-full mt-16 p-8 rounded-md">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-4 items-center border-b-[1px] p-8">
                                <h1 className="text-7xl font-bold text-black/70">
                                    <CountUp end={monthlyClients as number} duration={1.5} />
                                </h1>
                                <p className="text-lg font-medium text-black/50">Monthly clients</p>
                            </div>
                            <div className="flex flex-col gap-4 items-center">
                                <h1 className="text-7xl font-bold text-black/70">
                                    <CountUp end={currentProfit} duration={1.5} />
                                </h1>
                                <p className="text-lg font-medium text-black/50">Current profit</p>
                            </div>
                        </div>
                        <div className="w-fit" >
                            <PieChart serviceNameMap={serviceName || new Map<number, string>()} serviceCountMap={everyServiceCount || new Map<number, number>()} />
                        </div>
                        <StatisticsTable visitsData={visitsData}
                            servicesData={servicesData}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

