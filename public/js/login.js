const main = () => {
    const $form = document.getElementById("login-form");
    $form.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Guardo el usaurio en el localStorage
            // localStorage.setItem("userId", data.payload._id);

            // Usuario logeado
            alert(`Bienvenido ${data.user.username}!.`);

            // Mando al usuario a la pagina de inicio
            window.location.href = "/products";
        } catch (error) {
            alert(`Error durante el logeo del usuario: ${error.message}`);
        }
    });
};
main();
