import { ThemePalette } from "@angular/material/core";
export interface orderList{
    id?: number
    date: string
    po: string
    so: string
    name: string
    item: string
    itemdesc: string
    qty: number
    lineup: boolean
    converting: boolean
    fg: boolean
    delivery: boolean
    shipqty: number
    prodqty: number
    deliverydate: string
    comment: string
    c: boolean,
    p: boolean,
    o: boolean,
    f: boolean,
    shipstatus: string,
    color?: string
    completed?: boolean
    taskName?: string;
}

export interface orderTask {
    taskName: string;
    completed: boolean;
    color: ThemePalette;
    subtasks?: orderList[];
  }