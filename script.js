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

function returnObject(data) {
  return {
    sku: data.id,
    name: data.title,
    image: data.thumbnail,
    salePrice: data.price,
  };
}

async function findBySKU(sku) {
  showLoading();
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const data = await response.json();
  hideLoading();
  return returnObject(data);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function calculatePrice() {
  let soma = 0;
  for (let i = 0; i < localStorage.length; i += 1) {
    const sku = localStorage.key(i);
    const product = JSON.parse(localStorage.getItem(sku));
    soma += product.salePrice;
  }
  const preco = document.getElementsByClassName('total-price')[0];
  preco.innerHTML = soma;
}

function cartItemClickListener(event) {
  if (event.target.hasAttribute('sku')) {
    const sku = event.target.getAttribute('sku');
    localStorage.removeItem(sku);
    event.target.parentElement.removeChild(event.target);
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

async function productClickListener(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  const product = await findBySKU(sku);
  if (!localStorage.getItem(product.sku)) {
    const item = createCartItemElement(product);
    const lista = document.getElementsByClassName('cart__items');
    lista[0].appendChild(item);
    localStorage.setItem(product.sku, JSON.stringify(product));
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

async function returnProducts() {
  showLoading();
  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
  const data = await response.json();
  const results = [];
  data.results.forEach((element) => {
    results.push(returnObject(element));
  });
  hideLoading();
  return results;
}

function populateCart() {
  if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i += 1) {
      const sku = localStorage.key(i);
      const product = JSON.parse(localStorage.getItem(sku));
      const item = createCartItemElement(product);
      const carrinho = document.getElementsByClassName('cart__items')[0];
      carrinho.appendChild(item);
    }
  }
}

function clearCart() {
  const carrinho = document.getElementsByClassName('cart__items')[0];
  carrinho.innerHTML = '';
  localStorage.clear();
}

function setClearCartListener() {
  const clearButton = document.getElementsByClassName('empty-cart')[0];
  clearButton.addEventListener('click', clearCart);
}

function populateItems(products) {
  showLoading();
  const lista = document.getElementsByClassName('items')[0];
  products.forEach((element) => {
    const objeto = createProductItemElement(element);
    lista.appendChild(objeto);
  });
  hideLoading();
}

window.onload = async () => {
  const resultado = await returnProducts();
  populateItems(resultado);
  setClearCartListener();
  populateCart();
  window.setInterval(calculatePrice, 2000);
};
