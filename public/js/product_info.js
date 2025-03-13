const main = () => {
    const $selectProductBtn = document.getElementById("view-product");
    $selectProductBtn.addEventListener("click", () => {
        const $productId = document.getElementById("product-select").value;
        window.location.replace(`/product-info/${$productId}`);
    });
};
main();
