import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

let currentPage = 1;
let searchQuestion = '';

btnLoadMore.style.display = 'none';

const fetchImages = async () => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '39861868-f04abea59eb3e0f6d0b45f8fd',
        q: searchQuestion,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40,
      },
    });
    handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

const handleResponse = response => {
  if (response.data.hits.length === 0) {
    handleNoResults();
  } else {
    showResults(response);
  }
};

const handleError = error => {
  console.log('error:', error);
  Notiflix.Notify.failure('Something went wrong. Please try again later.');
};

const handleNoResults = () => {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  btnLoadMore.style.display = 'none';
};

const showResults = response => {
  createImagesGallery(response.data.hits);
  if (currentPage === 1) {
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images.`
    );
  }
  if (response.data.totalHits <= currentPage * 40) {
    btnLoadMore.style.display = 'none';
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    btnLoadMore.style.display = 'block';
  }
};

const createImagesGallery = images => {
  const markup = images
    .map(
      image => `<div class="photo-card">
      <a class="photo-card__link" href="${image.largeImageURL}"><img class="photo-card__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item"><b>Likes</b>${image.likes}</p>
        <p class="info-item"><b>Views</b>${image.views}</p>
        <p class="info-item"><b>Comments</b>${image.comments}</p>
        <p class="info-item"><b>Downloads</b>${image.downloads}</p>
      </div>
    </div>`
    )
    .join('');
  gallery.innerHTML += markup;
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
};

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const searchValue = event.currentTarget.elements.searchQuery.value;

  if (searchValue.trim() === '') {
    Notiflix.Notify.failure('Error. You must enter something.');
    searchQuestion = '';
    return;
  }

  searchQuestion = searchValue;
  gallery.innerHTML = '';
  currentPage = 1;
  fetchImages();
});

btnLoadMore.addEventListener('click', () => {
  console.log('Load More clicked!');
  currentPage++;
  fetchImages();

  const galleryElement = document.querySelector('.gallery');

  if (galleryElement.firstElementChild) {
    const { height: cardHeight } =
      galleryElement.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
});
