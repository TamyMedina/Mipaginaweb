// =========================================================================
// 1. CONFIGURACIÓN DEL SIDEBAR (MENÚ LATERAL)
// =========================================================================
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

// =========================================================================
// 2. LÓGICA DEL CALENDARIO DINÁMICO
// =========================================================================
const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

let date = new Date();

function renderCalendar(){
  calendar.innerHTML = "";

  const month = date.getMonth();
  const year = date.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const months = [
    "Enero","Febrero","Marzo","Abril",
    "Mayo","Junio","Julio","Agosto",
    "Septiembre","Octubre","Noviembre","Diciembre"
  ];

  monthYear.innerText = `${months[month]} ${year}`;

  const daysName = [
    "Dom","Lun","Mar","Mie","Jue","Vie","Sab"
  ];

  daysName.forEach(day => {
    const div = document.createElement("div");
    div.classList.add("day-name");
    div.innerText = day;
    calendar.appendChild(div);
  });

  // Espacios vacíos con la clase day invisibles para no romper la grilla
  for(let i = 0; i < firstDay; i++){
    const empty = document.createElement("div");
    empty.classList.add("day");
    empty.style.visibility = "hidden";
    calendar.appendChild(empty);
  }

  for(let day = 1; day <= lastDate; day++){
    const div = document.createElement("div");
    div.classList.add("day");

    if(
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    ){
      div.classList.add("active");
    }

    div.innerHTML = `
        <span>${day}</span>
        <div class="nota"></div>
    `;

    div.addEventListener("click", () => {
        let texto = prompt("Escribe una nota para este día");
        if(texto){
            div.querySelector(".nota").textContent = texto;
        }
    });

    calendar.appendChild(div);
  }
}

function prevMonth(){
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
}

function nextMonth(){
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
}

renderCalendar();

// =========================================================================
// 3. ENRUTADOR DE SECCIONES (Navegación limpia entre pantallas)
// =========================================================================
const seccionInicio = document.getElementById("seccion-inicio");
const seccionCalendario = document.getElementById("calendario");
const todasLasSubsecciones = document.querySelectorAll(".subseccion-app");

// Función global que oculta ABSOLUTAMENTE todo para limpiar la pantalla
function ocultarTodo() {
    seccionInicio.style.display = "none";
    seccionCalendario.style.display = "none"; // Ocultamos el calendario por defecto en las subsecciones
    todasLasSubsecciones.forEach(sec => {
        sec.style.display = "none";
    });
}

// A. Evento para clics en las tarjetas del tablero principal (Dashboard)
const tarjetasMenu = document.querySelectorAll("#seccion-inicio .tarjeta");

tarjetasMenu.forEach(tarjeta => {
    tarjeta.addEventListener("click", () => {
        const objetivoId = tarjeta.getAttribute("data-target");
        const seccionObjetivo = document.getElementById(objetivoId);
        
        if (seccionObjetivo) {
            ocultarTodo();
            seccionObjetivo.style.display = "block"; // Muestra solo el apartado de esa tarjeta
        }
    });
});

// B. Evento para clics en los enlaces del Menú Lateral (Sidebar)
const enlacesSidebar = document.querySelectorAll(".menu a");

enlacesSidebar.forEach(enlace => {
    enlace.addEventListener("click", (e) => {
        e.preventDefault(); // Evita saltos bruscos o recargas de página
        
        const targetId = enlace.getAttribute("href").replace("#", "");
        
        // Si se presiona el botón "Calendario" (Actúa como Home: vuelve a Tarjetas + Calendario)
        if (targetId === "calendario") {
            ocultarTodo();
            seccionInicio.style.display = "block";     // Muestra las 5 tarjetas
            seccionCalendario.style.display = "block"; // Coloca el calendario abajo
        } 
        // Si presionas cualquier otro botón del sidebar (Mis clases, Tareas, etc.)
        else {
            const seccionObjetivo = document.getElementById(targetId);
            if (seccionObjetivo) {
                ocultarTodo();
                seccionObjetivo.style.display = "block"; // Abre la pantalla completa correspondiente
            }
        }
    });
});

// =========================================================================
// 4. FUNCIONES INTERACTIVAS DE MODIFICACIÓN (Formularios y Listas)
// =========================================================================

// --- SECCIÓN: HORARIO (El de la tarjeta del inicio) ---
function agregarClase(){
    let materia = document.getElementById("materia").value;
    let hora = document.getElementById("hora").value;
    let dia = document.getElementById("dia").value;

    if(materia === "" || hora === ""){
        alert("Completa todos los campos");
        return;
    }

    let lista = document.getElementById("listaHorario");
    let nuevaClase = document.createElement("div");
    nuevaClase.classList.add("clase");

    nuevaClase.innerHTML = `
        <div>
            <strong>${dia}</strong><br>
            ${materia} - ${hora}
        </div>
        <button class="btn-eliminar" onclick="eliminarClase(this)">
            Eliminar
        </button>
    `;

    lista.appendChild(nuevaClase);
    document.getElementById("materia").value = "";
    document.getElementById("hora").value = "";
}

function eliminarClase(boton){
    boton.parentElement.remove();
}

// --- SECCIÓN: GESTIONAR MIS CLASES ---
function agregarNuevaMateria() {
    let nombre = document.getElementById("nueva-materia-nombre").value;
    let prof = document.getElementById("materia-profesor").value;

    if(nombre === "") return alert("Escribe al menos el nombre de la materia");

    let lista = document.getElementById("lista-materias-detallada");
    let item = document.createElement("div");
    item.classList.add("clase"); 
    item.innerHTML = `
        <div>
            <strong>📚 ${nombre}</strong> — <span>${prof || 'Sin asignar'}</span>
        </div>
        <button class="btn-eliminar" onclick="this.parentElement.remove()">Eliminar</button>
    `;
    lista.appendChild(item);
    document.getElementById("nueva-materia-nombre").value = "";
    document.getElementById("materia-profesor").value = "";
}

// --- SECCIÓN: TAREAS PENDIENTES (To-Do List interactiva) ---
function crearTareaAbajo() {
    let textoTarea = document.getElementById("input-nueva-tarea").value;
    if(textoTarea === "") return alert("Escribe una tarea válida");

    let ul = document.getElementById("contenedor-lista-tareas");
    let li = document.createElement("li");
    li.style = "display: flex; justify-content: space-between; align-items: center; background: #fffcfd; padding: 12px; border-radius: 8px; border: 1px solid #e0d0d5; margin-bottom: 8px;";
    
    li.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" onchange="this.nextElementSibling.style.textDecoration = this.checked ? 'line-through' : 'none'" style="cursor: pointer;">
            <span style="color: #2d2020;">${textoTarea}</span>
        </div>
        <button class="btn-eliminar" onclick="this.parentElement.remove()">Eliminar</button>
    `;
    ul.appendChild(li);
    document.getElementById("input-nueva-tarea").value = "";
}

// =========================================================================
// 5. SISTEMA DE BUSCADOR Y FILTRADO EN TIEMPO REAL
// =========================================================================
const buscador = document.getElementById("inputBuscador");

buscador.addEventListener("input", () => {
    const textoBusqueda = buscador.value.toLowerCase().trim();

    // Caso A: Si la pantalla de inicio está visible, filtramos las tarjetas del menú
    if (seccionInicio.style.display !== "none") {
        const tarjetas = document.querySelectorAll("#seccion-inicio .tarjeta");
        
        tarjetas.forEach(tarjeta => {
            // Evaluamos el título de la tarjeta (h2 o h3)
            const tituloTarjeta = tarjeta.querySelector("h2, h3").innerText.toLowerCase();
            
            if (tituloTarjeta.includes(textoBusqueda)) {
                tarjeta.style.display = "block"; // Se muestra si coincide
            } else {
                tarjeta.style.display = "none";  // Se oculta si no coincide
            }
        });
    }
    
    // Caso B: Si estás dentro de la sección de TAREAS, filtramos la lista de tareas agregadas
    const seccionTareas = document.getElementById("seccion-tareas");
    if (seccionTareas && seccionTareas.style.display === "block") {
        const tareas = document.querySelectorAll("#contenedor-lista-tareas li");
        
        tareas.forEach(tarea => {
            const textoTarea = tarea.querySelector("span").innerText.toLowerCase();
            if (textoTarea.includes(textoBusqueda)) {
                tarea.style.display = "flex";
            } else {
                tarea.style.display = "none";
            }
        });
    }

    // Caso C: Si estás dentro de la sección de MIS CLASES, filtramos las materias detalladas
    const seccionClases = document.getElementById("seccion-clases");
    if (seccionClases && seccionClases.style.display === "block") {
        const materias = document.querySelectorAll("#lista-materias-detallada .clase");
        
        materias.forEach(materia => {
            const textoMateria = materia.innerText.toLowerCase();
            if (textoMateria.includes(textoBusqueda)) {
                materia.style.display = "flex";
            } else {
                materia.style.display = "none";
            }
        });
    }
});

// Limpiar el buscador automáticamente cada vez que cambiemos de sección
const todosLosEnlaces = document.querySelectorAll(".menu a, #seccion-inicio .tarjeta");
todosLosEnlaces.forEach(elemento => {
    elemento.addEventListener("click", () => {
        buscador.value = ""; // Resetea el texto
        // Restablece la visibilidad de todas las tarjetas por si acaso
        document.querySelectorAll("#seccion-inicio .tarjeta").forEach(t => t.style.display = "block");
    });
});
const contenedorMetas = document.getElementById("contenedorMetas");

function agregarMeta(){

    const input = document.getElementById("inputMeta");

    const texto = input.value.trim();

    if(texto === "") return;

    const card = document.createElement("div");
    card.classList.add("meta-card");

    card.innerHTML = `
    
        <div class="meta-top">

            <h3>${texto}</h3>

            <span class="porcentaje">0%</span>

        </div>

        <div class="progress-container">
            <div class="progress-bar"></div>
        </div>

        <div class="meta-tasks">

            <label>
                <input type="checkbox">
                Paso 1
            </label>

            <label>
                <input type="checkbox">
                Paso 2
            </label>

            <label>
                <input type="checkbox">
                Paso 3
            </label>

        </div>

    `;

    contenedorMetas.appendChild(card);

    const checks = card.querySelectorAll("input[type='checkbox']");
    const barra = card.querySelector(".progress-bar");
    const porcentaje = card.querySelector(".porcentaje");

    checks.forEach(check => {

        check.addEventListener("change", () => {

            const total = checks.length;

            const completadas =
                card.querySelectorAll("input:checked").length;

            const progreso =
                Math.round((completadas / total) * 100);

            barra.style.width = progreso + "%";

            porcentaje.textContent = progreso + "%";

            if(progreso === 100){
                card.classList.add("meta-completa");
            }else{
                card.classList.remove("meta-completa");
            }

        });

    });

    input.value = "";
}
const inputFoto = document.getElementById("inputFoto");

if(inputFoto){

    inputFoto.addEventListener("change", function(event){

        const archivo = event.target.files[0];

        if(archivo){

            const lector = new FileReader();

            lector.onload = function(e){

                document.getElementById("fotoPerfil").src = e.target.result;

            };

            lector.readAsDataURL(archivo);

        }

    });

}
const usuarioGuardado =
JSON.parse(localStorage.getItem("usuarioActual"));

if(usuarioGuardado){

    const nombrePerfil =
    document.querySelector(".nombre-perfil");

    if(nombrePerfil){

        nombrePerfil.textContent =
        usuarioGuardado.nombre;

    }

}
const correoPerfil =
document.getElementById("correoPerfil");

if(correoPerfil){

    correoPerfil.textContent =
    usuarioGuardado.correo;

}
const usuarioPerfil =
document.getElementById("usuarioPerfil");

if(usuarioPerfil){

    usuarioPerfil.textContent =
    usuarioGuardado.usuario;

}

