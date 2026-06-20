import { PRODUTOS } from "./produtos.js";
import { CONFIG } from "./config.js";

let carrinho = [];
let produtoAtual = null;
let qtdAtual = 1;

const menu = document.getElementById("menu");
const cartInfo = document.getElementById("cartInfo");

const modalProduto = document.getElementById("modalProduto");
const overlay = document.getElementById("overlay");

const modalNome = document.getElementById("modalNome");
const modalDesc = document.getElementById("modalDesc");
const modalPreco = document.getElementById("modalPreco");
const modalQtd = document.getElementById("modalQtd");
const modalObs = document.getElementById("modalObs");
const modalImg = document.getElementById("modalImg");

const checkout = document.getElementById("checkout");
const listaCarrinho = document.getElementById("listaCarrinho");

// RENDER
PRODUTOS.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";

  div.innerHTML = `
    <img src="${p.imagem}">
    <h3>${p.nome}</h3>
    <div>R$ ${p.preco}</div>
    <div class="btn-add" onclick="abrirModal('${p.nome}')">+</div>
  `;

  menu.appendChild(div);
});

// MODAL
window.abrirModal = nome => {
  produtoAtual = PRODUTOS.find(p => p.nome === nome);
  qtdAtual = 1;

  modalNome.innerText = produtoAtual.nome;
  modalDesc.innerText = produtoAtual.descricao;
  modalPreco.innerText = "R$ " + produtoAtual.preco;
  modalQtd.innerText = qtdAtual;
  modalObs.value = "";
  modalImg.src = produtoAtual.imagem;

  overlay.style.display = "block";
  modalProduto.style.display = "block";
};

window.fecharModal = () => {
  overlay.style.display = "none";
  modalProduto.style.display = "none";
};

// QTD
window.aumentarQtd = () => {
  qtdAtual++;
  modalQtd.innerText = qtdAtual;
};

window.diminuirQtd = () => {
  if (qtdAtual > 1) qtdAtual--;
  modalQtd.innerText = qtdAtual;
};

// ADD
window.confirmarAdd = () => {
  carrinho.push({
    nome: produtoAtual.nome,
    preco: produtoAtual.preco,
    quantidade: qtdAtual,
    obs: modalObs.value
  });

  atualizarCarrinho();
  fecharModal();
};

// CARRINHO
function atualizarCarrinho() {
  let total = 0;
  carrinho.forEach(i => total += i.preco * i.quantidade);
  cartInfo.innerText = `${carrinho.length} itens | R$ ${total}`;
}

// CHECKOUT
window.abrirCheckout = () => {
  if (!carrinho.length) {
    alert("Carrinho vazio");
    return;
  }

  checkout.style.display = "block";

  let html = "";
  carrinho.forEach(i => {
    html += `${i.quantidade}x ${i.nome}<br>`;
  });

  listaCarrinho.innerHTML = html;
};

window.fecharCheckout = () => {
  checkout.style.display = "none";
};

// ENVIAR
window.enviar = () => {
  alert("Pedido enviado!");
};
``
