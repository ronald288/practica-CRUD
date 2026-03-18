// importar libreria para poder conectar node.JS con MySQL
const mysql = require("mysql2");
require("dotenv").config();

// createConnection crea un objeto de conexión hacia MySQL
const connection = mysql.createConnection({
  // **VARIABLES DE ENTORNO**
  host: process.env.DB_HOST,
  user: process.env.DB_USERS,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// función que INICIA la conexión BD y servidor
const connectDB = () => {
  // promise ->Un objeto que representa un resultado futuro (éxito o error)
  return new Promise((resolve, reject) => {
    //Aquí Node intenta conectarse a MySQL.
    //connect es una función del objeto connection
    connection.connect((err) => {
      // la funcion arrow funcion se pasa como argumento (callback)
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
//exportacion de un objeto
module.exports = { connection, connectDB };
