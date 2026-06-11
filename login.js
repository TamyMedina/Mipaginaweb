console.log("JS LOGIN CONECTADO");


async function InicioSesion(){

    console.log("BOTON LOGIN FUNCIONA");


    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");
    if(usuario === "" || password === ""){
    mensaje.innerHTML = "Complete todos los campos";
    return;

}


    try{

        const respuesta = await fetch("/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({

                usuario,
                password

            })

        });


        const resultado = await respuesta.json();

        console.log(resultado);


        if(resultado.login){
            localStorage.setItem(
            "usuarioActual",
            JSON.stringify(resultado)
         );

            window.location.href = "pagnexamen.html";

        }else{

            mensaje.innerHTML = resultado.mensaje;

        }

    }catch(error){

        console.log(error);

        mensaje.innerHTML = "Error al conectar";

    }

}