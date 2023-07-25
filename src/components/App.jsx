import { useState, useEffect } from 'react';
import css from './App.module.css';
import Notiflix from 'notiflix';

import { Loader } from './Loader/Loader';
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';

const secretKey = '35496971-fbfc726ccc8da9a7b0725eb09';

export const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [SelectedPicture, setSelectedPicture] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      const img = await getImages('', 1);
      setImages(img);
    }
    fetchData();

    document.addEventListener('keydown', e => {
      if (e.code === 'Escape') {
        setSelectedPicture('');
      }
    });

    return () => {
      document.removeEventListener('keydown', e => {
        if (e.code === 'Escape') {
          setSelectedPicture('');
        }
      });
    };
  }, []);

  const getImages = async (query, page) => {
    setIsLoading(true);

    const response = await fetch(
      `https://pixabay.com/api/?q=${query}&page=${page}&key=${secretKey}&image_type=photo&orientation=horizontal&per_page=12`
    );
    if (!response.ok) {
      if (response.status === 404) {
        Notiflix.Notify.failure('Oops, there is no pictures with that name');
      }
      throw new Error(response.status);
    }
    const result = await response.json();
    if (result.total === 0) {
      Notiflix.Notify.failure('Oops, there is no pictures with that name');
    }
    setIsLoading(false);
    return result.hits;
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formQuery = form.elements.query.value;

    if (formQuery !== '') {
      const img = await getImages(formQuery, 1);
      setImages(img);
      setQuery(formQuery);
    } else {
      Notiflix.Notify.failure('Oops, there are no pictures with that name');
    }
  }

  function handleModal(URL) {
    setSelectedPicture(URL);
  }

  function hideModal() {
    setSelectedPicture('');
  }

  async function handleLoadMore() {
    setCurrentPage(currentPage + 1);

    const img = await getImages(query, currentPage);

    const prevImages = images;

    setImages([]);
    setImages([...prevImages, ...img]);
  }

  return (
    <div className={css.App}>
      <Searchbar submit={handleSubmit} />
      {images.length > 0 ? (
        <ImageGallery images={images} onClick={handleModal} />
      ) : (
        ''
      )}
      {isLoading ? <Loader /> : ''}
      {images.length > 0 ? <Button handleLoadMore={handleLoadMore} /> : ''}
      {SelectedPicture !== '' ? (
        <Modal largeImageURL={SelectedPicture} hideModal={hideModal} />
      ) : (
        ''
      )}
    </div>
  );
};
