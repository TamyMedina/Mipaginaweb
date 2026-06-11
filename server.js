const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));


// CONEXIÓN MYSQL
const conexion = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "051007",
    database: "usuarios_db"

});


// VERIFICAR CONEXIÓN
conexion.connect((error)=>{

    if(error){

        console.log(error);

    }else{

        console.log("Conectado a MySQL");

    }

});


// REGISTRO
app.post("/registro", (req,res)=>{

    const {
        nombre,
        correo,
        usuario,
        password
    } = req.body;


    // VERIFICAR SI YA EXISTE
    const verificar = `
    SELECT * FROM usuarios
    WHERE correo = ? OR usuario = ?
    `;


    conexion.query(
        verificar,
        [correo, usuario],
        (error, resultado)=>{

            if(error){

                console.log(error);
                return res.send("Error al verificar");

            }


            // SI YA EXISTE
            if(resultado.length > 0){

                return res.send("El usuario o correo ya existe");

            }


            // INSERTAR USUARIO
            const sql = `
            INSERT INTO usuarios
            (nombre, correo, usuario, password)
            VALUES (?, ?, ?, ?)
            `;


            conexion.query(
                sql,
                [nombre, correo, usuario, password],
                (error, resultado)=>{

                    if(error){

                        console.log(error);
                        res.send("Error al registrar");

                    }else{

                        res.send("Usuario registrado");

                    }

                }
            );

        }
    );

});


// LOGIN
app.post("/login", (req,res)=>{

    const {
        usuario,
        password
    } = req.body;


    const sql = `
    SELECT * FROM usuarios
    WHERE usuario = ? AND password = ?
    `;


    conexion.query(
        sql,
        [usuario, password],
        (error, resultado)=>{

            if(error){

                console.log(error);
                return res.send("Error");

            }

            if(resultado.length > 0){

    res.json({
        login: true,
        id: resultado[0].id,
        nombre: resultado[0].nombre,
        correo: resultado[0].correo,
        usuario: resultado[0].usuario
    });

    }else{

    res.json({
        login: false,
        mensaje: "Usuario no encontrado o contraseña incorrecta"
    });

}

        }
    );

});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});
// SERVIDOR
app.listen(3000, ()=>{

    console.log("Servidor corriendo en puerto 3000");

});