import {
    useSessionContext,
    useUser as useSupaUser
} from "@supabase/auth-helpers-react";
import { createContext, useContext, useEffect, useState } from "react";

type BusinessContextType = {
    businessName: string;
    setBusinessName: (businessName: string) => void;
    businessEmail: string;
    setBusinessEmail: (businessEmail: string) => void;
    businessPhoneNumber: string;
    setBusinessPhoneNumber: (businessPhoneNumber: string) => void;
    businessAddress: string;
    setBusinessAddress: (businessAddress: string) => void;

};

export const BusinessContext = createContext<BusinessContextType | null>(null);

export default function BusinessContextProvider({ children }: { children: React.ReactNode }) {
    const [businessName, setBusinessName] = useState<string>("");
    const [businessEmail, setBusinessEmail] = useState<string>("");
    const [businessPhoneNumber, setBusinessPhoneNumber] = useState<string>("");
    const [businessAddress, setBusinessAddress] = useState<string>("");
    const {
        supabaseClient: supabase
    } = useSessionContext();
    const user = useSupaUser();
    
    useEffect(() => {
        if (user) {
            const getBusinessInfo = async () => {
                const { data: businessData, error } = await supabase
                    .from("business-info")
                    .select("business_name, business_email, business_phone_number,business_address")
                    .eq("business_owner", user.id)
                    .single();
                if (error) {
                    console.log(error);
                }
                if (businessData?.business_email && businessData?.business_name && businessData?.business_phone_number && businessData?.business_address) {
                    setBusinessAddress(businessData.business_address);
                    setBusinessName(businessData.business_name);
                    setBusinessPhoneNumber(businessData.business_phone_number);
                    setBusinessEmail(businessData.business_email);
                }else{
                    console.log("Missing Business Data");
                }
            };
            getBusinessInfo();
        }
    }, [user, supabase]);
    
    return (
        <BusinessContext.Provider value={{ 
            businessName, 
            setBusinessName, 
            businessEmail,
            setBusinessEmail,
            businessPhoneNumber,
            setBusinessPhoneNumber,
            businessAddress,
            setBusinessAddress}}>
            {children}
        </BusinessContext.Provider>
    );
}

export function useBusinessContext() {
    const context = useContext(BusinessContext);
    if (!context) {
        throw new Error(
            "useBusinessContext must be used within a BusinessContextProvider"
        );
    }
    return context;
}