const main = () => {
    const $productBox = document.getElementById("products-box");
    const $addToCartButtons = document.querySelectorAll(
        "button[id^='add-to-cart-']"
    );
    const $cartSelect = document.getElementById("cart-select");

    $addToCartButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const productId = button.id.replace("add-to-cart-", "");
            const cartId = $cartSelect.value;

            if (!cartId) {
                alert(
                    "Por favor, seleccione un carrito antes de agregar productos."
                );
                return;
            }

            try {
                const response = await fetch(
                    `/api/carts/${cartId}/products/${productId}`,
                    {
                        method: "POST",
                    }
                );

                if (response.ok) {
                    alert("Producto agregado al carrito correctamente.");
                    window.location.replace(`/carts/${cartId}`);
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Error al agregar producto al carrito:", error);
                alert(
                    "Hubo un error al intentar agregar el producto al carrito."
                );
            }
        });
    });
};
main();
