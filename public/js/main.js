const isOnline = async () => {
    try {
        const response = await fetch("/api/users/session");
        return response.ok;
    } catch (error) {
        return false;
    }
};

const navbarMain = async () => {
    const $navbar = document.getElementById("navbar-nav");

    setInterval(async () => {
        const online = await isOnline();

        if (!online) {
            $navbar.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="/login">Login</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/register">Register</a>
                </li>
            `;
        } else {
            $navbar.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="/products">Products</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/realtimeproducts">Real Time Products</a>
                </li>
                <li class="nav-item">
                    <a id = "logout-btn" class="nav-link" href="/logout">SignOut</a>
                </li>
            `;

            const $logoutBtn = document.getElementById("logout-btn");
            if ($logoutBtn) {
                $logoutBtn.addEventListener("click", async () => {
                    try {
                        const response = await fetch("/api/users/logout");
                        const data = await response.json();

                        if (!response.ok) {
                            throw new Error(data.message);
                        }

                        alert(data.message);
                        window.location.href = "/login";
                    } catch (error) {
                        alert(`Error al cerrar la sesion: ${error.message}`);
                    }
                });
            }
        }
    }, 1000);
};
navbarMain();
