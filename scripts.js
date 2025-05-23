const form = document.getElementById('pedidoForm');
const tabela = document.querySelector('#tabelaPedidos tbody');

function carregarPedidos() {
  tabela.innerHTML = ''; // Limpa a tabela
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

  pedidos.forEach((pedido, index) => {
    adicionarPedidoNaTabela(pedido, index);
  });
}

function salvarPedidos(pedidos) {
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

function adicionarPedidoNaTabela(pedido, index) {
  const novaLinha = document.createElement('tr');
  novaLinha.innerHTML = `
    <td>${pedido.nome}</td>
    <td>${pedido.descricao}</td>
    <td>${pedido.dataRegistro}</td>
    <td>${pedido.dataTermino}</td>
    <td>${pedido.contato1}</td>
    <td>${pedido.contato2}</td>
    <td><button class="excluir-btn" data-index="${index}">❌</button></td>
  `;
  tabela.appendChild(novaLinha);
}

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const pedido = {
    nome: document.getElementById('nome').value,
    descricao: document.getElementById('descricao').value,
    dataRegistro: document.getElementById('dataRegistro').value,
    dataTermino: document.getElementById('dataTermino').value,
    contato1: document.getElementById('contato1').value,
    contato2: document.getElementById('contato2').value
  };

  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  pedidos.push(pedido);
  salvarPedidos(pedidos);
  carregarPedidos(); // recarrega a tabela
  form.reset();
});

tabela.addEventListener('click', function(e) {
  if (e.target.classList.contains('excluir-btn')) {
    const index = parseInt(e.target.getAttribute('data-index'));
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.splice(index, 1); // remove o item
    salvarPedidos(pedidos);
    carregarPedidos(); // recarrega a tabela
  }
});

// Carrega os pedidos ao iniciar
carregarPedidos();
document.getElementById("exportarPdf").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  let y = 10;
  doc.setFontSize(14);
  doc.text("Relatório de Pedidos Registrados", 10, y);
  y += 10;

  pedidos.forEach((pedido, index) => {
    doc.setFontSize(11);
    doc.text(`Pedido ${index + 1}:`, 10, y); y += 6;
    doc.text(`Nome: ${pedido.nome}`, 10, y); y += 6;
    doc.text(`Descrição: ${pedido.descricao}`, 10, y); y += 6;
    doc.text(`Data de Registro: ${pedido.dataRegistro}`, 10, y); y += 6;
    doc.text(`Data de Término: ${pedido.dataTermino}`, 10, y); y += 6;
    doc.text(`Contato 1: ${pedido.contato1}`, 10, y); y += 6;
    doc.text(`Contato 2: ${pedido.contato2}`, 10, y); y += 10;

    // Verifica se precisa adicionar uma nova página
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });
  doc.save("pedidos.pdf");
});
