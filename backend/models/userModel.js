// connection es el puente entre la conexion y la base de datos
const { connection } = require("../db");

// uso de promesas
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM users", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, name, email FROM users WHERE id = ?";
    connection.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const createUser = (name, email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    connection.query(sql, [name, email, password], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updateUser = (id, name, email, password) => {
  return new Promise((resolve, reject) => {
    let sql;
    let params;

    if (password && password.trim() !== "") {
      sql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
      params = [name, email, password, id];
    } else {
      // si no se envía contraseña, se mantiene la misma
      sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
      params = [name, email, id];
    }

    connection.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    connection.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      },
    );
  });
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
};
