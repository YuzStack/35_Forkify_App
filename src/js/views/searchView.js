class SearchView {
  _parentEl = document.querySelector('.search'); // form element
  _inputEl = this._parentEl.querySelector('.search__field');

  getQuery() {
    const query = this._inputEl.value;
    this._clearInput();
    this._inputEl.blur();
    return query;
  }

  _clearInput() {
    this._inputEl.value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
