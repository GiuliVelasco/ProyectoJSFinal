class Usuario {
    constructor(nombreCompleto, email, edad){
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.edad = edad;
    }
}

let usuarios = [];
if(localStorage.getItem('Usuarios')){
    usuarios = JSON.parse(localStorage.getItem('Usuarios'));
} else{
    localStorage.setItem('Usuarios', JSON.stringify(usuarios));
}

let formulario = document.getElementById('idForm');
let divProductos = document.querySelector('#divProductos');
let botonDarkMode = document.getElementById('botonDarkMode');
let botonLightMode = document.getElementById('botonLightMode');
let fondoMain = document.getElementById('fondoMain');
let modo;
let enviarForm = document.getElementById('enviarForm');
let arrayCarrito = JSON.parse(localStorage.getItem('carrito')) ?? []
let botonVerCarrito = document.getElementById('botonVerCarrito');
//modo de visualizacion de la pagina
function modoPantalla(){
    if(localStorage.getItem('modo')){
        modo = localStorage.getItem('modo');
    }else{
        localStorage.setItem('modo', 'light')
    }

    if(modo == 'dark'){
        fondoMain.classList.add('modoOscuro');
    }
    botonDarkMode.addEventListener("click", ()=>{
        fondoMain.classList.add('modoOscuro');
        localStorage.setItem('modo', 'dark');
    })
    botonLightMode.addEventListener("click", ()=>{
        fondoMain.classList.remove('modoOscuro');
        localStorage.setItem('modo', 'light');
    })
}
//formulario
formulario.addEventListener('submit',(event) =>{
    event.preventDefault()
    let nombreCompleto = document.getElementById('usernameId').value
    let email = document.getElementById('emailId').value
    let edad = document.getElementById('edadId').value
    let objetoUsuario = {nombreCompleto: nombreCompleto, email: email, edad: edad}
    usuarios.push(objetoUsuario)
    localStorage.setItem('Usuarios', JSON.stringify(usuarios))
    console.log(usuarios)
})

enviarForm.addEventListener("click",() => {
    Swal.fire({
        icon: 'success',
        title: 'Gracias por contactarnos!',
        text: 'En breve te enviaremos más info de nuestras promos.',
      });
})
//seccion productos
function mostrarCardsProd(){
    fetch('productos.json')
    .then(response => response.json())
    .then(productos => {
        productos.forEach((productos) => {
            let {id, nombre, color, talle, precio} = productos
            divProductos.innerHTML += `
                <div class="card">
                    <div class="card-body">
                        <p class="card-title">${nombre.toUpperCase()}</p>
                        <p class="card-text">Color: ${color}.<br>Talle: ${talle}
                        <br><span class="precio">$ ${precio}</span></p>
                        <a id="boton${id}" class="btn d-flex justify-content-between">Agregar al carrito
                            <img class="fondoCarrito" width="30px" height="30px" src="img/iconCarrito.png" alt="agregar al carrito">
                        </a>
                    </div>
                </div>
            `
        })
    })
    agregarProducto();
}

function agregarProducto() {
    fetch('productos.json')
    .then(response => response.json())
    .then(productos => {
        productos.forEach((articulo, index) => {
            let {id, nombre, color, talle, precio} = productos
            document.querySelector(`#boton${index +1}`).addEventListener(`click`, () => {
                enviarAlCarrito(articulo);
                Toastify({
                    text: "Producto agregado al carrito",
                    duration: 2000,
                    close: true,
                    gravity: "top",
                    position: "center",
                    stopOnFocus: true, 
                    style: {
                      background: "linear-gradient(to right, rgba(129,0,0,1), rgba(206,18,18,1))",
                    },
                  }).showToast();
            });
        });
    });
}

function enviarAlCarrito(articulo) {
    if(arrayCarrito.some(producto => producto.id == articulo.id)){
        let indice = arrayCarrito.findIndex(producto => producto.id === articulo.id);
        arrayCarrito[indice].cantComprada++;
        console.log(arrayCarrito);
    }else{
        let productoArray = {
            ...articulo,
            cantComprada: 1
        }
        arrayCarrito.push(productoArray);
    }
    localStorage.setItem('carrito', JSON.stringify(arrayCarrito));
    pintarCarrito();
}

function pintarCarrito() {
    idCarrito.innerHTML = ""
    idCarrito.innerHTML += `<p>Productos seleccionados</p>`
    arrayCarrito.forEach(element => {
        idCarrito.innerHTML += `
        <div class="card">
            <div class="card-body">
                <p class="card-title">${element.nombre.toUpperCase()}</p>
                <p class="card-text">Color: ${element.color}.<br>Talle: ${element.talle}
                <br><span class="precio">Precio unitario $ ${element.precio}</span> - Cantidad: ${element.cantComprada}</p>
                <p>Subtotal: $ ${element.precio * element.cantComprada}</p>
                <button class="botonBorrar" id="${element.id}}">Eliminar</button>
            </div>
        </div>
        `
    });
    borrarProducto();
}

botonVerCarrito.addEventListener('click', (event)=>{
    event.preventDefault()
    pintarCarrito();
})

function borrarProducto() {
    let botonBorrarProd = document.querySelectorAll(".botonBorrar");
    botonBorrarProd.forEach((element) => {
        element.addEventListener("click", (e) => {
            let id = parseInt(e.target.id);
            console.log(id);
            arrayCarrito = arrayCarrito.filter((element) => {
                return element.id !== id; //le pido que retorne el carrito con lo elementos cuyo id sea diferente al seleccionado para eliminar
            });
            localStorage.setItem('carrito', JSON.stringify(arrayCarrito));
            pintarCarrito();
        });
    });
}

mostrarCardsProd();
modoPantalla();