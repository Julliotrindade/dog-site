import { PRODUTOS } from "./produtos.js";

let carrinho = [];
let produtoAtual = null;
let qtdAtual = 1;

// ELEMENTOS
const menu = document.getElementById("menu");
const cartInfo = document.getElementById("cartInfo");

// MODAL
const modalProduto = document.getElementById("modalProduto");
const modalNome = document.getElementById("modalNome");
const modalDesc = document.getElementById("modalDesc");
const modalPreco = document.getElementById("modalPreco");
const modalQtd = document.getElementById("modalQtd");
const modalObs = document.getElementById("modalObs");
const modalImg = document.getElementById("modalImg");

const carrinhoModal = document.getElementById("carrinhoModal");
const listaCarrinho = document.getElementById("listaCarrinho");

// =======================
// RENDER PRODUTOS
// =======================
PRODUTOS.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";

  div.innerHTML = `
    ${p.imagem}
    <h3>${p.nome}</h3>
    <p>R$ ${p.preco}</p>
    <button onclick="abrirModal('${p.nome}')">+</button>
  `;

  menu.appendChild(div);
});

// =======================
// MODAL
// =======================
window.abrirModal = nome => {
  produtoAtual = PRODUTOS.find(p => p.nome === nome);
  qtdAtual = 1;

  modalNome.innerText = produtoAtual.nome;
  modalDesc.innerText = produtoAtual.descricao;
  modalPreco.innerText = "R$ " + produtoAtual.preco;
  modalQtd.innerText = qtdAtual;
  modalObs.value = "";
  modalImg.src = produtoAtual.imagem.match(/src='(.*?)'/)[1];

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
// ABRIR CARRINHO
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
      <div>
        ${item.quantidade}x ${item.nome}
        <br>${item.obs || ""}
        <br>
        <button onclick="remover(${i})">Remover</button>
      </div><hr>
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

  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const telefone = document.getElementById("telefone").value;
  const pagamento = document.getElementById("pagamento").value;

  if (!nome || !endereco || !telefone || !pagamento) {
    alert("Preencha tudo!");
    return;
  }

  let msg = "Pedido:\n\n";

  carrinho.forEach(i => {
    msg += `${i.quantidade}x ${i.nome}`;
    if (i.obs) msg += ` (${i.obs})`;
    msg += "\n";
  });

  msg += `\n👤 ${nome}`;
  msg += `\n📍 ${endereco}`;
  msg += `\n📞 ${telefone}`;
  msg += `\n💳 ${pagamento}`;

  window.open(`https://wa.me/5584999999999?text=${encodeURIComponent(msg)}`);
};
