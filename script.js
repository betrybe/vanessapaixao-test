function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//Funções para busca de dados e organização

async function returnProducts(){
  let response = await fetch ("https://api.mercadolibre.com/sites/MLB/search?q=computador")
  let data = await response.json();
  let results =[]
  data.results.forEach(element=>{results.push({sku:element.id,name:element.title,image:element.thumbnail,salePrice:element.price})})
  return results
}

window.onload = async () => {
  let resultado = await returnProducts();
  let lista = document.getElementsByClassName("items")
  resultado.forEach(element => {
    let objeto = createProductItemElement(element);
    lista[0].appendChild(objeto);
  });
};
