//COMPONENTES
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { User } from "../types/User";
import { useRef } from "react";
import type { UserForm } from "../types/UserForm";
import * as userService from "../services/userService";

// ****ESTADOS****
const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const editFormRef = useRef<HTMLFormElement | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserForm>();

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
      setLoadingUsers(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      showAlert(msg, "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  //MOSTRAR TODOS LOS USUARIOS
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, []);

  //CREAR REGISTROS
  const onCreate = async (data: UserForm) => {
    try {
      setLoadingCreate(true);
      await userService.createUser(data);
      showAlert("Usuario creado correctamente");
      reset();
      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      showAlert(msg, "error");
    } finally {
      setLoadingCreate(false);
    }
  };

  //ACTUALIZAR REGISTRO
  const onUpdate = async (data: UserForm) => {
    setLoadingUpdate(true);
    if (!selectedUser) return;

    try {
      const dataToSend = {
        ...data,
        password: data.password || undefined,
      };

      await userService.updateUser(selectedUser.id, dataToSend);

      showAlert("Usuario actualizado correctamente");
      setSelectedUser(null);
      resetEdit();
      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setErrorEdit("email", {
        type: "server",
        message: msg,
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  // ELIMINAR USUARIO
  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showAlert("Usuario eliminado correctamente");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      showAlert(msg, "error");
    } finally {
      setDeletingId(null);
    }
  };

  // FORM CREAR
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setError: setErrorEdit,
    reset: resetEdit,
    setValue,
    formState: { errors: errorsEdit },
  } = useForm<UserForm>({});

  // FORM EDITAR
  const handleEdit = (user: User) => {
    setSelectedUser(user);

    setValue("name", user.name);
    setValue("email", user.email);
    setValue("password", "");

    setTimeout(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="container mt-4">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit(onCreate)} className="card p-3 mb-3">
        <h4>Crear Usuario</h4>

        <input
          {...register("name", { required: "Nombre obligatorio" })}
          className="form-control mb-2"
          placeholder="Nombre"
        />
        {errors.name && (
          <span className="text-danger small">{errors.name.message}</span>
        )}

        <input
          {...register("email", {
            required: "Email obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email inválido",
            },
          })}
          className="form-control mb-2"
          placeholder="Email"
        />
        {errors.email && (
          <span className="text-danger small">{errors.email.message}</span>
        )}

        <input
          type="password"
          {...register("password", {
            required: "Contraseña obligatoria",
            minLength: { value: 6, message: "Mínimo 6 caracteres" },
          })}
          className="form-control mb-2"
          placeholder="Contraseña"
        />
        {errors.password && (
          <span className="text-danger small">{errors.password.message}</span>
        )}

        <button className="btn btn-primary" disabled={loadingCreate}>
          {loadingCreate ? "Creando..." : "Crear"}
        </button>
      </form>

      {loadingUsers ? (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border"></div>
          <span className="ms-2">Cargando usuarios...</span>
        </div>
      ) : (
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
                    onClick={() => setUserToDelete(user)} // 👈 abre modal
                  >
                    Eliminar
                  </button>

                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(user)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedUser && (
        <form
          ref={editFormRef}
          onSubmit={handleSubmitEdit(onUpdate)}
          className="card p-3 mt-3"
        >
          <h3>Editar Usuario</h3>

          <input
            {...registerEdit("name", { required: "Nombre obligatorio" })}
            className="form-control mb-2"
          />
          {errorsEdit.name && (
            <span className="text-danger small">{errorsEdit.name.message}</span>
          )}

          <input
            {...registerEdit("email", { required: "Email obligatorio" })}
            className="form-control mb-2"
          />
          {errorsEdit.email && (
            <span className="text-danger small">
              {errorsEdit.email.message}
            </span>
          )}

          <input
            type="password"
            {...registerEdit("password", {
              validate: (value) => {
                if (!value) return true;
                return value.length >= 6 || "Mínimo 6 caracteres";
              },
            })}
            className="form-control mb-2"
            placeholder="Nueva contraseña (opcional)"
          />
          {errorsEdit.password && (
            <span className="text-danger small">
              {errorsEdit.password.message}
            </span>
          )}

          <div className="d-flex justify-content-end gap-2 mt-2">
            <button className="btn btn-primary btn-sm" disabled={loadingUpdate}>
              {loadingUpdate ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setSelectedUser(null);
                resetEdit();
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {userToDelete && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar eliminación</h5>
                </div>

                <div className="modal-body">
                  <p>
                    ¿Seguro que deseas eliminar a <b>{userToDelete.name}</b>?
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-danger"
                    disabled={deletingId === userToDelete.id}
                    onClick={async () => {
                      await handleDelete(userToDelete.id);
                      setUserToDelete(null);
                    }}
                  >
                    {deletingId === userToDelete.id
                      ? "Eliminando..."
                      : "Eliminar"}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setUserToDelete(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
