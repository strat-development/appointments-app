import { Database } from "./supabase";

export interface BusinessSlugIdProps {
    businessSlugId?: string;
}

export type BusinessData = Database["public"]["Tables"]["business-info"]["Row"];

export type EmployeesData = Database["public"]["Tables"]["employees"]["Row"]

export type OpeningHoursData = Database["public"]["Tables"]["business-opening-hours"]["Row"];

export type SocialsData = Database["public"]["Tables"]["socials"]["Row"];

export type SocialMediaTypes = 'Facebook' | 'Instagram' | 'Twitter';

export type ServicesData = Database['public']['Tables']['services']['Row'];

export type VisitsData = Database["public"]["Tables"]["visits"]["Row"]

export type ClientsData = Database["public"]["Tables"]["clients"]["Row"]

export type Images = Database['public']['Tables']['business-images']['Row'];

export type OpinionsData = Database["public"]["Tables"]["opinions"]["Row"];

export type PositionsData = Database["public"]["Tables"]["positions"]["Row"]

export type BusinessTypeData = Database["public"]["Tables"]["business-types"]["Row"]