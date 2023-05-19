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
        <img src="${flags.svg}" alt="${flags.alt}" width="50" height="40">
        <h3>${name.common}</h3>
      </li>`;
     }).join('');
    
}

function createMarkupCard(data) {
    clearAll();
    refs.countryInfo.innerHTML = data.map(({ name, capital, population, flags, languages }) => {
        return `<div class = "title-box">
        <img src="${flags.svg}" width="60" height="50" alt="${flags.alt}">
        <h1>${name.common}</h1>
        </div>
        <p><span>Capital:</span> ${capital}</p>
        <p><span>Population:</span> ${population.toLocaleString()}</p>
        <p><span>Languages:</span> ${Object.values(languages).join(', ')}</p>`
        
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
