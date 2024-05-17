"use client"

import {
    IonNav
} from "@ionic/react";
import { NavComponent } from "./NavComponent";

export const Navbar = () => {
    return (
        <IonNav className="h-[70px]" root={() => <NavComponent />} />
    )
}