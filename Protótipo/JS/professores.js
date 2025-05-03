async function carregarProfessores() {
  try {
    console.log("Iniciando a busca por professores...");
    const response = await fetch("http://localhost:8080/api/professores");
    if (!response.ok) {
      throw new Error("Erro ao carregar professores, status: " + response.status);
    }
    const professores = await response.json();
    console.log("Professores retornados:", professores);
    
    const tabela = document.getElementById("tabelaProfessores");
    if (!tabela) {
      console.error("Elemento da tabela não encontrado!");
      return;
    }
    // Monta o header da tabela e limpa o conteúdo antigo
    tabela.innerHTML = `
      <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Curso</th>
        <th>Ações</th>
      </tr>
    `;
    
    professores.forEach(professor => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${professor.nome}</td>
        <td>${professor.email}</td>
        <td>${professor.curso}</td>
        <td>
          <button class="edit" onclick="editarProfessor(${professor.id}, '${professor.nome}', '${professor.email}', '${professor.curso}')">Editar</button>
          <button class="delete" onclick="excluirProfessor(${professor.id})">Excluir</button>
        </td>
      `;
      tabela.appendChild(linha);
    });
  } catch (error) {
    console.error("Erro ao carregar professores:", error);
  }
}

function editarProfessor(id, nome, email, curso) {
  const professor = { id, nome, email, curso };
  console.log("Professor para editar:", professor);
  sessionStorage.setItem("professorEditar", JSON.stringify(professor));
  window.location.href = "editarprofessor.html";
}

function excluirProfessor(id) {
  const confirmacao = confirm("Tem certeza que deseja excluir este professor?");
  if (!confirmacao) return;

  fetch(`http://localhost:8080/api/professores/${id}`, { method: "DELETE" })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao excluir professor, status: " + response.status);
      }
      alert("Professor excluído com sucesso!");
      carregarProfessores();
    })
    .catch(error => {
      console.error("Erro ao excluir professor:", error);
      alert("Erro ao excluir o professor.");
    });
}

document.addEventListener("DOMContentLoaded", carregarProfessores);

if (document.getElementById("btnCadastrar")) {
  document.getElementById("btnCadastrar").addEventListener("click", async () => {
    const nome = document.getElementById("novoNome").value.trim();
    const email = document.getElementById("novoEmail").value.trim();
    const curso = document.getElementById("novoCurso").value.trim();
    
    if (!nome || !email || !curso) {
      alert("Preencha todos os campos!");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:8080/api/professores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, curso })
      });
      
      if (!response.ok) {
        throw new Error("Erro ao cadastrar professor, status: " + response.status);
      }
      alert("Professor cadastrado com sucesso!");
      document.getElementById("novoNome").value = "";
      document.getElementById("novoEmail").value = "";
      document.getElementById("novoCurso").value = "";
      carregarProfessores();
    } catch (error) {
      console.error("Erro ao cadastrar professor:", error);
      alert("Erro ao cadastrar professor.");
    }
  });
}
