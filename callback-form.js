import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@vistro/iron-form/iron-form.js';

/**
 * `callback-form`
 * Callback form for sites
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class CallbackForm extends PolymerElement {
  static get template() {
    return html`<style>
    :host { display: block; }
</style>
<iron-form id="callbackForm"
           on-iron-form-submit="_onSubmit"
           on-iron-form-presubmit="_onPreSubmit"
           on-iron-form-error="_onError"
           on-iron-form-response="_onResponse"
           on-keydown="_checkForEnter">
        <slot></slot>
</iron-form>
    `;
  }

  static get is() {
    return 'callback-form'
  }

  static get properties() {
    return {
      action: String,
      method: {type: String, value: 'POST'},
      errorMessage: {
        type: String,
        value: 'Произошла ошибка. Попробуйте отправить вашу заявку позднее.'
      },
      submitMessage: {
        type: String,
        value: 'Заявка успешно отправлена!'
      },
      _submitBtn: Object,
      _display: Object,
      _formData: Object,
      _onAir: Boolean
    }
  }

  ready() {
    super.ready();
    this._submitBtn = this.shadowRoot.querySelector('[type="submit"]');

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
      console.error("Can't find submit button");
    } else {
      this._submitBtn.addEventListener('click', () => this.submit());
      this._display = this._submitBtn.parentNode;
    }
  }

  _onSubmit() {
    this._formData = this.$.callbackForm.serializeForm();
    this._submitBtn.textContent = this._submitBtn.getAttribute('data-loading-text');
    let ref = this.querySelectorAll('[name]');
    for (let i = 0, len = ref.length; i < len; i++) {
      ref[i].disabled = true;
    }
    this._submitBtn.disabled = true;
  }

  _onPreSubmit(e) {
    if (this._onAir) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    this._onAir = true;
  }

  _onError() {
    this._prepareForMessage();
    this._display.textContent = this.errorMessage;
    this._display.classList.add('alert-danger');
    this.dispatchEvent(new CustomEvent('callback-form-sending-error', {detail: {formData: this._formData}}));
  }

  _onResponse(e) {
    this._prepareForMessage();
    if (e.detail.response && e.detail.response.message) {
      this.submitMessage = e.detail.response.message;
    }
    this._display.textContent = this.submitMessage;
    this._display.classList.add('alert-success');
    this.dispatchEvent(new CustomEvent('callback-form-sending-success', {detail: {formData: this._formData}}));
  }

  _prepareForMessage() {
    this._onAir = false;
    this._display.removeChild(this._submitBtn);
    this._display.classList.add('alert');
  }

  submit() {
    this.$.callbackForm.submit();
  }

  _checkForEnter(e) {
    if (e.keyCode === 13) {
      this.submit();
    }
  }
}

window.customElements.define('callback-form', CallbackForm);
