import axios from 'axios';

const API_KEY = '39861868-f04abea59eb3e0f6d0b45f8fd';

const fetchImages = async (query, page) => {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default fetchImages;
