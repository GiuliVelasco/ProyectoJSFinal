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
formulario.addEventListener('submit', (event) => {
    event.preventDefault()
    //envío de datos del form mediante api
    enviarForm.value = 'Enviando...';
    const serviceID = 'default_service';
    const templateID = 'contact_form';
    emailjs.sendForm(serviceID, templateID, '#idForm')
    .then(() => {
        enviarForm.value = 'Enviar';
        Swal.fire({
            icon: 'success',
            title: 'Gracias por contactarnos!',
            text: 'En breve te enviaremos más info de nuestras promos.',
        });
    }, (err) => {
        enviarForm.value = 'Enviar';
        alert(JSON.stringify(err));
    })
})
//seccion productos
function mostrarCardsProd(){
    fetch('productos.json')
    .then(response => response.json())
    .then(productos => {
        productos.forEach((productos) => {
            let {id, nombre, color, talle, precio, img} = productos
            divProductos.innerHTML += `
                <div class="card">
                    <img class="imgProd img-fluid" src="${img}">
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
                <br><span class="precio">Precio unitario $ ${element.precio}</span> <br> Cantidad: ${element.cantComprada}</p>
                <p>Subtotal: $ ${element.precio * element.cantComprada}</p>
                <button type="button" class="botonBorrar btn btn-outline-danger" id="${element.id}">X</button>
            </div>
        </div>
        `
    });
    const total = arrayCarrito.reduce((acc, elemento)=> acc + elemento.precio*elemento.cantComprada, 0);
    idCarrito.innerHTML += `
        <br><p>Total: $ ${total}</p>
        <p>Total + IVA: $ ${total * 1.21}</p>
        <br><button type="button" class="botonFinalizar btn btn-success">Comprar</button>
    `
    borrarProducto();
    finalizarCompra();
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
            arrayCarrito = arrayCarrito.filter((element) => {
                return element.id !== id; //le pido que retorne el carrito con lo elementos cuyo id sea diferente al seleccionado para eliminar
            });
            localStorage.setItem('carrito', JSON.stringify(arrayCarrito));
            pintarCarrito();
        });
    });
}

function finalizarCompra() {
    let botonFinalizar = document.querySelector('.botonFinalizar');
    botonFinalizar.addEventListener("click",(e) => {
        e.preventDefault();
        arrayCarrito.splice(0,arrayCarrito.length);
        localStorage.setItem('carrito', JSON.stringify(arrayCarrito));
        pintarCarrito();
    });
}
mostrarCardsProd();
modoPantalla();