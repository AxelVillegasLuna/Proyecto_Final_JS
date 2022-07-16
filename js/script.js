// IMPORTAMOS LAS CLASES JUEGO Y CARRITO DEL DIRECTORIO CLASES
import Juego from '../clases/Juego.js';
import Carrito from '../clases/Carrito.js';

// FUNCION PARA AGREGAR JUEGOS AL ARRAY JUEGOS
function agregarJuegosBase(juego){
    juegos.push(new Juego(juego));
}

// FUNCION ASINCRONICA PARA CREAR LA MINI BASE DE DATOS DE JUEGOS
async function crearJuegos(){
    // UTILIZAMOS EL AWAIT PARA BLOQUEAR LAS EJECUCIONES SIGUIENTES A ESTA
    const response = await fetch('../db/data.json');
    const data = await response.json();
    data.forEach((juego) => {
        agregarJuegosBase(juego);
    });
    //INICIALIZAMOS LA VARIABLE DE LOS ID
    let gen_id = 1;
    juegos.forEach((juego) => {
        // SETEAMOS EL ATRIBUTO ID DE CADA UNO DE LOS JUEGOS EN EL ARRAY
        juego.setId(gen_id);
        gen_id++;
        // CREAMOS EL HTML DE CADA JUEGO
        juego.crearHTML();
    });
}
    
// FUNCION PARA VERIFICAR SI LA VENTANA DE DECISION ESTÁ CREADA
function HTMLCreado(){
    let div_decision = document.getElementById("decision");
    return div_decision ? true : false;
}

// FUNCION PARA TOMAR EL ID DE CARRITO MAYOR EN EL CASO DE QUE HAYA JUEGOS GUARDADOS EN EL LOCAL STORAGE DEL CARRITO
function idMayor(array){
    let id_mayor = -1;
    array.forEach((juego) => {
        juego.getIdCarrito() > id_mayor && (id_mayor = juego.getIdCarrito());
    });
    return id_mayor;
}

// FUNCION PARA CARGAR EL HTML AL MOMENTO DE CARGAR UN JUEGO AL CARRITO
export function tomaDecision(id){
    // VERIFICAMOS QUE LA VENTANA DE DECISION NO ESTÉ CREADA
    if(!HTMLCreado()){
        let juego = carrito.buscarJuego(id, juegos);
        let precio_real = juego.getPrecio() + juego.calcularImpuestoPais();
        // SELECCIONAMOS EL CONTENEDOR PRINCIPAL
        let div_container_principal = document.getElementById("container_principal");
        // CREAMOS TODOS LOS ELEMENTOS NECESARIOS PARA EL HTML MEDIANTE UNA PLANTILLA
        let div_decision = document.createElement("div");
        div_decision.setAttribute("id", "decision");
        div_decision.innerHTML = `
            <div id="decision_titulo">
                <p>¿Quieres agregar ${juego.getNombre()} al carrito?</p>
            </div>
            <div id="decision_botones">
                <img class="caratula" src="${juego.getImagen()}" alt="${juego.getNombre()}">
                <p>El precio final es de $${precio_real}</p>
                <input id="boton_confirmar" type="button" value="Confirmar">
                <input id="boton_cancelar" type="button" value="Cancelar">
            </div>
            `;
        // RELACIONAMOS LOS ELEMENTOS CREADOS CON EL CONTENEDOR PRINCIPAL
        div_container_principal.appendChild(div_decision);
        // AÑADIMOS LOS EVENTOS PARA LOS ELEMENTOS
        let input_confirmar = document.getElementById("boton_confirmar");
        input_confirmar.addEventListener("click", () => {
            // ANTES DE AGREGAR UN JUEGO AL CARRITO, SETEAMOS SU ID_CARRITO Y AUMENTAMOS EN 1 LA VARIABLE GLOBAL
            let juego_agregar = new Juego(juego);
            juego_agregar.setIdCarrito(id_carrito);
            id_carrito++;
            carrito.agregarJuego(juego_agregar);
        });
        let input_cancelar = document.getElementById("boton_cancelar");
        input_cancelar.addEventListener("click", () => {
            // BORRAMOS EL HTML DE DECISION AL CLICKEAR CANCELAR
            div_container_principal.removeChild(div_decision);
        });
    }else{
        // SI ESTÁ CREADO EL HTML DE DECISION, ENTONCES DESHABILITAMOS EL EVENTO DE LOS BOTONES AÑADIR
        let inputs_seleccionar = document.getElementsByClassName("boton_aniadir");
        for(let input of inputs_seleccionar){
            input.removeEventListener("click", () => {
                tomaDecision(this.getId());
            });
        }
    }
}

// FUNCION PARA CREAR EL CARRITO DE COMPRAS
function crearCarrito(){
    // CREAMOS UNA INSTANCIA DE LA CLASE CARRITO
    carrito = new Carrito();
    carrito.getJuegos();
    let id_mayor = idMayor(carrito.juegos);
    id_mayor != -1 && (id_carrito = id_mayor + 1);
    // AGREGAMOS EL EVENTO PARA CUANDO SE HAGA CLICK EN CARRITO
    document.getElementById("boton_carrito").addEventListener("click", () => {carrito.mostrarContenido()});
}

// DEFINICION DE VARIABLES GLOBALES
let juegos = [];
let carrito;
// INICIALIZAMOS LA VARIABLE DE LOS ID DE CARRITO
let id_carrito = 1;


// LLAMAMOS A LA FUNCION PARA CREAR LOS JUEGOS Y SU HTML
crearJuegos();
// CREAMOS EL OBJETO CARRITO
crearCarrito();





