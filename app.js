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
    ${p.imagem}
    <h3>${p.nome}</h3>
    <p>${p.descricao || ""}</p>
    <div class="price">R$ ${p.preco}</div>

    <div class="btn-add" onclick="abrirModal('${p.nome}')">
      +
    </div>
  `;

  menu.appendChild(div);
});

// =======================
// MODAL
// =======================
window.abrirModal = function(nome) {
  produtoAtual = PRODUTOS.find(p => p.nome === nome);
  qtdAtual = 1;

  document.getElementById("modalNome").innerText = produtoAtual.nome;
  document.getElementById("modalDesc").innerText = produtoAtual.descricao || "";
  document.getElementById("modalPreco").innerText = "R$ " + produtoAtual.preco;
  document.getElementById("modalQtd").innerText = qtdAtual;
  document.getElementById("modalObs").value = "";

  const saboresDiv = document.getElementById("sabores");
  saboresDiv.innerHTML = "";

  if (produtoAtual.sabores) {
    saboresDiv.innerHTML = "<h4>Escolha o sabor</h4>";

    produtoAtual.sabores.forEach(s => {
      saboresDiv.innerHTML += `
        <label>
          <input type="radio" name="sabor" value="${s}">
          ${s}
        </label>
      `;
    });
  }

  document.getElementById("overlay").style.display = "block";
  document.getElementById("modalProduto").style.display = "flex";
};

window.fecharModal = () => {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("modalProduto").style.display = "none";
};

// =======================
// QUANTIDADE
// =======================
window.aumentarQtd = () => {
  qtdAtual++;
  document.getElementById("modalQtd").innerText = qtdAtual;
};

window.diminuirQtd = () => {
  if (qtdAtual > 1) qtdAtual--;
  document.getElementById("modalQtd").innerText = qtdAtual;
};

// =======================
// ADICIONAR
// =======================
window.confirmarAdd = () => {

  let saborSelecionado = "";

  if (produtoAtual.sabores) {
    const s = document.querySelector("input[name='sabor']:checked");

    if (!s) {
      alert("Escolha um sabor!");
      return;
    }

    saborSelecionado = s.value;
  }

  carrinho.push({
    nome: produtoAtual.nome + (saborSelecionado ? ` (${saborSelecionado})` : ""),
    preco: produtoAtual.preco,
    quantidade: qtdAtual,
    obs: document.getElementById("modalObs").value
  });

  atualizarCarrinho();
  fecharModal();
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
window.abrirCheckout = () => {
  if (carrinho.length === 0) {
    alert("Adicione algo primeiro!");
    return;
  }

  document.getElementById("checkout").style.display = "block";
  renderCarrinho();
};

window.fecharCheckout = () => {
  document.getElementById("checkout").style.display = "none";
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
        <br><button onclick="remover(${i})">Remover</button>
        <hr>
      </div>
    `;
  });

  document.getElementById("listaCarrinho").innerHTML = html;
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
// TROCO
// =======================
window.mostrarTroco = () => {
  const pagamento = document.getElementById("pagamento").value;

  document.getElementById("areaTroco").style.display =
    pagamento === "Dinheiro" ? "block" : "none";
};

window.calcularTroco = () => {
  let total = 0;
  carrinho.forEach(i => total += i.preco * i.quantidade);

  const valor = parseFloat(document.getElementById("valorPago").value);

  if (!valor || valor < total) {
