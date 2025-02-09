const socket = io();

function addProduct(product) {
    console.log("Agregar producto:", product);
    socket.emit("add product", product)
}

function deleteProduct(id) {
    console.log("Eliminar producto con ID:", id);
    socket.emit("delete product", id)
}

const showNewProductNotification = (productName) => {
    Toastify({
        text: `Se agrego el producto "${productName}" a la lista!`,
        duration: 3000
        }).showToast();
}

const showNewUserNotification = (id) => {
    Toastify({
        text: `${id} ha ingresado al sistema!`,
        duration: 3000,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        }).showToast();
}

const main = () => {
    $productBox = document.getElementById("products-box")
    $productForm = document.getElementById("product-form")
    
    // Le avisamos al servidor que un nuevo usuario se conecto
    socket.emit('new user', socket.id);
    
    // Notificacion de nuevo usuario
    socket.on('new user notification', (id) => {
        showNewUserNotification(id)
    });
    
    // Obtengo la informacion del producto que se va a agregar
    $productForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const product = {
            name: document.getElementById("name").value,
            price: parseFloat(document.getElementById("price").value),
            discount: parseFloat(document.getElementById("discount").value) || 0,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            thumbnails: document.getElementById("thumbnails").value || "",
            stock: parseInt(document.getElementById("stock").value),
            code: document.getElementById("code").value,
            status: document.getElementById("status").checked
        };
        addProduct(product)
    });
    
    // Notificacion de producto nuevo
    socket.on("new product", (productName) => {
        showNewProductNotification(productName)
    })

    // Actualizo el historial de productos
    socket.on('products history', (products) => {
        $productBox.innerHTML = "";
        products.forEach(({ id, name, price, discount, category, description, thumbnails, stock, code, status }) => {
            const imageUrl = (thumbnails && thumbnails !== "-") ? thumbnails : "img/image-not-found.jpg";

            $productBox.innerHTML += `
                <div class="col-md-4 mb-4" style="margin: auto">
                    <div class="card shadow-sm">
                        <img src="${imageUrl}" class="card-img-top" alt="Imagen de ${name}" style="height: 400px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${name} (${id})</h5>
                            <p class="card-text"><strong>Categoría:</strong> ${category}</p>
                            <p class="card-text"><strong>Descripción:</strong> ${description}</p>
                            <p class="card-text"><strong>Precio:</strong> $${price.toFixed(2)}</p>
                            <p class="card-text"><strong>Descuento:</strong> ${discount}%</p>
                            <p class="card-text"><strong>Stock:</strong> ${stock} unidades</p>
                            <p class="card-text"><strong>Código:</strong> ${code}</p>
                            <p class="card-text"><strong>Estado:</strong> 
                                <span class="badge ${status ? 'bg-success' : 'bg-danger'}">
                                    ${status ? "Disponible" : "Agotado"}
                                </span>
                            </p>
                            <button class="btn btn-danger col-md-12" onclick="deleteProduct(${id})">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
        });
    });
    
    // Mando la notificacion de producto eliminado
    socket.on("deleted product", (id) => {
        Toastify({
            text: `Se ha eliminado el producto ${id} del sistema!`,
            duration: 3000,
            style: {
                background: "linear-gradient(to right, rgb(151, 31, 47), rgb(180, 60, 60), rgb(163, 23, 23))"
            },
        }).showToast();
    })
}
main()