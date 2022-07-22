export  class NextButton {
  constructor({ selector, hidden = false }) {
    this.refs = this.getRefs(selector);

    hidden && this.hide();
  }

  getRefs(selector) {
    const refs = {};
    refs.button = document.querySelector(selector);
    return refs;
  }

  enable() {
    this.refs.button.disabled = false;
    this.visible();
    this.refs.button.textContent = 'Load more';
  }

  disable() {
    this.refs.button.disabled = true;
    this.refs.button.textContent = 'Loading...';
  }

  visible() {
    this.refs.button.classList.remove('hidden');
  }

  hide() {
    this.refs.button.classList.add('hidden');
  }
}
