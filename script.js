const form = document.getElementById('formAluno');
const tabela = document.getElementById('tabelaAlunos').querySelector('tbody');
let alunos = JSON.parse(localStorage.getItem('alunos')) || [];

function salvarAlunos() {
  localStorage.setItem('alunos', JSON.stringify(alunos));
  listarAlunos();
}

function listarAlunos(filtro = '') {function listarAlunos(filtro = '') {
  tabela.innerHTML = '';

  const filtrados = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtrados.length / alunosPorPagina);
  if (paginaAtual > totalPaginas) paginaAtual = totalPaginas || 1;

  const inicio = (paginaAtual - 1) * alunosPorPagina;
  const fim = inicio + alunosPorPagina;
  const pagina = filtrados.slice(inicio, fim);

  pagina.forEach((aluno, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${aluno.nome}</td>
      <td>${aluno.email}</td>
      <td class="actions">
        <button onclick="editarAluno(${alunos.indexOf(aluno)})">Editar</button>
        <button onclick="excluirAluno(${alunos.indexOf(aluno)})">Excluir</button>
      </td>
    `;
    tabela.appendChild(row);
  });

  gerarPaginacao(filtrados.length);
}

  tabela.innerHTML = '';
  alunos
    .filter(aluno => aluno.nome.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((aluno, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${aluno.nome}</td>
        <td>${aluno.email}</td>
        <td class="actions">
          <button onclick="editarAluno(${index})">Editar</button>
          <button onclick="excluirAluno(${index})">Excluir</button>
        </td>
      `;
      tabela.appendChild(row);
    });
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const id = document.getElementById('idAluno').value;

  if (id) {
    alunos[id] = { nome, email };
  } else {
    alunos.push({ nome, email });
  }

  form.reset();
  document.getElementById('idAluno').value = '';
  salvarAlunos();
});

function editarAluno(index) {
  const aluno = alunos[index];
  document.getElementById('nome').value = aluno.nome;
  document.getElementById('email').value = aluno.email;
  document.getElementById('idAluno').value = index;
}

function excluirAluno(index) {
  if (confirm('Tem certeza que deseja excluir este aluno?')) {
    alunos.splice(index, 1);
    salvarAlunos();
  }
}

listarAlunos();document.getElementById('pesquisa').addEventListener('input', (e) => {
  listarAlunos(e.target.value);
});

function exportarCSV() {
  if (alunos.length === 0) {
    alert("Nenhum aluno para exportar.");
    return;
  }

  let csv = 'Nome,Email\n';
  alunos.forEach(aluno => {
    csv += `${aluno.nome},${aluno.email}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'alunos.csv';
  link.click();
}
function gerarPaginacao(totalItens) {
  const paginacao = document.getElementById('paginacao');
  paginacao.innerHTML = '';

  const totalPaginas = Math.ceil(totalItens / alunosPorPagina);

  const btnAnterior = document.createElement('button');
  btnAnterior.textContent = 'Anterior';
  btnAnterior.disabled = paginaAtual === 1;
  btnAnterior.onclick = () => {
    paginaAtual--;
    listarAlunos(document.getElementById('pesquisa').value);
  };

  const btnProximo = document.createElement('button');
  btnProximo.textContent = 'Próximo';
  btnProximo.disabled = paginaAtual === totalPaginas || totalPaginas === 0;
  btnProximo.onclick = () => {
    paginaAtual++;
    listarAlunos(document.getElementById('pesquisa').value);
  };

  paginacao.appendChild(btnAnterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.disabled = i === paginaAtual;
    btn.onclick = () => {
      paginaAtual = i;
      listarAlunos(document.getElementById('pesquisa').value);
    };
    paginacao.appendChild(btn);
  }

  paginacao.appendChild(btnProximo);
}

