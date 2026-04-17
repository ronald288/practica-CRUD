//librería que sirve para hacer peticiones HTTP a APIs o servidores.
import axios from "axios";
import type { User } from "../types/User";
import type { UserForm } from "../types/userForm";

const API_URL = "http://localhost:3000/users";

// OBTENER TODOS
export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

// CREAR USUARIO
export const createUser = async (user: UserForm) => {
  const response = await axios.post(API_URL, user);
  return response.data;
};

// ACTUALIZAR USUARIO
export const updateUser = async (id: number, user: Partial<User>) => {
  const response = await axios.put(`${API_URL}/${id}`, user);
  return response.data;
};

// ELIMINAR USUARIO
export const deleteUser = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
