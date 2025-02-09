const socket = io();

const main = () => {
    $productBox = document.getElementById("products-box")
    
    // Actualizo el historial de productos
    socket.on('products history', (products) => {
        $productBox.innerHTML = "";
        products.forEach(({ id, name, price, discount, category, description, thumbnails, stock, code, status }) => {
            $productBox.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${name} (${id})</h5>
                            <p class="card-text"><strong>Categoría:</strong> ${category}</p>
                            <p class="card-text"><strong>Descripción:</strong> ${description}</p>
                            <p class="card-text"><strong>Precio:</strong> $${price.toFixed(2)}</p>
                            <p class="card-text"><strong>Descuento:</strong> ${discount}%</p>
                            <p class="card-text"><strong>Stock:</strong> ${stock} unidades</p>
                            <p class="card-text"><strong>Código:</strong> ${code}</p>
                            <p class="card-text"><strong>Estado:</strong> <span class="badge ${status ? 'bg-success' : 'bg-danger'}">${status ? "Disponible" : "Agotado"}</span></p>
                        </div>
                    </div>
                </div>
            `;
        });
    });
}
main()