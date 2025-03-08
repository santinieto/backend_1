const main = () => {
    const $form = document.getElementById("login-form");
    $form.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const response = await fetch("/api/users/login", {
                method: "POST",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            console.log(data);

            // Guardo el usaurio en el localStorage
            // localStorage.setItem("userId", data.payload._id);

            // Usuario creado
            console.log("Usuario creado");

            // Mando al usuario a la pagina de inicio
            window.location.href = "/";
        } catch (error) {
            alert(`Error al registrar el usuario: ${error.message}`);
        }
    });
};
main();
