import axios from 'axios';
import { BASE_URL, PIXABAY_API_KEY } from './options.js';

export class ApiService {
  constructor(searchOptions = {}) {
    this.searchingImages = '';
    this.searchOptions = searchOptions;
    this.page = 1;
    this.totalHits = 0;
    this.imgPerPage = searchOptions.per_page;
    this.leftImages = 0;
    this.searchURL = '';
  }

  get searchUrl() {
    return this.searchURL;
  }
  set searchUrl(url) {
    this.searchURL = url;
  }

  async fetchImages() {
    const searchOptions = new URLSearchParams(this.searchOptions);
    const searchURL = `${BASE_URL}?key=${PIXABAY_API_KEY}&q=${this.searchingImages}&${searchOptions}&page=${this.page}`;
    this.searchUrl = searchURL;

    const request = await axios.get(searchURL);

    if (request.status !== 200) {
      console.log('Ups! Error!');
      return;
    }

    const images = request.data.hits;

    this.getTotalHits(request);
    this.leftImages = this.countLeftImiges();
    this.incrememntPage();

    return images;
  }

  get searchString() {
    return this.searchingImages;
  }
  set searchString(query) {
    this.searchingImages = query;
  }

  get photosPerPage() {
    return this.searchOptions.per_page;
  }
  set photosPerPage(numberOfPhoto) {
    this.searchOptions.per_page = numberOfPhoto;
  }

  incrememntPage() {
    this.page += 1;
  }

  resetPageNumber() {
    this.page = 1;
  }

  getTotalHits(response) {
    this.totalHits = response.data.totalHits;
  }

  countLeftImiges() {
    const imgLeft = this.totalHits - this.page * this.imgPerPage;

    return imgLeft < 0 ? 0 : imgLeft;
  }

  isNoItemsToLoadMore() {
    return !this.leftImages;
  }
}
