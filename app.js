import { PRODUTOS } from "./produtos.js";
import { CONFIG } from "./config.js";

let carrinho = [];

let produtoAtual = null;
let qtdAtual = 1;

const menu = document.getElementById("menu");
const cartInfo = document.getElementById("cartInfo");

// =======================
// RENDERIZAÇÃO (CARDS)
// =======================
PRODUTOS.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";

  div.innerHTML = `
    <img src="${p.imagem}" />

    <h3>${p.nome}</h3>
    <p>${p.descricao}</p>

    <div class="price">R$ ${p.preco}</div>

    <div class="btn-add" onclick="clicarProduto('${p.nome}')">
      +
    </div>
  `;

  menu.appendChild(div);
});

// =======================
// BOTÃO +
// =======================
window.clicarProduto = function(nome) {
  const produto = PRODUTOS.find(p => p.nome === nome);

  // se NÃO tem opções → add direto
  if (!produto.sabores) {
    carrinho.push({
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1,
      obs: ""
    });

    atualizarCarrinho();
    animarAdd();

  } else {
    abrirModal(nome);
  }
};


// =======================
// MODAL
// =======================
window.abrirModal = function(nome) {
  produtoAtual = PRODUTOS.find(p => p.nome === nome);
  qtdAtual = 1;

  document.getElementById("modalNome").innerText = produtoAtual.nome;
  document.getElementById("modalDesc").innerText = produtoAtual.descricao;
  document.getElementById("modalPreco").innerText = "R$ " + produtoAtual.preco;
  document.getElementById("modalQtd").innerText = qtdAtual;
  document.getElementById("modalObs").value = "";

  // SABORES
  const saboresDiv = document.getElementById("sabores");
  saboresDiv.innerHTML = "";

  if (produtoAtual.sabores) {
    saboresDiv.innerHTML = "<h4>Escolha o sabor</h4>";

    produtoAtual.sabores.forEach(s => {
      saboresDiv.innerHTML += `
        <label>
          <input type="radio" name="sabor" value="${s}">
          ${s}
        </label><br>
      `;
    });
  }

  document.getElementById("modalProduto").style.display = "block";
};

window.fecharModal = () => {
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
// CONFIRMAR ADD
// =======================
window.confirmarAdd = () => {
  let saborSelecionado = "";

  if (produtoAtual.sabores) {
    const sabor = document.querySelector("input[name='sabor']:checked");

    if (!sabor) {
      alert("Escolha um sabor!");
      return;
    }

    saborSelecionado = sabor.value;
  }

  const obs = document.getElementById("modalObs").value;

  carrinho.push({
    nome: produtoAtual.nome + (saborSelecionado ? ` (${saborSelecionado})` : ""),
    preco: produtoAtual.preco,
    quantidade: qtdAtual,
    obs
  });

  fecharModal();
  atualizarCarrinho();
  animarAdd();
};


// =======================
// ANIMAÇÃO
// =======================
function animarAdd() {
  const cart = document.getElementById("cart");

  cart.style.transform = "scale(1.1)";
  setTimeout(() => {
    cart.style.transform = "scale(1)";
  }, 200);
}


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
// LIMPAR CARRINHO
// =======================
window.limpar = () => {
  carrinho = [];
  renderCarrinho();
  atualizarCarrinho();
};


// =======================
// RENDER CARRINHO
// =======================
function renderCarrinho() {
  const c = document.getElementById("listaCarrinho");

  let html = `<button onclick="limpar()">Limpar Carrinho</button><br><br>`;

  carrinho.forEach((item, i) => {
    html += `
      <div style="background:#eee; padding:10px; margin:5px;">
        ${item.quantidade}x ${item.nome}
        <br>
        ${item.obs || ""}
        <br>
        <button onclick="remover(${i})">Remover</button>
      </div>
    `;
  });

  c.innerHTML = html;
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
// TROCO AUTOMATICO
// =======================
window.mostrarTroco = function() {
  const pagamento = document.getElementById("pagamento").value;
  const area = document.getElementById("areaTroco");

  area.style.display = pagamento === "Dinheiro" ? "block" : "none";
};

window.calcularTroco = function() {
  const valorPago = parseFloat(document.getElementById("valorPago").value);

  let total = 0;
  carrinho.forEach(i => total += i.preco * i.quantidade);

  if (!valorPago || valorPago < total) {
    document.getElementById("trocoResultado").innerText = "";
    return;
  }

  const troco = valorPago - total;

  document.getElementById("trocoResultado").innerText =
    "Troco: R$ " + troco.toFixed(2);
};


// =======================
// ENVIAR WHATSAPP
// =======================
window.enviar = () => {

  if (carrinho.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const telefone = document.getElementById("telefone").value;
  const pagamento = document.getElementById("pagamento").value;
  const valorPago = document.getElementById("valorPago")?.value;

  if (!nome || !endereco || !telefone || !pagamento) {
    alert("Preencha todos os dados!");
    return;
  }

  let total = 0;
  carrinho.forEach(i => total += i.preco * i.quantidade);

  let msg = `🌭 Pedido - ${CONFIG.nome}\n\n`;

  carrinho.forEach(item => {
    msg += `${item.quantidade}x ${item.nome}`;
    if (item.obs) msg += ` (${item.obs})`;
    msg += "\n";
  });

  msg += `\n💰 Total: R$ ${total}`;
  msg += `\n👤 ${nome}`;
  msg += `\n📍 ${endereco}`;
  msg += `\n📞 ${telefone}`;
  msg += `\n💳 ${pagamento}`;

  if (pagamento === "Dinheiro" && valorPago) {
    const troco = valorPago - total;

    msg += `\n💰 Troco para: R$ ${valorPago}`;
    msg += `\n🪙 Troco: R$ ${troco.toFixed(2)}`;
  }

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`);
};
