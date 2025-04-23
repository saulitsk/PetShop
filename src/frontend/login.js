document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const senha = document.getElementById("password").value;

      fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
      })
        .then(response => response.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            alert("Login realizado com sucesso!");
            window.location.href = "agendamento.html";
          } else {
            alert(data.message || "Erro no login. Verifique suas credenciais.");
          }
        })
        .catch(error => {
          console.error("Erro:", error);
          alert("Ocorreu um erro ao efetuar o login.");
        });
    });
  });
  