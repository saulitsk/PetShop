document.addEventListener("DOMContentLoaded", () => {
    const meusAgendamentosButton = document.getElementById("meusAgendamentosButton");
    meusAgendamentosButton.addEventListener("click", () => {
      window.location.href = "/frontend/meus-agendamentos.html";
    });

    const agendarButton = document.getElementById("agendarButton");
    agendarButton.addEventListener("click", () => {
      window.location.href = "/frontend/agendamento.html";
    });

    const sairButton = document.getElementById("sairButton");
    sairButton.addEventListener("click", () => {
      if (confirm("Tem certeza de que deseja sair?")) {
        localStorage.removeItem("token");
        window.location.href = "/frontend/login.html";
      }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const agendamentoId = urlParams.get("id");

    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/api/agendamentos/${agendamentoId}`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : ""
      }
    })
      .then(response => response.json())
      .then(data => {
        document.getElementById("petName").value = data.nome_pet;
        document.getElementById("animalType").value = data.tipo_animal;
        document.getElementById("breed").value = data.raca;
        document.getElementById("date").value = data.data;
        document.getElementById("time").value = data.horario;
        document.getElementById("notes").value = data.observacoes || "";
      })
      .catch(error => {
        console.error("Erro ao carregar os dados do agendamento:", error);
        alert("Erro ao carregar os dados do agendamento.");
      });

    const alterarForm = document.getElementById("alterarForm");
    alterarForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const petName = document.getElementById("petName").value;
      const animalType = document.getElementById("animalType").value;
      const breed = document.getElementById("breed").value;
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const notes = document.getElementById("notes").value;
  
      const updatedData = {
        nome_pet: petName,
        tipo_animal: animalType,
        raca: breed,
        data: date,
        horario: time,
        observacoes: notes
      };

      fetch(`http://localhost:3000/api/agendamentos/${agendamentoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(updatedData)
      })
        .then(response => response.json())
        .then(result => {
          if (result.id) {
            alert("Agendamento atualizado com sucesso!");
            window.location.href = "/frontend/meus-agendamentos.html";
          } else {
            alert(result.message || "Erro ao atualizar o agendamento. Verifique os dados e tente novamente.");
          }
        })
        .catch(error => {
          console.error("Erro ao atualizar o agendamento:", error);
          alert("Ocorreu um erro ao atualizar o agendamento.");
        });
    });
  });
  