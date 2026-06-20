import { PRODUTOS } from "./produtos.js";
import { CONFIG } from "./config.js";

let carrinho = [];

// CONTROLE DO MODAL
let produtoAtual = null;
let qtdAtual = 1;

// ELEMENTOS
const menu = document.getElementById("menu");
const cartInfo = document.getElementById("cartInfo");

// =======================
// MOSTRAR PRODUTOS
// =======================
PRODUTOS.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";

  div.innerHTML = `
    <h3>${p.nome}</h3>
    <p>${p.descricao}</p>
    <strong>R$ ${p.preco}</strong>

    <button onclick="abrirModal('${p.nome}')">
      Ver item
    </button>
  `;

  menu.appendChild(div);
});

// =======================
// ABRIR MODAL
// =======================
window.abrirModal = function(nome) {
  produtoAtual = PRODUTOS.find(p => p.nome === nome);
  qtdAtual = 1;

  document.getElementById("modalNome").innerText = produtoAtual.nome;
  document.getElementById("modalDesc").innerText = produtoAtual.descricao;
  document.getElementById("modalPreco").innerText = "R$ " + produtoAtual.preco;
  document.getElementById("modalQtd").innerText = qtdAtual;
  document.getElementById("modalObs").value = "";

  document.getElementById("modalProduto").style.display = "block";
};

// =======================
// FECHAR MODAL
// =======================
window.fecharModal = function() {
  document.getElementById("modalProduto").style.display = "none";
};

// =======================
// QUANTIDADE
// =======================
window.aumentarQtd = function() {
  qtdAtual++;
  document.getElementById("modalQtd").innerText = qtdAtual;
};

window.diminuirQtd = function() {
  if (qtdAtual > 1) qtdAtual--;
  document.getElementById("modalQtd").innerText = qtdAtual;
};

// =======================
// CONFIRMAR ADD
// =======================
window.confirmarAdd = function() {
  const obs = document.getElementById("modalObs").value;

  carrinho.push({
    nome: produtoAtual.nome,
    preco: produtoAtual.preco,
    quantidade: qtdAtual,
    obs
  });

  fecharModal();
  atualizarCarrinho();
};

// =======================
// ATUALIZAR CARRINHO
// =======================
function atualizarCarrinho() {
  let total = 0;

  carrinho.forEach(i => {
    total += i.preco * i.quantidade;
  });

  cartInfo.innerText = `${carrinho.length} itens | R$ ${total}`;
}

// =======================
// CHECKOUT
// =======================
window.abrirCheckout = function() {
  document.getElementById("checkout").style.display = "block";
  renderCarrinho();
};

window.fecharCheckout = function() {
  document.getElementById("checkout").style.display = "none";
};

// =======================
// RENDER CARRINHO
// =======================
function renderCarrinho() {
  const container = document.getElementById("listaCarrinho");

  let html = "";

  carrinho.forEach((item, i) => {
    html += `
      <div>
        ${item.quantidade}x ${item.nome}
        <br>
        ${item.obs}
        <br>
        <button onclick="remover(${i})">Remover</button>
      </div><br>
    `;
  });

  container.innerHTML = html;
}

// =======================
// REMOVER
// =======================
window.remover = function(i) {
  carrinho.splice(i, 1);
  renderCarrinho();
  atualizarCarrinho();
};

// =======================
// ENVIAR WHATSAPP
// =======================
window.enviar = function() {
  let msg = `Pedido:\n\n`;

  carrinho.forEach(item => {
    msg += `${item.quantidade}x ${item.nome}`;
    if(item.obs) msg += ` (${item.obs})`;
    msg += "\n";
  });

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`);
};
