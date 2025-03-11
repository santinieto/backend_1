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
                    first_name: firstName,
                    last_name: lastName,
                    username,
                    password,
                    email,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Guardo el usaurio en el localStorage
            // localStorage.setItem("userId", data.payload._id);

            // Usuario creado
            alert(`Usuario creado ${data.user.username} exitosamente.`);

            // Mando al usuario a la pagina de inicio
            window.location.href = "/login";
        } catch (error) {
            alert(`Error al registrar el usuario: ${error.message}`);
        }
    });
};
main();
