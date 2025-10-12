import type { DonacionItem } from "./donacionItem";

export interface Donacion {
    id:number,
    donacionItem:DonacionItem
    cantidad:number
}