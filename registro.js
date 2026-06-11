async function registrarUsuario(){

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmar").value;

    const mensaje = document.getElementById("mensaje");


    if(password !== confirmar){

        mensaje.innerHTML = "Rellenar todos los campos y asegurarse de que las contraseñas coincidan";
        return;

    }


    const datos = {

        nombre,
        correo,
        usuario,
        password

    };


    console.log(datos);


    try{

        const respuesta = await fetch("/registro", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(datos)

        });


        const resultado = await respuesta.text();

        console.log(resultado);

        mensaje.innerHTML = resultado;

        if(resultado === "Usuario registrado"){

        window.location.href = "login.html";

}

    }catch(error){

        console.log(error);

        mensaje.innerHTML = "Error al conectar";

    }

}