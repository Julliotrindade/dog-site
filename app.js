import { PRODUTOS } from "./produtos.js";
import { CONFIG } from "./config.js";

let carrinho = [];
let produtoAtual = null;
let qtdAtual = 1;

const menu = document.getElementById("menu");
const cartInfo = document.getElementById("cartInfo");

// RENDER
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

// MODAL
window.abrirModal = nome => {
  produtoAtual = PRODUTOS.find(p => p.nome === nome);
  qtdAtual = 1;

  modalNome.innerText = produtoAtual.nome;
  modalPreco.innerText = "R$ " + produtoAtual.preco;
  modalQtd.innerText = qtdAtual;

  overlay.style.display = "block";
  modalProduto.style.display = "flex";
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
  if(qtdAtual > 1) qtdAtual--;
  modalQtd.innerText = qtdAtual;
};

// ANIMAÇÃO
function efeitoVoar(imgEl) {
  const img = imgEl.cloneNode(true);

  const rect = imgEl.getBoundingClientRect();
  const cartRect = cart.getBoundingClientRect();

  img.classList.add("voando");

  img.style.top = rect.top + "px";
  img.style.left = rect.left + "px";

  document.body.appendChild(img);

  setTimeout(() => {
    img.style.top = cartRect.top + "px";
    img.style.left = cartRect.left + "px";
    img.style.width = "20px";
    img.style.opacity = "0.5";
  }, 10);

  setTimeout(() => img.remove(), 600);
}

// ADD
window.confirmarAdd = () => {

  const img = document.getElementById("img-" + produtoAtual.nome);

  carrinho.push({
    nome: produtoAtual.nome,
    preco: produtoAtual.preco,
    quantidade: qtdAtual,
    obs: modalObs.value
  });

  efeitoVoar(img);

  atualizarCarrinho();
  fecharModal();
};

// CARRINHO
function atualizarCarrinho() {
  let total = 0;

  carrinho.forEach(i => total += i.preco * i.quantidade);

  cartInfo.innerText = `${carrinho.length} itens | R$ ${total}`;

  cart.style.transform = "scale(1.1)";
  setTimeout(() => cart.style.transform = "scale(1)", 200);
}
