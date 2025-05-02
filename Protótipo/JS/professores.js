function editarProfessor(nome, email, curso, id) {
  // Aqui você pode armazenar o id em sessionStorage para a tela de edição ter o professor certo
  sessionStorage.setItem("professorId", id);
  window.location.href = 'editarprofessor.html';
}
