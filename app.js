import { PRODUTOS } from "./produtos.js";
import { CONFIG } from "./config.js";

let carrinho = [];
let produtoAtual = null;
let qtdAtual = 1;

const menu = document.getElementById("menu");
const cartInfo = document.getElementById("cartInfo");

PRODUTOS.forEach(p => {
  const div = document.createElement("div");
  div.className = "product";

  div.innerHTML = `
    <img src="${p.imagem}" />
    <h3>${p.nome}</h3>
    <p>${p.descricao}</p>
    <div class="price">R$ ${p.preco}</div>
    <div class="btn-add" onclick="abrirModal('${p.nome}')">+</div>
  `;

  menu.appendChild(div);
});

window.abrirModal = nome => {
  produtoAtual = PRODUTOS.find(p => p.nome === nome);
  qtdAtual = 1;

  modalNome.innerText = produtoAtual.nome;
  modalDesc.innerText = produtoAtual.descricao;
  modalPreco.innerText = "R$ " + produtoAtual.preco;

  modalQtd.innerText = qtdAtual;
  modalObs.value = "";

  sabores.innerHTML = "";

  if (produtoAtual.sabores) {
    sabores.innerHTML = "<h4>Escolha o sabor</h4>";
    produtoAtual.sabores.forEach(s => {
      sabores.innerHTML += `
        <label><input type="radio" name="sabor" value="${s}"> ${s}</label><br>
      `;
    });
  }

  modalProduto.style.display = "block";
};

window.fecharModal = () => modalProduto.style.display = "none";

window.aumentarQtd = () => {
  qtdAtual++;
  modalQtd.innerText = qtdAtual;
};

window.diminuirQtd = () => {
  if (qtdAtual > 1) qtdAtual--;
  modalQtd.innerText = qtdAtual;
};

window.confirmarAdd = () => {
  let sabor = "";

  if (produtoAtual.sabores) {
    const s = document.querySelector("input[name='sabor']:checked");
    if (!s) return alert("Escolha o sabor");
    sabor = s.value;
  }

  carrinho.push({
    nome: produtoAtual.nome + (sabor ? ` (${sabor})` : ""),
    preco: produtoAtual.preco,
    quantidade: qtdAtual,
    obs: modalObs.value
  });

  fecharModal();
  atualizarCarrinho();
};

function atualizarCarrinho() {
  let total = 0;
  carrinho.forEach(i => total += i.preco * i.quantidade);
  cartInfo.innerText = `${carrinho.length} itens | R$ ${total}`;
}

window.abrirCheckout = () => {
  if (!carrinho.length) return alert("Carrinho vazio");
  checkout.style.display = "block";
  renderCarrinho();
};

window.fecharCheckout = () => checkout.style.display = "none";

function renderCarrinho() {
  listaCarrinho.innerHTML = "";

  carrinho.forEach((item, i) => {
    listaCarrinho.innerHTML += `
      <div>
        ${item.quantidade}x ${item.nome}
        <br>${item.obs || ""}
        <br><button onclick="remover(${i})">Remover</button>
        <hr>
      </div>
    `;
  });
}

window.remover = i => {
  carrinho.splice(i, 1);
  renderCarrinho();
  atualizarCarrinho();
};

window.mostrarTroco = () => {
  areaTroco.style.display = pagamento.value === "Dinheiro" ? "block" : "none";
};

window.calcularTroco = () => {
  let total = 0;
  carrinho.forEach(i => total += i.preco * i.quantidade);

  const valor = parseFloat(valorPago.value);

  if (!valor || valor < total) return trocoResultado.innerText = "";

  trocoResultado.innerText = "Troco: R$ " + (valor - total).toFixed(2);
};

window.enviar = () => {
  if (!nome.value || !endereco.value || !telefone.value || !pagamento.value)
    return alert("Preencha tudo");

  let total = 0;
  carrinho.forEach(i => total += i.preco * i.quantidade);

  let msg = `Pedido\n\n`;

  carrinho.forEach(i => {
    msg += `${i.quantidade}x ${i.nome} (${i.obs})\n`;
  });

  msg += `\nTotal: R$ ${total}`;
  msg += `\n${nome.value}`;
  msg += `\n${endereco.value}`;
  msg += `\n${telefone.value}`;
  msg += `\n${pagamento.value}`;

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`);
};
``
