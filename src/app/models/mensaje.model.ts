export interface Mensaje{
    _id: string,
    id_usuario: string,
    id_chat: string,
    tipo: string,
    msg: any,
    duracion: number,
    visto: boolean,
    yo: boolean,
    createdAt: string,
    updatedAt: string
}