import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './api';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

let currentPage = 1;
let searchQuestion = '';

btnLoadMore.style.display = 'none';

const handleResponse = data => {
  if (data.hits.length === 0) {
    handleNoResults();
  } else {
    showResults(data);
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
  createImagesGallery(response.hits);
  if (currentPage === 1) {
    Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
  }
  if (response.totalHits <= currentPage * 40) {
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
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </div>`
    )
    .join('');
  gallery.innerHTML += markup;
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
};

searchForm.addEventListener('submit', async event => {
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

  try {
    const response = await fetchImages(searchQuestion, currentPage);
    handleResponse(response);
  } catch (error) {
    handleError(error);
  }
});

btnLoadMore.addEventListener('click', async () => {
  console.log('Load More clicked!');
  currentPage++;

  try {
    const response = await fetchImages(searchQuestion, currentPage);
    handleResponse(response);
  } catch (error) {
    handleError(error);
  }

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
