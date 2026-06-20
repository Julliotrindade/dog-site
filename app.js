let carrinho = [];
import { BUSINESS_CONFIG } from "./config.js";
import { PRODUTOS_EXEMPLO } from "./produtos-exemplo.js";

const menu = document.getElementById("menuContainer");

PRODUTOS_EXEMPLO.forEach(produto => {
  const div = document.createElement("div");
  div.className = "product-card";

  div.innerHTML = `
    <h3>${produto.nome}</h3>
    <p>${produto.descricao}</p>
    <strong>R$ ${produto.preco}</strong>
    <button onclick="adicionarCarrinho('${produto.nome}', ${produto.preco})">
  `;

  menu.appendChild(div);
});

window.pedir = function(nome, preco) {
  const msg = encodeURIComponent(
    `Pedido:\n${nome} - R$ ${preco}`
  );

  window.open(`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=${msg}`);
};
