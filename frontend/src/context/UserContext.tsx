import { createContext } from "react";
import type { Usuario } from "../models/usuario";

export const UserContext = createContext<Usuario | null>(null);