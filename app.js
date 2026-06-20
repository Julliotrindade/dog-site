import { PRODUTOS } from "./produtos.js";

let carrinho = [];
let produtoAtual = null;
let qtdAtual = 1;

// ELEMENTOS
const menu = document.getElementById("menu");
const cartInfo = document.getElementById("cartInfo");

// MODAL
const modalProduto = document.getElementById("modalProduto");
const modalImg = document.getElementById("modalImg");
const modalNome = document.getElementById("modalNome");
const modalDesc = document.getElementById("modalDesc");
const modalPreco = document.getElementById("modalPreco");
const modalQtd = document.getElementById("modalQtd");
const modalObs = document.getElementById("modalObs");

// CARRINHO
const carrinhoModal = document.getElementById("carrinhoModal");
const listaCarrinho = document.getElementById("listaCarrinho");

// =======================
// RENDER PRODUTOS
// =======================
PRODUTOS.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";

  div.innerHTML = `
    <img src="${p.imagem}">
    <h3>${p.nome}</h3>
    <p>R$ ${p.preco}</p>
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

  modalImg.src = produtoAtual.imagem;
  modalNome.innerText = produtoAtual.nome;
  modalDesc.innerText = produtoAtual.descricao;
  modalPreco.innerText = "R$ " + produtoAtual.preco;
  modalQtd.innerText = qtdAtual;
  modalObs.value = "";

  modalProduto.style.display = "block";
};

window.fecharModal = () => {
  modalProduto.style.display = "none";
};

// =======================
// QTD
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
// ADD
// =======================
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

// =======================
// ATUALIZAR
// =======================
function atualizarCarrinho() {
  let total = 0;

  carrinho.forEach(i => total += i.preco * i.quantidade);

  cartInfo.innerText = `${carrinho.length} itens | R$ ${total}`;
}

// =======================
// CARRINHO
// =======================
window.abrirCarrinho = () => {
  carrinhoModal.style.display = "block";
  renderCarrinho();
};

window.fecharCarrinho = () => {
  carrinhoModal.style.display = "none";
};

// =======================
// LISTAR
// =======================
function renderCarrinho() {
  let html = "";

  carrinho.forEach((item, i) => {
    html += `
      <div style="margin-bottom:10px">
        ${item.quantidade}x ${item.nome}
        <br>${item.obs || ""}
        <br>
        <button class="btn-danger" onclick="remover(${i})">Remover</button>
      </div>
    `;
  });

  listaCarrinho.innerHTML = html;
}

// =======================
// REMOVER
// =======================
window.remover = i => {
  carrinho.splice(i, 1);
  renderCarrinho();
  atualizarCarrinho();
};

// =======================
// LIMPAR
// =======================
window.limparCarrinho = () => {
  carrinho = [];
  renderCarrinho();
  atualizarCarrinho();
};

// =======================
// ENVIAR
// =======================
window.enviar = () => {
  alert("Pedido enviado!");
};
