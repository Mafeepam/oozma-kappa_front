// Carrega a lista de professores do back-end
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
    // Monta o header e limpa o restante da tabela
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
      // Importante: a função editarProfessor recebe primeiro o id, depois os demais dados
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

// Redireciona para a página de edição com os dados do professor armazenados no sessionStorage
function editarProfessor(id, nome, email, curso) {
  const professor = { id, nome, email, curso };
  console.log("Professor para editar:", professor);
  sessionStorage.setItem("professorEditar", JSON.stringify(professor));
  window.location.href = "editarprofessor.html";
}

// Exclui o professor chamado, usando o id
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

// Executa o carregamento dos professores quando a página carrega, se o elemento da tabela existir
if (document.getElementById("tabelaProfessores")) {
  document.addEventListener("DOMContentLoaded", carregarProfessores);
}

// Evento para cadastrar um novo professor no back-end
if (document.getElementById("btnCadastrar")) {
  document.getElementById("btnCadastrar").addEventListener("click", async () => {
    // Aqui usamos os IDs "novoNome", "novoEmail" e "novoCurso" para os inputs de cadastro
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
      // Limpa os campos para nova inserção
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
