// connection es el puente entre la conexion y la base de datos
const { connection } = requiere("../db");

// callback es necesario para recibir la respuesta
const getAllUsers = (callback) => {
  //por medio de connection.query hacemos las consultas
  connection.query("SELECT * FROM users", callback);
};

module.exports = { getAllUsers };
