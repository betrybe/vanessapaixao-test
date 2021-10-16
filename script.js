function showLoading(){
  let overlay = document.getElementsByClassName('loading')
  overlay[0].style.display = 'block';
}

function hideLoading(){
  let overlay = document.getElementsByClassName('loading')
  overlay[0].style.display = 'none';
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, eventListener=null) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (eventListener){
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', productClickListener));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  if (event.target.hasAttribute('sku')){
    let sku = event.target.getAttribute('sku');
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
  li.setAttribute('sku',sku);
  return li;
}

//Função de adicionar item no carrinho
async function productClickListener(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  const product = await findBySKU(sku);
  const item = createCartItemElement(product);
  let lista = document.getElementsByClassName("cart__items");
  lista[0].appendChild(item);
  localStorage.setItem(product.sku,JSON.stringify(product));
  calculatePrice();
}

//Funções para busca de dados e organização

async function returnProducts(){
  showLoading();
  let response = await fetch ("https://api.mercadolibre.com/sites/MLB/search?q=computador")
  let data = await response.json();
  let results =[];
  data.results.forEach(element=>{results.push({sku:element.id,name:element.title,image:element.thumbnail,salePrice:element.price})})
  hideLoading();
  return results;
}

async function findBySKU(sku) {
  showLoading();
  let response = await fetch (`https://api.mercadolibre.com/items/${sku}`)
  let data = await response.json();
  hideLoading();
  return {sku:data.id,name:data.title,image:data.thumbnail,salePrice:data.price};
}

//Função que recupera os itens do localStorage
async function populateCart(){
  if(localStorage.length>0){
    for (var i = 0; i<localStorage.length; i++) {
      let sku = localStorage.key(i);
      const product = await findBySKU(sku);
      const item = createCartItemElement(product);
      let lista = document.getElementsByClassName("cart__items");
      lista[0].appendChild(item);
    }
  }
}

// Função para esvaziar o carrinho

function clearCart(){
  let lista = document.getElementsByClassName("cart__items");
  localStorage.clear();
  lista[0].innerHTML='';
  calculatePrice();
}

// Fução para soma dos preços do carrinho

async function calculatePrice(){
  let soma=0;
  for (var i = 0; i<localStorage.length; i++) {
    let sku = localStorage.key(i);
    const product = await findBySKU(sku);
    soma=soma+product.salePrice;
  }
  let lista = document.getElementsByClassName("total-price");
  lista[0].innerHTML=soma;
}

window.onload = async () => {
  let resultado = await returnProducts();
  let lista = document.getElementsByClassName("items");
  resultado.forEach(element => {
    let objeto = createProductItemElement(element);
    lista[0].appendChild(objeto);
  });
  populateCart();
  calculatePrice();
};
