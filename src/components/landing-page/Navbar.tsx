"use client"

import {
    IonNav
} from "@ionic/react";
import { NavComponent } from "./NavComponent";

export const Navbar = () => {
    return (
        <IonNav className="h-[70px] fixed z-[222222222]" root={() => <NavComponent />} />
    )
}