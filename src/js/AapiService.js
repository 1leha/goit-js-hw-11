const BASE_URL = 'https://pixabay.com/api/';
const PIXABAY_API_KEY = '28093475-fe65f3a9b90a4bdd7046cfe0a';

export default class ApiService {
  constructor(searchOptions = {}) {
    this.searchingImages = '';
    this.searchOptions = searchOptions;
    this.page = 1;
    this.totalHits = 0;
    this.imgPerPage = searchOptions.per_page;
    this.leftImages = 0;
  }

  fetchImages() {
    const searchOptions = new URLSearchParams(this.searchOptions);

    return fetch(
      `${BASE_URL}?key=${PIXABAY_API_KEY}&q=${this.searchingImages}&${searchOptions}&page=${this.page}`
    )
      .then(request => {
        if (request.ok) {
          return request.json();
        }
      })
      .then(data => {
        this.getTotalHits(data);
        this.leftImages = this.countLeftImiges();
        this.incrememntPage();
        return data;
      });
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

  resetPage() {
    this.page = 1;
  }

  getTotalHits(response) {
    this.totalHits = response.totalHits;
  }

  countLeftImiges() {
    const imgLeft = this.totalHits - this.page * this.imgPerPage;

    return imgLeft < 0 ? 0 : imgLeft;
  }

  isNoItemsToLoadMore() {
    return (
      !this.totalHits || this.totalHits < this.imgPerPage || !this.leftImages
    );
  }
}
