import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import type { User } from "../types/User";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  //ELMINAR REGISTROS
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // actualizar tabla sin recargar
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Usuarios</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
