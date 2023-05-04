const express = require('express');
const cors=require('cors');
const dbConnection = require('./db/config.js');
require('dotenv').config(); 


//Crear el servidor/aplicacion de express

const app=express();

//Conexion a BD
dbConnection();


//Directorio Público
app.use(express.static('public'));

//cors
app.use( cors() );

//Lectura de datos
app.use(express.json());

//Rutas
app.use('/api/auth',require('./routes/auth.js'));

app.listen(process.env.PORT, ()=>{
    console.log(`Servidor corriendo en ${process.env.PORT}`);
});