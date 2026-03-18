// importar libreria para poder conectar node.JS con MySQL
const mysql = require("mysql2");
require("dotenv").config();

//connection es el objeto que REPRESENTA la conexión - Usa la conexión para hablar con la base de datos
// el objeto contiene los parametros necesarios de la funcion createConnection
const connection = mysql.createConnection({
  // **VARIABLES DE ENTORNO**
  host: process.env.DB_HOST,
  user: process.env.DB_USERS,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// función que INICIA la conexión BD y servidor
const connectDB = () => {
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
// Permite que otros archivos usen esta conexión
//exportacion de un objeto
module.exports = { connection, connectDB };
