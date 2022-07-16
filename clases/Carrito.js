// IMPORTAMOS LA CLASE JUEGO DEL DIRECTORIO CLASES
import Juego from "./Juego.js";

class Carrito{

    // METODO CONSTRUCTOR DE LA CLASE CARRITO
    constructor(){
      this.juegos = new Array();
    }

    // METODO SET PARA GUARDAR LOS JUEGOS DEL CARRITO EN EL LOCAL STORAGE
    setJuegos(juegos){
      localStorage.setItem("juegos_carrito", JSON.stringify(juegos));
    }

    // METODO GET PARA RECUPERAR LOS JUEGOS DEL LOCAL STORAGE
    getJuegos(){
      const storage = JSON.parse(localStorage.getItem("juegos_carrito"));
      storage && (storage.forEach((juego) => {
        let juego_carrito = new Juego(juego);
        this.agregarJuego(juego_carrito, false);
      }));
    }
    
    // METODO PARA AGREGAR UN JUEGO AL CARRITO
    agregarJuego(juego, pv = true){
       this.juegos.push(juego);
       this.setJuegos(this.juegos);
       // BORRAMOS EL CARTEL DE DECISION UNA VEZ QUE SE AGREGA EL JUEGO
       let div_container_principal = document.getElementById("container_principal");
       let div_decision = document.getElementById("decision");
       div_decision && (div_container_principal.removeChild(div_decision));
       // ESTA CONDICION SE UTILIZA PARA EVITAR QUE LA NOTIFICACIÓN SALGA CUANDO SE LLENA EL CARRITO DESDE EL LOCAL STORAGE
       if(pv){
        // UTILIZAMOS LA LIBRERIA TOASTIFY PARA NOTIFICAR QUE EL JUEGO SE HA AGREGADO
        Toastify({
          text: "Juego agregado",
          duration: 2000,
          style: {
            background: "linear-gradient(to right, #53AEEB, #397fad)",
            fontFamily: "Lato, sans-serif"
            }
          }).showToast();
        }
    }

    // METODO PARA MOSTRAR EL CONTENIDO DEL CARRITO
    mostrarContenido(){
      // CREAMOS EL HTML DEL CARRITO
      this.crearHTMLCarrito();
      this.juegos.forEach((juego) => {
        // SELECCIONAMOS EL CONTENEDOR PRINCIPAL
        let tbody = document.getElementById("tbody");
        let tr = document.createElement("tr");
        // SETEMOS EL ID PARA CADA TR PARA LUEGO PODER BORRARLO SI SE NECESITA
        tr.setAttribute("id", `tr_${juego.getIdCarrito()}`);
        tr.innerHTML = `
          <td>${juego.getNombre()}</td>
          <td>${juego.getPrecio()}</td>
          <td>${juego.calcularImpuestoPais()}</td>
          <td><input class="boton_eliminar" id="boton_eliminar_${juego.getIdCarrito()}" type="button" value="Eliminar"></td>
        `;
        // RELACIONAMOS LOS ELEMENTOS CREADOS CON EL CONTENEDOR PRINCIPAL
        tbody.appendChild(tr);
        let input_eliminar = document.getElementById(`boton_eliminar_${juego.getIdCarrito()}`);
        input_eliminar.addEventListener("click", () => {
          this.borrarJuego(juego);
        });
      });   
    }

    // METODO PARA DESHABILITAR EL BOTON DE COMPRAR
    deshabilitarBoton(){
      if(this.juegos.length == 0){
        // SI EL CARRITO ESTÁ VACIO, SE DESHABILITA EL BOTON DE COMPRAR
        let boton_comprar = document.getElementById("boton_comprar");
        boton_comprar.setAttribute("disabled", "true");
        boton_comprar.style.backgroundColor = "#5c8a1c";
      }
    }
    
    // METODO PARA CREAR TODA LA ESTRUCTURA HTML DEL CARRITO
    crearHTMLCarrito(){
      // SELECCIONAMOS EL CONTENEDOR PRINCIPAL
      let div_container_principal = document.getElementById("container_principal");
      // CREAMOS TODOS LOS ELEMENTOS NECESARIOS PARA EL HTML MEDIANTE UNA PLANTILLA
      let div_carrito = document.createElement("div");
      div_carrito.setAttribute("id", "div_carrito");
      div_carrito.innerHTML = `
        <div id="header_carrito">
          <div>
            <h2>CARRITO DE COMPRAS</h2>
          </div>
          <img id="cerrar" src="img/close.svg" alt="Closed">
          <div class="clearfix"></div>
        </div>
        <div id="tabla">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Impuesto PAIS</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="tbody">
            </tbody>
          </table>
        </div>
        <div id="div_total">
          <p id="p_total">TOTAL: $${this.calcularTotal()}</p>
        </div>
        <div id="botones_carrito">
          <input id="boton_comprar" type="button" value="COMPRAR">
          <input id="boton_limpiar" type="button" value="LIMPIAR">
        </div>
      `;
      // RELACIONAMOS LOS ELEMENTOS CREADOS CON EL CONTENEDOR PRINCIPAL
      div_container_principal.appendChild(div_carrito);
      // AÑADIMOS LOS EVENTOS A LOS ELEMENTOS DEL HTML
      let img_cerrar = document.getElementById("cerrar");
      img_cerrar.addEventListener("click", () => {
        // AGREGAMOS EL EVENTO PARA PODER CERRAR LA VENTANA DEL CARRITO
        div_container_principal.removeChild(div_carrito);
      });
      let boton_comprar = document.getElementById("boton_comprar");
      boton_comprar.addEventListener("click", () => {
        // SE MUESTRA EL MENSAJE DE COMPRA EXITOSA
        this.mensajeCompra();
        // DESHABILITAMOS EL BOTON COMPRAR
        this.deshabilitarBoton();
        // SE VACIA EL CARRITO
        this.juegos.forEach((juego) => {
          this.borrarJuego(juego, false);
        });
        // UTILIZAMOS LA LIBRERIA TOASTIFY PARA NOTIFICAR QUE EL JUEGO SE HA COMPRADO
        Toastify({
          text: "Compra realizada",
          duration: 2000,
          style: {
            background: "linear-gradient(to right, #74AF22, #5c8a1c)",
            fontFamily: "Lato, sans-serif"
          }
        }).showToast();
      });
      let boton_limpiar = document.getElementById("boton_limpiar");
      boton_limpiar.addEventListener("click", () => {
        this.juegos.forEach((juego) => {
          // LLAMAMOS A LA FUNCION BORRARJUEGO POR CADA JUEGO EN EL CARRITO AL CLICKEAR EL BOTON LIMPIAR
          this.borrarJuego(juego, false);
        });
        // UTILIZAMOS LA LIBRERIA TOASTIFY PARA NOTIFICAR QUE EL CARRITO SE HA VACIADO
        Toastify({
          text: "Carrito vaciado",
          duration: 2000,
          style: {
            background: "linear-gradient(to right, #74AF22, #5c8a1c)",
            fontFamily: "Lato, sans-serif"
          }
        }).showToast();
      });
      // DESHABILITAMOS EL BOTON COMPRAR SI ES NECESARIO
      this.deshabilitarBoton();
    }

    // METODO PARA CALCULAR EL TOTAL DE LOS JUEGOS AGREGADOS EN EL CARRITO
    calcularTotal(){
      return this.juegos.reduce((total, juego) => total + juego.getPrecio() + juego.calcularImpuestoPais(), 0);
    }

    // METODO PARA BUSCAR EL JUEGO EN EL ARRAY JUEGOS
    // USAMOS UN PARÁMETRO OPCIONAL EN CASO DE QUE SE QUIERA UTILIZAR LA FUNCIÓN DE FORMA EXTERNA A LA CLASE
    buscarJuego(id, array_juegos = this.juegos){
      let juego_encontrado = array_juegos.find((juego) => juego.getId() == id);
      return juego_encontrado;
    }

    // METODO PARA BORRAR UN JUEGO DEL CARRITO
    borrarJuego(juego_borrar, pv = true){
      // FILTRAMOS EL JUEGO SELECCIONADO Y REASIGNAMOS EL ATRIBUTO DE LA CLASE
      this.juegos = this.juegos.filter((juego) => {
        return juego.getIdCarrito() != juego_borrar.getIdCarrito();
      });
      this.setJuegos(this.juegos);
      let tbody = document.getElementById("tbody");
      let tr = document.getElementById(`tr_${juego_borrar.getIdCarrito()}`);
      // BORRAMOS EL ELEMENTO TR DEL HTML
      tbody.removeChild(tr);
      // VOLVEMOS A DIBUJAR EL PRECIO TOTAL EN EL HTML
      let p_total = document.getElementById("p_total");
      p_total.textContent = `TOTAL: $${this.calcularTotal()}`;
      // DESHABILITAMOS EL BOTON COMPRAR SI ES NECESARIO
      this.deshabilitarBoton();
      // ESTA CONDICION SE UTILIZA PARA EVITAR QUE LA NOTIFICACIÓN SALGA CUANDO EL CARRITO SE VACIE
      if(pv){
        // UTILIZAMOS LA LIBRERIA TOASTIFY PARA NOTIFICAR QUE EL JUEGO SE HA BORRADO
        Toastify({
          text: "Juego eliminado",
          duration: 2000,
          style: {
            background: "linear-gradient(to right, #a11326, #881625)",
            fontFamily: "Lato, sans-serif"
          }
        }).showToast();
      }
    }

    // METODO PARA CREAR EL HTML DE COMPRA EXITOSA
    mensajeCompra(){
      //UTILIZAMOS LA LIBRERIA SWEETALERT PARA MOSTRAR EL MENSAJE FINAL
      Swal.fire({
        position: 'center',
        title: 'Muchas gracias por confiar en nosotros!!',
        showConfirmButton: false,
        timer: 1500
      })
    }
}

export default Carrito;
  
