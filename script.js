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
  // coloque seu código aqui-


}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//Função de adicionar item no carrinho
async function productClickListener(event) {
  //createCartItemElement();
  const sku = getSkuFromProductItem(event.target.parentElement);
  const product = await findBySKU(sku);
  console.log(product);
  const item = createCartItemElement(product);
  let lista = document.getElementsByClassName("cart__items");
  lista[0].appendChild(item);
}

//Funções para busca de dados e organização

async function returnProducts(){
  let response = await fetch ("https://api.mercadolibre.com/sites/MLB/search?q=computador")
  let data = await response.json();
  let results =[];
  data.results.forEach(element=>{results.push({sku:element.id,name:element.title,image:element.thumbnail,salePrice:element.price})})
  return results;
}

async function findBySKU(sku) {
  let response = await fetch (`https://api.mercadolibre.com/items/${sku}`)
  let data = await response.json();
  return {sku:data.id,name:data.title,image:data.thumbnail,salePrice:data.price};
}

window.onload = async () => {
  let resultado = await returnProducts();
  let lista = document.getElementsByClassName("items");
  resultado.forEach(element => {
    let objeto = createProductItemElement(element);
    lista[0].appendChild(objeto);
  });
};
