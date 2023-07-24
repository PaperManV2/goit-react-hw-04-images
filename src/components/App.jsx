import { Component } from 'react';
import css from './App.module.css';
import Notiflix from 'notiflix';

import { Loader } from './Loader/Loader';
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';

const secretKey = '35496971-fbfc726ccc8da9a7b0725eb09';

export class App extends Component {
  constructor(Props) {
    super(Props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  state = {
    images: [],
    isLoading: false,
    error: '',
    currentPage: 1,
    SelectedPicture: '',
    query: '',
  };

  async componentDidMount() {
    const images = await this.getImages('', 1);
    this.setState({ images });

    document.addEventListener('keydown', e => {
      if (e.code === 'Escape') {
        this.setState({ SelectedPicture: '' });
      }
    });
  }

  async componentDidUpdate() {}

  getImages = async (query, page) => {
    this.setState({ isLoading: true });

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
    this.setState({ isLoading: false });
    return result.hits;
  };

  handleSubmit = async event => {
    event.preventDefault();

    const form = event.currentTarget;
    const formQuery = form.elements.query.value;

    if (formQuery !== '') {
      const images = await this.getImages(formQuery, 1);
      this.setState({ images, query: formQuery });
    } else {
      Notiflix.Notify.failure('Oops, there are no pictures with that name');
    }
  };

  handleModal(URL) {
    this.setState({ SelectedPicture: URL });
  }

  hideModal() {
    this.setState({ SelectedPicture: '' });
  }

  handleLoadMore() {
    this.setState(
      prevState => ({ currentPage: prevState.currentPage + 1 }),
      async () => {
        const images = await this.getImages(
          this.state.query,
          this.state.currentPage
        );

        const prevImages = this.state.images;

        this.setState({ images: [] });
        this.setState({ images: [...prevImages, ...images] });
      }
    );
  }

  render() {
    const { images, isLoading, SelectedPicture } = this.state;

    return (
      <div className={css.App}>
        {' '}
        <Searchbar submit={this.handleSubmit} />
        {images.length > 0 ? (
          <ImageGallery images={images} onClick={this.handleModal} />
        ) : (
          ''
        )}
        {isLoading ? <Loader /> : ''}
        {images.length > 0 ? (
          <Button handleLoadMore={this.handleLoadMore} />
        ) : (
          ''
        )}
        {SelectedPicture !== '' ? (
          <Modal largeImageURL={SelectedPicture} hideModal={this.hideModal} />
        ) : (
          ''
        )}
      </div>
    );
  }
}
