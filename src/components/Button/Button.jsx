import css from './Button.module.css';

export const Button = ({ handleLoadMore }) => {
  const handleLoadMoreBtn = () => {
    handleLoadMore();
  };

  return (
    <div className={css.btnContainer}>
      <button className={css.button} onClick={handleLoadMoreBtn}>
        Load More
      </button>
    </div>
  );
};
