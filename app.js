import { PRODUTOS } from "./produtos.js";

let carrinho = [];
let produtoAtual = null;
let qtdAtual = 1;

// =======================
// ELEMENTOS
// =======================
const menu = document.getElementById("menu");
const cartInfo = document.getElementById("cartInfo");

const modalProduto = document.getElementById("modalProduto");
const modalImg = document.getElementById("modalImg");
const modalNome = document.getElementById("modalNome");
const modalDesc = document.getElementById("modalDesc");
const modalPreco = document.getElementById("modalPreco");
const modalQtd = document.getElementById("modalQtd");
const modalObs = document.getElementById("modalObs");

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

    <div class="btn-add" onclick="abrirModal('${p.nome}')">
      +
    </div>
  `;

  menu.appendChild(div);
});

// =======================
// MODAL PRODUTO
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
// ADICIONAR AO CARRINHO
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
// ATUALIZAR RESUMO
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
// LISTAR ITENS (EDITÁVEL)
// =======================
function renderCarrinho() {
  let html = "";

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = "<p>Carrinho vazio</p>";
    return;
  }

  carrinho.forEach((item, i) => {
    html += `
      <div style="background:#f5f5f5; padding:10px; margin-bottom:10px; border-radius:8px;">

        <strong>${item.nome}</strong><br>

        <!-- QUANTIDADE -->
        <div style="margin-top:5px;">
          <button onclick="diminuir(${i})">-</button>
          ${item.quantidade}
          <button onclick="aumentar(${i})">+</button>
        </div>

        <!-- OBS -->
        <input 
          value="${item.obs || ""}" 
          placeholder="Observação"
          onchange="editarObs(${i}, this.value)"
        >

        <br>

        <!-- REMOVER -->
        <button class="btn-danger" onclick="remover(${i})">
          Remover
        </button>

      </div>
    `;
  });

  listaCarrinho.innerHTML = html;
}

// =======================
// EDITAR ITENS
// =======================
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

window.editarObs = (i, valor) => {
  carrinho[i].obs = valor;
};

// =======================
// REMOVER
// =======================
window.remover = i => {
  carrinho.splice(i, 1);
  renderCarrinho();
  atualizarCarrinho();
};

// =======================
// LIMPAR CARRINHO
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

  carrinho.forEach(item => {
    msg += `${item.quantidade}x ${item.nome}`;
    if (item.obs) msg += ` (${item.obs})`;
    msg += "\n";
  });

  msg += `\n👤 ${nome}`;
  msg += `\n📍 ${endereco}`;
  msg += `\n📞 ${telefone}`;
  msg += `\n💳 ${pagamento}`;

  window.open(`https://wa.me/5584996564129?text=${encodeURIComponent(msg)}`);
};
