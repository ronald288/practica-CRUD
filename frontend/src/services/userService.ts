//librería que sirve para hacer peticiones HTTP a APIs o servidores.
import axios from "axios";
import type { User } from "../types/User";
import type { UserForm } from "../types/UserForm";
import { handleAxiosError } from "../utils/handleAxiosError";

const API_URL = "http://localhost:3000/users";

// OBTENER TODOS
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<User[]>(API_URL);
    return response.data;
  } catch (err) {
    return handleAxiosError(err);
  }
};

// CREAR USUARIO
export const createUser = async (user: UserForm) => {
  try {
    const response = await axios.post(API_URL, user);
    return response.data;
  } catch (err) {
    handleAxiosError(err);
  }
};

// ACTUALIZAR USUARIO
export const updateUser = async (id: number, user: Partial<User>) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, user);
    return response.data;
  } catch (err) {
    handleAxiosError(err);
  }
};

// ELIMINAR USUARIO
export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (err) {
    handleAxiosError(err);
  }
};
