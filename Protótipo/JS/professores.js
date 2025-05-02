function editarProfessor(nome, email, curso) {
  const professor = { nome, email, curso };
  sessionStorage.setItem("professorEditar", JSON.stringify(professor));
  window.location.href = 'editarprofessor.html';
}
