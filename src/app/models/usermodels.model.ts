export interface userModel{
    id: number,
    username: string,
    password: string,
    firstname:string,
    lastname:string,
    user_rights: number
    planner: boolean
    converting: boolean
    delivery: boolean
    edit_orders: boolean
    lineup: boolean
    fg: boolean
    returns: boolean
    status_page: boolean
    import_orders: boolean
    packing: boolean
    useracc: boolean
    contact: string
    email: string
}