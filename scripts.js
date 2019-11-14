const API_URL = 'https://apis.is/company?name=';

/**
* Leit að fyrirtækjum á Íslandi gegnum apis.is
*/
const program = (() => {
  let form;
  let results;

  function init(companies) {
    const forms = companies.querySelector('form');
    input = forms.querySelector('input');
    results = companies.querySelector('.results');

    forms.addEventListener('submit', onSubmit);
  }

  function onSubmit(e) {
    e.preventDefault();

    const domain = input.value;

    if (typeof domain !== 'string' || domain === '') {
      showMessage('input verður að vera strengur');
    } else {
      fetchData(domain);
    }
  }

  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function showMessage(msg) {
    empty(results);
    results.appendChild(el('p', msg));
  }

  function fetchData(event){
    displayLoadingState();

    fetch(`${API_URL}${event}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Villa');
        }
        return res.json();
      })
      .then(data => addToDom(data.results))
      .catch((error) => {
        console.error('Villa', error);
        showMessage('Villa');
      });

  }

  function el(name, ...children) {
    const element = document.createElement(name);

    for (let child of children) {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child) {
        element.appendChild(child);
      }
    }

    return element;
  }

  function displayLoadingState(){
    empty(results);

    const imgElement = document.createElement('img');
    imgElement.setAttribute('alt', '');
    imgElement.setAttribute('src', 'loading.gif');

    const loading = el('div', imgElement, 'Leita...');
    loading.classList.add('loading');

    results.appendChild(loading);
    //ná í results

  }

  function removeLoadingState(){
    const imgElement = results.querySelector('img')
    results.removeChild(imgElement)
  }

  function addToDom(data){
    const { results } = data
    const resultDivs = []
    for(let result of results){
      const resultDiv = document.createElement('div')

      if(result.active){
      resultDiv.classList.add('company--active')
    }
      resultDivs.push(resultDiv)
    }

    for(let div of resultDivs){
      resultsDOM.appendChild(div)
    }
    resultDivs.forEach(resultDOM.appendChild)
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('.companies')

  program.init(companies);
});
