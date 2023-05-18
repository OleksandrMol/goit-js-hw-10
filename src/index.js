import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js'
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
    searchBox: document.getElementById('search-box')
}


refs.searchBox.addEventListener('input', debounce(textInput, DEBOUNCE_DELAY ));

function textInput(evt) {
    const input = evt.target.value.trim();
    if (input === '') {
        clearAll();
        return;
    } else {
        fetchCountries(input)
            .then((countryName) => {
                if (countryName.length > 10) {
                    clearAll();
                    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
                } else if (countryName.length <= 10 && countryName.length >= 2) {
                    createMarkupList(countryName);
                }
                else if (countryName.length === 1) { 
                    createMarkupCard(countryName)
                }
            })
            .catch(onError);
    }

    fetchCountries(input).then((res) => console.log(res));
}

function createMarkupList(data) {
    clearAll();
     refs.countryList.innerHTML = data.map(({ name, flags }) => {
            return `<li class="li-item">
        <img src="${flags.svg}" alt="${flags.alt}" width="40" height="30">
        <h2>${name.common}</h2>
      </li>`;
     }).join('');
    
}

function createMarkupCard(data) {
    clearAll();
    refs.countryList.innerHTML = data.map(({ name, capital, population, flags, languages }) => {
        return `<img src="${flags.svg}" width="70" height="60" alt="${flags.alt}">
        <h2>${name.common} (${name.common})</h2>
        <p>Capital: ${capital}</p>
        <p>Population: ${population.toLocaleString()}</p>
        <p>Languages: ${Object.values(languages).join(', ')}</p>`
        
    })
}





function onError() {
    clearAll();
    Notiflix.Notify.failure('Oops, there is no country with that name')

}


function clearAll() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
};
