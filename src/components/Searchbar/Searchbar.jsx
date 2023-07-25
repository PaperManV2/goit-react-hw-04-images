import css from './Searchbar.module.css';

export const Searchbar = ({ submit }) => {
  return (
    <header className={css.searchbar}>
      <form className={css.form} onSubmit={submit}>
        <button type="submit" className={css.button} name="btn">
          <span className={css.buttonLabel}>Search</span>
        </button>

        <input
          className={css.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          name="query"
        />
      </form>
    </header>
  );
};

export default Searchbar;
