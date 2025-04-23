document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("btn-login");
    const cadastroBtn = document.getElementById("btn-cadastro");

    loginBtn.addEventListener("click", () => {
        window.location.href = "login.html";
    });

    cadastroBtn.addEventListener("click", () => {
        window.location.href = "cadastro.html";
    });
});
