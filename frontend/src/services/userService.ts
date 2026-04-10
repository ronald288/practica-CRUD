//librería que sirve para hacer peticiones HTTP a APIs o servidores.
import axios from "axios";
import type { User } from "../types/User";

const API_URL = "http://localhost:3000/users";

// Obtener usuarios
export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Crear usuario
export const createUser = async (
  user: Omit<User, "id"> & { password: string },
) => {
  const response = await axios.post(API_URL, user);
  return response.data;
};
