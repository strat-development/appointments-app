import {
    useSessionContext,
    useUser as useSupaUser
} from "@supabase/auth-helpers-react";
import { createContext, useContext, useEffect, useState } from "react";
type UserContextType = {
    userName: string;
    setUserName: (userName: string) => void;
    userEmail: string;
    setUserEmail: (userEmail: string) => void;
    userPhoneNumber: string;
    setUserPhoneNumber: (userPhoneNumber: string) => void;

};

export const BusinessContext = createContext<UserContextType | null>(null);

export default function BusinessContextProvider({ children }: { children: React.ReactNode }) {
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [userPhoneNumber, setUserPhoneNumber] = useState<string>("");
    const {
        supabaseClient: supabase
    } = useSessionContext();
    const user = useSupaUser();
    
    useEffect(() => {
        if (user) {
            const getUserRole = async () => {
                const { data: userData, error } = await supabase
                    .from("users")
                    .select("full_name, email, phone_number")
                    .eq("id", user.id)
                    .single();
                if (error) {
                    console.log(error);
                }
                if (userData?.email && userData?.full_name && userData?.phone_number) {
                    console.log("Business Data ok");
                }else{
                    console.log("Missing Business Data");
                }
            };
            getUserRole();
        }
    }, [user, supabase]);

    return (
        <BusinessContext.Provider value={{ 
            userName, 
            setUserName, 
            userEmail,
            setUserEmail,
            userPhoneNumber,
            setUserPhoneNumber}}>
            {children}
        </BusinessContext.Provider>
    );
}

export function useBusinessContext() {
    const context = useContext(BusinessContext);
    if (!context) {
        throw new Error(
            "useUserContext must be used within a UserContextProvider"
        );
    }
    return context;
}