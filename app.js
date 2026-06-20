import { PRODUTOS } from "./produtos.js";
import { CONFIG } from "./config.js";

let carrinho = [];

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
    <strong>R$ ${p.preco}</strong><br><br>
    <button onclick="add('${p.nome}', ${p.preco})">Adicionar</button>
  `;

  menu.appendChild(div);
});

// =======================
// ADICIONAR AO CARRINHO
// =======================
window.add = function(nome, preco) {
  carrinho.push({
    nome: nome,
    preco: preco,
    quantidade: 1,
    obs: ""
  });

  atualizarCarrinho();
};

// =======================
// MOSTRAR QUANTIDADE
// =======================
function atualizarCarrinho() {
  cartInfo.innerText = carrinho.length + " itens";
}

// =======================
// ABRIR CHECKOUT
// =======================
window.abrirCheckout = function() {
  document.getElementById("checkout").style.display = "block";
  renderCarrinho(); // 🔥 IMPORTANTE
};

// =======================
// MOSTRAR ITENS DO CARRINHO
// =======================
function renderCarrinho() {
  const container = document.getElementById("listaCarrinho");

  if (!container) return;

  if (carrinho.length === 0) {
    container.innerHTML = "<p>Carrinho vazio</p>";
    return;
  }

  let html = "";

  carrinho.forEach((item, index) => {
    html += `
      <div style="border:1px solid #ccc; margin:5px; padding:10px">
        <strong>${item.nome}</strong><br><br>

        Quantidade:
        <button onclick="diminuir(${index})">-</button>
        ${item.quantidade}
        <button onclick="aumentar(${index})">+</button>

        <br><br>

        Observação:
        <input 
          value="${item.obs}" 
          onchange="editarObs(${index}, this.value)"
        >

        <br><br>

        <button onclick="remover(${index})">Remover</button>
      </div>
    `;
  });

  container.innerHTML = html;
}

// =======================
// AÇÕES DO CARRINHO
// =======================
window.aumentar = function(index) {
  carrinho[index].quantidade++;
  renderCarrinho();
};

window.diminuir = function(index) {
  if (carrinho[index].quantidade > 1) {
    carrinho[index].quantidade--;
  } else {
    carrinho.splice(index, 1);
  }
  renderCarrinho();
};

window.remover = function(index) {
  carrinho.splice(index, 1);
  renderCarrinho();
};

window.editarObs = function(index, valor) {
  carrinho[index].obs = valor;
};

// =======================
// ENVIAR PARA WHATSAPP
// =======================
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

    if (item.obs) {
      msg += ` (Obs: ${item.obs})`;
    }

    msg += "\n";
  });

  msg += `\n👤 ${nome}`;
  msg += `\n📍 ${endereco}`;
  msg += `\n📞 ${telefone}`;
  msg += `\n💳 ${pagamento}`;

  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

  window.open(url, "_blank");
};
