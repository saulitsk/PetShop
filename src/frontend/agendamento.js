document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-agendamento");
    const meusAgendamentosButton = document.getElementById("meusAgendamentosButton");
    const sairButton = document.getElementById("sairButton");

    meusAgendamentosButton.addEventListener("click", () => {
      window.location.href = "meus-agendamentos.html";
    });

    sairButton.addEventListener("click", () => {
      if (confirm("Tem certeza de que deseja sair?")) {
        window.location.href = "index.html";
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const petName = document.getElementById("petName").value;
      const animalType = document.getElementById("animalType").value;
      const breed = document.getElementById("breed").value;
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const notes = document.getElementById("notes").value;

      const formData = new FormData();
      formData.append("nome_pet", petName);
      formData.append("tipo_animal", animalType);
      formData.append("raca", breed);
      formData.append("data", date);
      formData.append("horario", time);
      formData.append("observacoes", notes);
  
      const petImageInput = document.getElementById("petImage");
      if (petImageInput.files && petImageInput.files[0]) {
        formData.append("imagem", petImageInput.files[0]);
      }

      const token = localStorage.getItem("token");

      fetch("http://localhost:3000/api/agendamentos", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.id) {
            alert("Agendamento realizado com sucesso!");
            form.reset();
          } else {
            alert(responseData.message || "Erro ao agendar. Verifique os dados e tente novamente.");
          }
        })
        .catch(error => {
          console.error("Erro no agendamento:", error);
          alert("Ocorreu um erro ao realizar o agendamento.");
        });
    });
  });
  