import View from './View';
import icons from 'url:../../img/icons.svg'; //parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupBtn('next', curPage);
    }

    //last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupBtn('prev', curPage);
    }
    //other page
    if (curPage < numPages) {
      return `${this._generateMarkupBtn('prev', curPage)},
        ${this._generateMarkupBtn('next', curPage)}
      `;
    }
    // page 1 and there are NO other pages
    return '';
  }
  _generateMarkupBtn(btn, currentPage) {
    return `
    <button data-goto="${
      btn === 'next' ? currentPage + 1 : currentPage - 1
    }" class="btn--inline pagination__btn--${btn}">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-${
      btn === 'next' ? 'right' : 'left'
    }"></use>
    </svg>
    <span>Page ${btn === 'next' ? currentPage + 1 : currentPage - 1}</span>
    </button>
    `;
  }
}

export default new PaginationView();
