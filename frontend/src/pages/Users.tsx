//COMPONENTES

import { useEffect, useState } from "react";
import type { User } from "../types/User";
import type { UserForm } from "../types/userForm";
import * as userService from "../services/userService";

const Users = () => {
  // ****ESTADOS****
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
  });

  //MOSTRAR TODOS LOS USUARIOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Error cargando usuarios",
        );
      }
    };
    fetchData();
  }, []);

  //CREAR REGISTROS
  const createUser = async () => {
    try {
      setMessage("");
      setError("");
      if (!form.name.trim() || !form.email.trim() || !form.password) {
        setError("Todos los campos son obligatorios");
        return;
      }
      await userService.createUser(form);
      setMessage("Usuario creado correctamente");

      // limpiar formulario
      setForm({
        name: "",
        email: "",
        password: "",
      });

      // recargar usuarios
      const updatedUsers = await userService.getUsers();
      setUsers(updatedUsers);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  //ACTUALIZAR REGISTRO
  const updateUser = async () => {
    if (!selectedUser) return;
    try {
      setMessage("");
      setError("");

      if (!selectedUser.name.trim() || !selectedUser.email.trim()) {
        setError("Nombre y email son obligatorios");
        return;
      }
      await userService.updateUser(selectedUser.id, selectedUser);

      setMessage("Usuario actualizado correctamente ");
      setSelectedUser(null);

      // volver a cargar usuarios
      const updatedUsers = await userService.getUsers();
      setUsers(updatedUsers);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  // ELIMINAR USUARIO
  const handleDelete = async (id: number) => {
    try {
      setMessage("");
      setError("");

      await userService.deleteUser(id);

      setUsers(users.filter((u) => u.id !== id));

      setMessage("Usuario eliminado correctamente");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Error eliminando usuario",
      );
    }
  };

  return (
    <div className="container mt-4">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-3 mb-3">
        <h4>Crear Usuario</h4>

        <input
          className="form-control mb-2"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="form-control mb-2"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn btn-primary" onClick={createUser}>
          Crear
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>
                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                <button onClick={() => setSelectedUser(user)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <h3>Editar Usuario</h3>

          <input
            value={selectedUser?.name || ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, name: e.target.value })
            }
            placeholder="Nombre"
          />

          <input
            value={selectedUser.email}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
            placeholder="Email"
          />

          <input
            type="password"
            placeholder="Nueva contraseña (opcional)"
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, password: e.target.value })
            }
          />

          <button onClick={updateUser}>Guardar</button>
          <button onClick={() => setSelectedUser(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default Users;
