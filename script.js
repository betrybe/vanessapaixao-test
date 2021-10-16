function showLoading() {
  const e = document.createElement('div');
  e.className = 'loading';
  e.innerText = 'Loading...';
  const cart = document.getElementsByClassName('cart');
  cart[0].appendChild(e);
}

function hideLoading() {
  const cart = document.getElementsByClassName('cart');
  cart[0].removeChild(cart[0].lastChild);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function findBySKU(sku) {
  showLoading();
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const data = await response.json();
  hideLoading();
  return {
    sku: data.id,
    name: data.title,
    image: data.thumbnail,
    salePrice: data.price,
  };
}

async function calculatePrice() {
  let soma = 0;
  for (let i = 0; i < localStorage.length; i += 1) {
    const sku = localStorage.key(i);
    const product = JSON.parse(localStorage.getItem(sku));
    soma += product.salePrice;
  }

  const lista = document.getElementsByClassName('total-price');
  lista[0].innerHTML = soma;
}

function cartItemClickListener(event) {
  if (event.target.hasAttribute('sku')) {
    const sku = event.target.getAttribute('sku');
    localStorage.removeItem(sku);
    event.target.parentElement.removeChild(event.target);
    calculatePrice();
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.setAttribute('sku', sku);
  return li;
}

// Função de adicionar item no carrinho
async function productClickListener(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  const product = await findBySKU(sku);
  if (!localStorage.getItem(product.sku)) {
    const item = createCartItemElement(product);
    const lista = document.getElementsByClassName('cart__items');
    lista[0].appendChild(item);
    localStorage.setItem(product.sku, JSON.stringify(product));
    calculatePrice();
  } else {
    alert(`O produto ${product.name} já está no carrinho.`);
  }
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(
  element,
  className,
  innerText,
  eventListener = null,
) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (eventListener) {
    e.addEventListener('click', eventListener);
  }
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement(
      'button',
      'item__add',
      'Adicionar ao carrinho!',
      productClickListener,
    ),
  );

  return section;
}

// Funções para busca de dados e organização

async function returnProducts() {
  showLoading();
  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
  const data = await response.json();
  const results = [];
  data.results.forEach((element) => {
    results.push({
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
      salePrice: element.price,
    });
  });
  hideLoading();
  return results;
}

// Função que recupera os itens do localStorage
async function populateCart() {
  if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i += 1) {
      const sku = localStorage.key(i);
      const product = JSON.parse(localStorage.getItem(sku));
      const item = createCartItemElement(product);
      const lista = document.getElementsByClassName('cart__items');
      lista[0].appendChild(item);
    }
  }
}

// Função para esvaziar o carrinho

function clearCart() {
  const lista = document.getElementsByClassName('cart__items');
  localStorage.clear();
  lista[0].innerHTML = '';
  calculatePrice();
}

// Fução para soma dos preços do carrinho

window.onload = async () => {
  const resultado = await returnProducts();
  const lista = document.getElementsByClassName('items');
  const clearButton = document.getElementsByClassName('empty-cart');
  clearButton[0].addEventListener('click', clearCart);
  resultado.forEach((element) => {
    const objeto = createProductItemElement(element);
    lista[0].appendChild(objeto);
  });
  showLoading();
  populateCart();
  calculatePrice();
  hideLoading();
};
