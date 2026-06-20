import { PRODUTOS } from "./produtos.js";
import { CONFIG } from "./config.js";

let carrinho = [];

const menu = document.getElementById("menu");
const cartInfo = document.getElementById("cartInfo");

// PRODUTOS
PRODUTOS.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";

  div.innerHTML = `
    <h3>${p.nome}</h3>
    <p>${p.descricao}</p>
    <strong>R$ ${p.preco}</strong><br><br>
    <button onclick="add('${p.nome}', ${p.preco})">Adicionar</button>
  `;

  menu.appendChild(div);
});

// ADICIONAR
window.add = function(nome, preco) {
  carrinho.push({
    nome,
    preco,
    quantidade: 1,
    obs: ""
  });

  atualizarCarrinho();
};

// ATUALIZAR CARRINHO
function atualizarCarrinho() {
  let total = 0;

  carrinho.forEach(i => {
    total += i.preco * i.quantidade;
  });

  cartInfo.innerText = `${carrinho.length} itens | R$ ${total}`;
}

// ABRIR
window.abrirCheckout = function() {
  document.getElementById("checkout").style.display = "block";
  renderCarrinho();
};

// FECHAR
window.fecharCheckout = function() {
  document.getElementById("checkout").style.display = "none";
};

// RENDER
function renderCarrinho() {
  const container = document.getElementById("listaCarrinho");

  if (carrinho.length === 0) {
    container.innerHTML = "Carrinho vazio";
    return;
  }

  let html = "";

  carrinho.forEach((item, i) => {
    html += `
      <div style="background:#f5f5f5; padding:10px; margin-bottom:10px; border-radius:8px">

        <strong>${item.nome}</strong><br>

        <button onclick="diminuir(${i})">-</button>
        ${item.quantidade}
        <button onclick="aumentar(${i})">+</button>

        <input 
          value="${item.obs}"
          placeholder="Observação"
          onchange="editarObs(${i}, this.value)"
        >

        <button onclick="remover(${i})">Remover</button>

      </div>
    `;
  });

  container.innerHTML = html;
}

// FUNÇÕES
window.aumentar = i => {
  carrinho[i].quantidade++;
  renderCarrinho();
  atualizarCarrinho();
};

window.diminuir = i => {
  if (carrinho[i].quantidade > 1) {
    carrinho[i].quantidade--;
  } else {
    carrinho.splice(i, 1);
  }
  renderCarrinho();
  atualizarCarrinho();
};

window.remover = i => {
  carrinho.splice(i, 1);
  renderCarrinho();
  atualizarCarrinho();
};

window.editarObs = (i, val) => {
  carrinho[i].obs = val;
};

// WHATSAPP
window.enviar = function() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio");
    return;
  }

  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const telefone = document.getElementById("telefone").value;
  const pagamento = document.getElementById("pagamento").value;

  let msg = `🌭 Pedido - ${CONFIG.nome}\n\n`;

  carrinho.forEach(item => {
    msg += `${item.quantidade}x ${item.nome}`;
    if (item.obs) msg += ` (Obs: ${item.obs})`;
    msg += "\n";
  });

  msg += `\n👤 ${nome}`;
  msg += `\n📍 ${endereco}`;
  msg += `\n📞 ${telefone}`;
  msg += `\n💳 ${pagamento}`;

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`);
};
