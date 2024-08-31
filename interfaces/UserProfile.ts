import { Github } from "./Github";
import { MercadoLibre } from "./MercadoLibre";

export interface UserProfile extends Github, MercadoLibre {
    reputation_level: string;
}