require("dotenv").config(); // Cargar las variables de entorno en tu servidor
// express es un framework backend
const express = require("express"); // requiere funcion para importa una librería en Node.js
const app = express(); //Crear una aplicación backend usando Express.
const { connectDB } = require("./db"); //Destructuración ({}eligir UNA propiedad del objeto exportado)
const userRoutes = require("./routes/users"); //importar rutas
const cors = require("cors");

// ****MIDDLEWAR Y RUTAS*****
//.use() quiere decir usa esto en TODAS las peticiones
//una función que se ejecuta ANTES de que la petición llegue a tu endpoint
//express.json es un middlewar que permite que el servidor entienda datos JSON
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(userRoutes);

//funcion asincrona para iniciar el servidor hasta que se haga la conexion de la BD
const startServer = async () => {
  //try y catch es un red para capturar errores
  try {
    await connectDB(); //esperar la respuesta de la promesa
    // listen escuchar peticiones en un puerto
    // inicia el servidor, abre el puerto, escucha peticiones
    const server = app.listen(process.env.PORT, () => {
      console.log("Servidor corriendo en puerto 3000");
    });
    // escucha un evento que puede ocurrir en el servidor
    server.on("error", (error) => {
      console.log("error en el servidor", error);
    });
  } catch (error) {
    console.error("error al conectar a MySQL:", error);
  }
};

startServer();
