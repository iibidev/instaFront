import { Post } from "./post.model";

export interface Perfil {
    _id: string;
    nombre: string;
    usuario: string;
    descripcion: string;
    foto: string;
    posts: Array<Post>;
    seguidores: number;
    seguidos: number;
    sigues: boolean;
    me: boolean;
    ok: boolean;
    createdAt: string;
    updatedAt: string;
  }
  