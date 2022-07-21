import './sass/index.scss';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import notiflix from 'notiflix';
import ApiService from './js/AapiService.js';
import NextButton from './js/NextButton.js';
import cardTemplate from './js/cardTemplate.js';
import SimpleLightbox from 'simplelightbox.js';

const searchOptions = {
  image_type: 'photo',
  orientation: 'horizontal',
  per_page: 40,
  safesearch: true,
};

const newFetch = new ApiService(searchOptions);

const NO_RESULT_MESSAGE =
  'Sorry, there are no images matching your search query. Please try again.';
const NO_INPUT_MESSAGE = 'Ups! No data to search! Fill search string, please!';
const END_OF_SEARCH_MESSAGE = `We're sorry, but you've reached the end of search results.`;

const refs = {
  searchForm: document.getElementById('search-form'),
  galleryContainer: document.querySelector('.gallery__container'),
};

const nextBtn = new NextButton({ selector: '.load-more' });

refs.searchForm.addEventListener('submit', onSubmit);
nextBtn.refs.button.addEventListener('click', onNextBtnClick);

const simpleLightbox = new SimpleLightbox('.gallery a');

nextBtn.hide();

function onSubmit(e) {
  e.preventDefault();

  newFetch.resetPage();
  newFetch.searchString = refs.searchForm.elements.searchQuery.value;
  refs.galleryContainer.innerHTML = '';

  if (!refs.searchForm.elements.searchQuery.value) {
    showInfoMessage(NO_INPUT_MESSAGE);
    return;
  }

  newFetch
    .fetchImages()
    .then(items => {
      if (!items.hits.length) {
        showInfoMessage(NO_RESULT_MESSAGE);
        return;
      }

      refs.galleryContainer.innerHTML = createCardsMurkup(items.hits);

      showInfoMessage(`Hooray! We found ${newFetch.totalHits} images.`);

      simpleLightbox.refresh();

      nextBtn.enable();

      if (newFetch.isNoItemsToLoadMore()) {
        nextBtn.hide();
        showInfoMessage(END_OF_SEARCH_MESSAGE);
      }
    })
    .catch(error => console.log(error));

  refs.searchForm.reset();
}

function onNextBtnClick(e) {
  nextBtn.disable();

  newFetch
    .fetchImages()
    .then(items => {
      refs.galleryContainer.insertAdjacentHTML(
        'beforeend',
        createCardsMurkup(items.hits)
      );

      nextBtn.enable();

      if (newFetch.isNoItemsToLoadMore()) {
        nextBtn.hide();
        showInfoMessage(END_OF_SEARCH_MESSAGE);
      }

      simpleLightbox.refresh();
    })
    .catch(error => console.log(error));
}

function createCardsMurkup(cards) {
  return cards.map(cardTemplate).join('');
}

function showInfoMessage(message) {
  notiflix.Notify.info(message);
}
