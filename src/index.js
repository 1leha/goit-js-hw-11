import './sass/index.scss';

import { searchOptions, lightboxOptions } from './js/options';
import { ApiService } from './js/ApiService.js';
import { message } from './js/messages.js';
import { refs } from './js/refs.js';
import { cardTemplate } from './js/cardTemplate.js';
import { showInfoMessage } from './js/showInfoMessage.js';
import { clearSearchForm } from './js/clearSearchForm.js';
import { clearImagesContainer } from './js/clearImagesContainer.js';

import InfiniteScroll from 'infinite-scroll';
import debounce from 'lodash.debounce';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const images = new ApiService(searchOptions);
const simpleLightbox = new SimpleLightbox('.gallery a', lightboxOptions);
refs.searchForm.addEventListener('submit', onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  images.resetPageNumber();
  images.searchString = refs.searchForm.elements.searchQuery.value.trim();
  clearImagesContainer(refs);

  if (!images.searchString) {
    showInfoMessage(message.NO_INPUT);
    clearSearchForm();
    return;
  }

  try {
    const imagesSearchResult = await images.fetchImages();

    if (!imagesSearchResult.length) {
      showInfoMessage(message.NO_RESULT);
      clearSearchForm(refs);
      return;
    }

    renderCards(imagesSearchResult);
    showInfoMessage(`Hooray! We found ${images.totalHits} images.`);
    simpleLightbox.refresh();

    const infiniteScroll = new InfiniteScroll(refs.galleryContainer, {
      path: function () {
        return images.searchUrl;
      },
      responseBody: 'json',
      status: '.scroll-status',
      history: false,
    });
    infiniteScroll.on('load', debounce(onScroll, 200));

    if (images.isNoItemsToLoadMore()) {
      showInfoMessage(message.END_OF_SEARCH);
    }
  } catch (error) {
    console.log(error.message);
  }

  clearSearchForm(refs);
}
function createCardsMurkup(data) {
  return data.map(cardTemplate).join('');
}
function renderCards(cards) {
  refs.galleryContainer.insertAdjacentHTML(
    'beforeend',
    createCardsMurkup(cards)
  );
}
async function onScroll() {
  try {
    const imagesSearchResult = await images.fetchImages();
    renderCards(imagesSearchResult);

    if (images.isNoItemsToLoadMore()) {
      showInfoMessage(message.END_OF_SEARCH);
    }

    simpleLightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
}
