document.addEventListener("DOMContentLoaded", () => {
    function formatDate(dateString) {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj)) {
        return dateString;
      }
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    }

    const agendarButton = document.getElementById("agendarButton");
    agendarButton.addEventListener("click", () => {
      window.location.href = "agendamento.html";
    });

    const sairButton = document.getElementById("sairButton");
    sairButton.addEventListener("click", () => {
      if (confirm("Tem certeza de que deseja sair?")) {
        localStorage.removeItem("token");
        window.location.href = "login.html";
      }
    });

    const listaAgendamentos = document.querySelector(".agendamentos-lista");

    const token = localStorage.getItem("token");

    listaAgendamentos.innerHTML = "<li>Carregando agendamentos...</li>";

    fetch("http://localhost:3000/api/agendamentos", {
      headers: {
        "Authorization": token ? `Bearer ${token}` : ""
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const agendamentos = data.dados || data;

        if (!agendamentos || agendamentos.length === 0) {
          listaAgendamentos.innerHTML = "<li>Nenhum agendamento encontrado.</li>";
          return;
        }

        listaAgendamentos.innerHTML = "";

        agendamentos.forEach((agendamento) => {
          const li = document.createElement("li");
          li.classList.add("agendamento-item");

          li.innerHTML = `
            <h3>Nome do Pet: ${agendamento.nome_pet}</h3>
            <p><strong>Tipo de Animal:</strong> ${agendamento.tipo_animal}</p>
            <p><strong>Raça:</strong> ${agendamento.raca}</p>
            <p><strong>Data:</strong> ${formatDate(agendamento.data)}</p>
            <p><strong>Horário:</strong> ${agendamento.horario}</p>
            <p><strong>Observações:</strong> ${agendamento.observacoes || "Nenhuma"}</p>
            <button class="alterarButton" data-id="${agendamento.id}">Alterar Agendamento</button>
            <button class="excluirButton" data-id="${agendamento.id}">Excluir Agendamento</button>
          `;

          li.querySelector(".alterarButton").addEventListener("click", () => {
            const agendamentoId = li
              .querySelector(".alterarButton")
              .getAttribute("data-id");
            window.location.href = `alterar-agendamento.html?id=${agendamentoId}`;
          });

          li.querySelector(".excluirButton").addEventListener("click", () => {
            if (confirm("Tem certeza de que deseja excluir esse agendamento?")) {
              fetch(`http://localhost:3000/api/agendamentos/${agendamento.id}`, {
                method: "DELETE",
                headers: {
                  "Authorization": token ? `Bearer ${token}` : ""
                }
              })
                .then((response) => response.json())
                .then((result) => {
                  if (result.message || result.id || result.affectedRows) {
                    alert("Agendamento excluído com sucesso!");
                    li.remove();
                    if (listaAgendamentos.childElementCount === 0) {
                      listaAgendamentos.innerHTML = "<li>Nenhum agendamento encontrado.</li>";
                    }
                  } else {
                    alert(result.message || "Erro ao excluir agendamento.");
                  }
                })
                .catch((error) => {
                  console.error("Erro ao excluir o agendamento:", error);
                  alert("Ocorreu um erro ao excluir o agendamento.");
                });
            }
          });
  
          listaAgendamentos.appendChild(li);
        });
      })
      .catch((error) => {
        console.error("Erro ao buscar os agendamentos:", error);
        listaAgendamentos.innerHTML =
          "<li>Erro ao carregar os agendamentos.</li>";
      });
  });
  