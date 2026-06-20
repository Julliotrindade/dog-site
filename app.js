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

    <strong>R$ ${p.preco}</strong>

    <!-- 🔥 CAMPO DE OBSERVAÇÃO -->
    <input 
      id="obs-${p.nome}"
      placeholder="Ex: sem milho / extra queijo"
      style="width:100%; margin-top:5px; padding:8px;"
    >

    <button onclick="add('${p.nome}', ${p.preco})">
      Adicionar
    </button>
  `;

  menu.appendChild(div);
});


// =======================
// ADICIONAR AO CARRINHO
// =======================
window.add = function(nome, preco) {

  const obsInput = document.getElementById("obs-" + nome);
  const observacao = obsInput ? obsInput.value : "";

  carrinho.push({
    nome,
    preco,
    quantidade: 1,
    obs: observacao
  });

  // limpa campo depois
  if (obsInput) obsInput.value = "";

  atualizarCarrinho();
};


// =======================
// ATUALIZAR TEXTO CARRINHO
// =======================
function atualizarCarrinho() {
  let total = 0;

  carrinho.forEach(i => {
    total += i.preco * i.quantidade;
  });

  cartInfo.innerText = `${carrinho.length} itens | R$ ${total}`;
}


// =======================
// ABRIR CHECKOUT
// =======================
window.abrirCheckout = function() {
  document.getElementById("checkout").style.display = "block";
  renderCarrinho();
};

// FECHAR
window.fecharCheckout = function() {
  document.getElementById("checkout").style.display = "none";
};


// =======================
// RENDER DO CARRINHO
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
      <div style="background:#f5f5f5; padding:10px; margin-bottom:10px; border-radius:8px">
        
        <strong>${item.nome}</strong><br>

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
// FUNÇÕES DO CARRINHO
// =======================
window.aumentar = function(index) {
  carrinho[index].quantidade++;
  renderCarrinho();
  atualizarCarrinho();
};

window.diminuir = function(index) {
  if (carrinho[index].quantidade > 1) {
    carrinho[index].quantidade--;
  } else {
    carrinho.splice(index, 1);
  }
  renderCarrinho();
  atualizarCarrinho();
};

window.remover = function(index) {
  carrinho.splice(index, 1);
  renderCarrinho();
  atualizarCarrinho();
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
