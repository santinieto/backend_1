const main = () => {
    const $selectCartBtn = document.getElementById("view-cart");
    $selectCartBtn.addEventListener("click", () => {
        const $cartId = document.getElementById("cart-select").value;
        window.location.replace(`/cart-info/${$cartId}`);
    });
};
main();
