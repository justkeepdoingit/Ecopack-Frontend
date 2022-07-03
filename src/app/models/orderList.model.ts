import { ThemePalette } from "@angular/material/core";
export interface orderList{
    id?: number
    date: Date
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
    deliverydate: Date
    comment: string
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