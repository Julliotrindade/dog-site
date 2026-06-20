import { PRODUTOS } from "./produtos.js";
import { CONFIG } from "./config.js";

let carrinho = [];
let produtoAtual = null;
let qtdAtual = 1;

const menu = document.getElementById("menu");
const cartInfo = document.getElementById("cartInfo");

// =======================
// RENDER PRODUTOS
// =======================
PRODUTOS.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";

  div.innerHTML = `
    <img src="${p.imagem}" id="img-${p.nome}">
    <h3>${p.nome}</h3>
    <div class="price">R$ ${p.preco}</div>

    <div class="btn-add" onclick="abrirModal('${p.nome}')">+</div>
  `;

  menu.appendChild(div);
});

// =======================
// MODAL
// =======================
window.abrirModal = nome => {
  produtoAtual = PRODUTOS.find(p => p.nome === nome);
  qtdAtual = 1;

  document.getElementById("modalNome").innerText = produtoAtual.nome;
  document.getElementById("modalPreco").innerText = "R$ " + produtoAtual.preco;
  document.getElementById("modalQtd").innerText = qtdAtual;

  document.getElementById("modalObs").value = "";

  overlay.style.display = "block";
  modalProduto.style.display = "flex";
};

window.fecharModal = () => {
  overlay.style.display = "none";
  modalProduto.style.display = "none";
};

// =======================
// QUANTIDADE
// =======================
window.aumentarQtd = () => {
  qtdAtual++;
  modalQtd.innerText = qtdAtual;
};

window.diminuirQtd = () => {
  if (qtdAtual > 1) qtdAtual--;
  modalQtd.innerText = qtdAtual;
};

// =======================
// ANIMAÇÃO CARRINHO
// =======================
function animarCart() {
  cart.style.transform = "scale(1.1)";
  setTimeout(() => {
    cart.style.transform = "scale(1)";
  }, 200);
}

// =======================
// ADICIONAR
// =======================
window.confirmarAdd = () => {

  carrinho.push({
    nome: produtoAtual.nome,
    preco: produtoAtual.preco,
    quantidade: qtdAtual,
    obs: modalObs.value
  });

  atualizarCarrinho();
  animarCart();
  fecharModal();
};

// =======================
// ATUALIZAR CARRINHO
// =======================
function atualizarCarrinho() {
  let total = 0;

  carrinho.forEach(i => total += i.preco * i.quantidade);

  cartInfo.innerText = `${carrinho.length} itens | R$ ${total}`;
}

// =======================
// CHECKOUT
// =======================
window.abrirCheckout = () => {
  if (carrinho.length === 0) {
    alert("Adicione algo primeiro!");
    return;
  }

  checkout.style.display = "block";
  renderCarrinho();
};

window.fecharCheckout = () => {
  checkout.style.display = "none";
};

// =======================
// LISTAR CARRINHO
// =======================
function renderCarrinho() {
  let html = "";

  carrinho.forEach((item, i) => {
    html += `
      <div>
        ${item.quantidade}x ${item.nome}
        <br>${item.obs || ""}
        <br>
        <button onclick="remover(${i})">Remover</button>
        <hr>
