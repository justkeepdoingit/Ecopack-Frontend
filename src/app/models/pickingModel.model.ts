import { ThemePalette } from "@angular/material/core"

export interface pickingModel {
    id?: number
    date: string
    so: string
    po: string
    name: string
    item: string
    itemdesc: string
    qty: string
    prodqty: string
    pendingqty: string
    volume: string
    color?: string
    completed?: boolean
    taskName?: string;
}

export interface pickingTask {
    taskName: string;
    completed: boolean;
    color: ThemePalette;
    subtasks?: pickingModel[];
}

export interface pickingModel2 {
    id?: number
    prio?: number
    date: string
    so: string
    po: string
    name: string
    item: string
    itemdesc: string
    qty: string
    prodqty: string
    qtydeliver: string
    volume: string
}