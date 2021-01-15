import '@vistro/iron-form/iron-form.js';

class CustomCallbackForm extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const { shadowRoot } = this;

    shadowRoot.innerHTML = `
        <style>
            :host { display: block; }
        </style>
        <form id="form-helper">
        </form>

        <!-- <iron-form id="callbackForm"
           on-iron-form-submit="_onSubmit"
           on-iron-form-presubmit="_onPreSubmit"
           on-iron-form-error="_onError"
           on-iron-form-response="_onResponse"
           on-keydown="_checkForEnter">
            <slot></slot>
        </iron-form> -->
        `;

    this._submitBtn = this.querySelector('[type="submit"]');

    if (!this.querySelector('form') && this.action) {
      const form = document.createElement('form');
      form.setAttribute('action', this.action);
      form.setAttribute('method', this.method);
      while (this.children.length > 0) {
        form.appendChild(this.children[0]);
      }
      this.appendChild(form);
    }

    if (!this._submitBtn) {
      this._submitBtn = this.querySelector('button:not([type="button"])');
    }

    if (!this._submitBtn) {
    } else {
      this._display = this._submitBtn.parentNode;
      this._submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.submit();
      });
    }
  }


  /* properies */
  get action() { return this.getAttribute('action') }
  get method() { return 'POST' }
  get errorMessage() { return 'Произошла ошибка. Попробуйте отправить вашу заявку позднее.' }
  get submitMessage() { return 'Заявка успешно отправлена!' }


  /* вызов сабмита */
  _onSubmit() {
    console.log("onSubmit");
    this._formData = this.$.callbackForm.serializeForm();
    this._submitBtn.textContent = this._submitBtn.getAttribute('data-loading-text');
    let ref = this.querySelectorAll('[name]');
    for (let i = 0, len = ref.length; i < len; i++) {
      ref[i].disabled = true;
    }
    this._submitBtn.disabled = true;
  }


  /* вызов сабмита */
  _onPreSubmit(e) {
    console.log("onPreSubmit");
    if (this._onAir) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    this._onAir = true;
  }


  /* вызов сабмита */
  _onResponse(e) {
    console.log("onResponse");
    this._prepareForMessage();
    if (e.detail.response && e.detail.response.message) {
      this.submitMessage = e.detail.response.message;
    }
    this._display.textContent = this.submitMessage;
    this._display.classList.add('alert-success');
    this.dispatchEvent(new CustomEvent('callback-form-sending-success', { detail: { formData: this._formData } }));
  }


  /* вызов сабмита */
  _onError() {
    console.log("onError");
    this._prepareForMessage();
    this._display.textContent = this.errorMessage;
    this._display.classList.add('alert-danger');
    this.dispatchEvent(new CustomEvent('callback-form-sending-error', { detail: { formData: this._formData } }));
  }

  _prepareForMessage() {
    console.log("prepareForMessage");
    this._onAir = false;
    if (this._submitBtn) {
      this._display.removeChild(this._submitBtn);
    }
    this._display.classList.add('alert');
  }

  _checkForEnter(e) {
    if (e.keyCode === 13) {
      this.submit();
    }
  }

  /* вызов сабмита */
  submit() {
    /* В ДАЛЬНЕЙШЕМ - ПОД СНОС */
    const irF = this.shadowRoot.querySelector('iron-form')
    console.log("submit", irF);
    irF.submit();
    /* В ДАЛЬНЕЙШЕМ - ПОД СНОС */
  }

  /* &&&&&&&&&&&&&&&&&&&&&&&properies */
  get properties() {
    return {
      action: String,
      _submitBtn: Object,
      _display: Object,
      _formData: Object,
      _onAir: Boolean
    };
  }
}

customElements.define('custom-callback-form', CustomCallbackForm);
