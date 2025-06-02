import { Perfil } from "./perfil.model";

export interface Post {
    _id: string;
    id_usuario: string;
    usuario: string;
    fotoPerfil: string;
    descripcion: string;
    url: string;
    portada: String;
    likeado: boolean;
    likes: number;
    comentarios: number;
    perfil: Perfil
    tipo: string;
    fecha: string;
  }
  