// importar consulta del modelo
const { getAllUsers } = require("../models/userModel");

//getUser es una funcion creada que se ejecuta cuando alguien haga el get/users
//req-res es por que en users se necesitan estos parametros
const getUsers = (req, res) => {
  //respuesta del callback hecho en el modelo
  getAllUsers((err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      // res es el objeto que usas para responder al cliente
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
};

module.exports = { getUsers };
