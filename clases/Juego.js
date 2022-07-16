// IMPORTAMOS LA FUNCION TOMAR DECISION DEL SCRIPT PRINCIPAL
import {tomaDecision} from '../js/script.js';

class Juego{

    // METODO CONSTRUCTOR DE LA CLASE JUEGO
    constructor(juego){
        this.id = juego.id;
        this.id_carrito = juego.id_carrito;
        this.nombre = juego.nombre;
        this.precio = juego.precio;
        this.imagen = juego.imagen;
    }

    // METODOS SETERS Y GETERS DE CADA ATRIBUTO DE LA CLASE JUEGO
    setId(id){
        this.id = id;
    }
    getId(){
        return this.id;
    }
    setIdCarrito(id_carrito){
        this.id_carrito = id_carrito;
    }
    getIdCarrito(){
        return this.id_carrito;
    }
    setNombre(nombre){
        this.nombre = nombre;
    }
    getNombre(){
        return this.nombre;
    }
    setPrecio(precio){
        this.precio = precio;
    }
    getPrecio(){
        return this.precio;
    }
    setImagen(imagen){
        this.imagen = imagen;
    }
    getImagen(){
        return this.imagen;
    }
    
    // METODO PARA CALCULAR EL IMPUESTO PAIS DEL PRECIO DE UN JUEGO
    calcularImpuestoPais(){
        return (this.precio * 65) / 100;
    }

    // METODO PARA CREAR EL HTML DE CADA JUEGO
    crearHTML(){
        // SELECCIONAMOS EL CONTENEDOR PRINCIPAL
        let catalogo = document.getElementById("catalogo");
        // CREAMOS TODOS LOS ELEMENTOS NECESARIOS PARA EL HTML DE NUESTRO JUEGO Y SETEAMOS SUS ATRIBUTOS
        let article = document.createElement("article");
        article.className ="juego";
        // CREAMOS TODOS LOS ELEMENTOS NECESARIOS PARA EL HTML MEDIANTE UNA PLANTILLA
        article.innerHTML = `
            <img class="caratula" src="${this.getImagen()}" alt="${this.getNombre()}">
            <h3>${this.getNombre()}</h3>
            <p>$${this.getPrecio()}</p>
            <input class="boton_aniadir" type="button" value="Añadir al carrito">
        `;
        // RELACIONAMOS LOS ELEMENTOS CREADOS CON EL ELEMENTO CATALOGO
        catalogo.appendChild(article);
        let inputs_button = document.getElementsByClassName("boton_aniadir");
        for(let button of inputs_button){
            // AÑADIMOS LOS EVENTOS A LAS COMPONENTES
            button.addEventListener("click", () => {
                console.log(this)
                tomaDecision(this.getId());
            });
        }
    }
    
}

export default Juego;