import { Mensaje } from "./mensaje.model";
import { Perfil } from "./perfil.model";

export interface Notificacion{
    mensaje: Mensaje,
    usuario: Perfil
}