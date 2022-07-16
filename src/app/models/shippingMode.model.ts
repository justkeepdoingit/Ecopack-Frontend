import { ThemePalette } from "@angular/material/core";
export interface shippingList{
    id?: number
    date: string
    so: string
    po: string
    name: string
    item: string
    itemdesc: string
    qty: number
    deliverydate: string
    shipqty: number
    prodqty: number
    shipstatus: string
    deliveryqty: number
    color?: string
    completed?: boolean
    taskName?: string;
}

export interface shippingTask {
    taskName: string;
    completed: boolean;
    color: ThemePalette;
    subtasks?: shippingList[];
  }