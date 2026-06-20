import { PRODUTOS } from "./produtos.js";
import { CONFIG } from "./config.js";

let carrinho = [];
let produtoAtual = null;
let qtdAtual = 1;

// ELEMENTOS
const menu = document.getElementById("menu");
const cartInfo = document.getElementById("cartInfo");
const modalProduto = document.getElementById("modalProduto");
const overlay = document.getElementById("overlay");

const modalNome = document.getElementById("modalNome");
const modalDesc = document.getElementById("modalDesc");
const modalPreco = document.getElementById("modalPreco");
const modalQtd = document.getElementById("modalQtd");
const modalObs = document.getElementById("modalObs");

const checkout = document.getElementById("checkout");
const listaCarrinho = document.getElementById("listaCarrinho");

const nomeInput = document.getElementById("nome");
const enderecoInput = document.getElementById("endereco");
const telefoneInput = document.getElementById("telefone");
const pagamentoInput = document.getElementById("pagamento");

const areaTroco = document.getElementById("areaTroco");
const valorPagoInput = document.getElementById("valorPago");
const trocoResultado = document.getElementById("trocoResultado");

const cart = document.getElementById("cart");

// =======================
// RENDER PRODUTOS
// =======================
PRODUTOS.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";

  div.innerHTML = `
    ${p.imagem}
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

  modalNome.innerText = produtoAtual.nome;
  modalPreco.innerText = "R$ " + produtoAtual.preco;
  modalQtd.innerText = qtdAtual;
  modalObs.value = "";

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
// LISTAR
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
// TROCO
// =======================
window.mostrarTroco = () => {
  areaTroco.style.display =
    pagamentoInput.value === "Dinheiro" ? "block" : "none";
};

window.calcularTroco = () => {
  let total = 0;
  carrinho.forEach(i => total += i.preco * i.quantidade);

  const valor = parseFloat(valorPagoInput.value);

  if (!valor || valor < total) {
    trocoResultado.innerText = "";
    return;
  }

  trocoResultado.innerText =
    "Troco: R$ " + (valor - total).toFixed(2);
};

// =======================
// ENVIAR
// =======================
window.enviar = () => {
  if (!nomeInput.value || !enderecoInput.value || !telefoneInput.value || !pagamentoInput.value) {
    alert("Preencha todos os dados!");
    return;
  }

  let msg = "Pedido:\n\n";

  carrinho.forEach(i => {
    msg += `${i.quantidade}x ${i.nome}`;
    if (i.obs) msg += ` (${i.obs})`;
    msg += "\n";
  });

  msg += `\n${nomeInput.value}\n${enderecoInput.value}\n${telefoneInput.value}\n${pagamentoInput.value}`;

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`);
};
