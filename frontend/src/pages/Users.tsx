//COMPONENTES

import { useEffect, useState } from "react";
import type { User } from "../types/User";
import type { UserForm } from "../types/UserForm";
import * as userService from "../services/userService";

const Users = () => {
  // ****ESTADOS****
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
  });

  //MOSTRAR MENSAJE
  const showAlert = (msg: string, type: "success" | "error" = "success") => {
    setMessage("");
    setError("");

    if (type === "success") {
      setMessage(msg);
    } else {
      setError(msg);
    }

    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  // CARGAR USUARIOS
  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      showAlert(msg, "error");
    }
  };

  //MOSTRAR TODOS LOS USUARIOS
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

  //CREAR REGISTROS
  const createUser = async () => {
    try {
      if (!form.name.trim() || !form.email.trim() || !form.password) {
        showAlert("Todos los campos son obligatorios");
        return;
      }

      await userService.createUser(form);
      showAlert("Usuario creado correctamente");

      // limpiar formulario
      setForm({
        name: "",
        email: "",
        password: "",
      });

      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      showAlert(msg, "error");
    }
  };

  //ACTUALIZAR REGISTRO
  const updateUser = async () => {
    if (!selectedUser) return;
    try {
      await userService.updateUser(selectedUser.id, selectedUser);

      showAlert("Usuario actualizado correctamente ");
      setSelectedUser(null);

      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      showAlert(msg, "error");
    }
  };

  // ELIMINAR USUARIO
  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);

      setUsers((prev) => prev.filter((u) => u.id !== id));

      showAlert("Usuario eliminado correctamente");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      showAlert(msg, "error");
    }
  };

  //MANEJO INPUT CREAR
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //MANEJO INPUT EDITAR
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedUser) return;

    const { name, value } = e.target;

    setSelectedUser({
      ...selectedUser,
      [name]: value,
    });
  };

  return (
    <div className="container mt-4">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-3 mb-3">
        <h4>Crear Usuario</h4>

        <input
          name="name"
          className="form-control mb-2"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          className="form-control mb-2"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
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
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => handleDelete(user.id)}
                >
                  Eliminar
                </button>

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => setSelectedUser(user)}
                >
                  Editar
                </button>
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
            name="name"
            className="form-control mb-2"
            value={selectedUser.name}
            onChange={handleEditChange}
            placeholder="Nombre"
          />

          <input
            name="email"
            className="form-control mb-2"
            value={selectedUser.email}
            onChange={handleEditChange}
            placeholder="Email"
          />

          <input
            name="password"
            className="form-control mb-2"
            type="password"
            placeholder="Nueva contraseña"
            onChange={handleEditChange}
          />

          <button onClick={updateUser}>Guardar</button>
          <button onClick={() => setSelectedUser(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default Users;
