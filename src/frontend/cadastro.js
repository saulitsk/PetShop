document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastroForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();// campo extra (não será enviado)
    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.trim();// campo extra (não será enviado)
    const telefone = document.getElementById("telefone").value.trim();// campo extra (não será enviado)
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;
    const termosAceitos = document.getElementById("termos").checked;// campo extra (não será enviado)

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    if (!termosAceitos) {
      alert("Você deve aceitar os termos de uso!");
      return;
    }

    const usuarioData = {
      email: email,
      senha: senha
    };

    fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuarioData)
    })
      .then(response => response.json())
      .then(result => {
        if (result.id) {
          alert("Cadastro realizado com sucesso!");
          window.location.href = "login.html";
        } else {
          alert(result.message || "Erro ao realizar o cadastro. Tente novamente.");
        }
      })
      .catch(error => {
        console.error("Erro no cadastro:", error);
        alert("Ocorreu um erro ao realizar o cadastro.");
      });
  });
});
