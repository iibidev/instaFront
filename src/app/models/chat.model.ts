import { Perfil } from "./perfil.model";

export interface Chat{
    _id: string;
    miembros: Array<Perfil>,
    createdAt: string,
    updatedAt: string
}