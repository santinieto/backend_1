const main = () => {
    const $form = document.getElementById("register-form");
    $form.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const firstName = document.getElementById("first-name").value;
            const lastName = document.getElementById("last-name").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const email = document.getElementById("email").value;
            const response = await fetch("/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username,
                    password,
                    email,
                }),
            });
            const data = await response.json();
            console.log(data);

            // Guardo el usaurio en el localStorage
            // localStorage.setItem("userId", data.payload._id);

            // Usuario creado
            console.log("Usuario creado");

            // Mando al usuario a la pagina de inicio
            // window.location.href = "/";
        } catch (error) {
            alert(`Error al registrar el usuario: ${error.message}`);
        }
    });
};
main();
