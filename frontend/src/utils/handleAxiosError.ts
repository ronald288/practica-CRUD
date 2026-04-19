import axios from "axios";

export const handleAxiosError = (err: unknown): never => {
  if (axios.isAxiosError(err)) {
    const msg = err.response?.data?.error || "Error en el servidor";
    throw new Error(msg);
  }

  throw new Error("Error desconocido");
};
