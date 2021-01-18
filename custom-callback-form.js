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
        <slot></slot>
        `;

    this._submitBtn = this.querySelector('[type="submit"]');
    this.errorMessage = 'Произошла ошибка. Попробуйте отправить вашу заявку позднее.';

    if (!this.querySelector('form') && this.action) {
      const form = document.createElement('form');
      form.setAttribute('id', 'callbackForm');
      form.setAttribute('action', this.action);
      form.setAttribute('method', this.method);
      /* form.setAttribute('contentType', this._form.getAttribute('enctype') ||
      'application/x-www-form-urlencoded'); */
      while (this.children.length > 0) {
        form.appendChild(this.children[0]);
      }
      this.appendChild(form);
      this._callbackForm = form
    }

    if (!this._submitBtn) {
      this._submitBtn = this.querySelector('button:not([type="button"])');
    }

    if (!this._submitBtn) {
    } else {
      this._display = this._submitBtn.parentNode;
      this._callbackForm.addEventListener('submit', (e) => { this._submitForm(e); })
    }
  }


  /* Свойства */
  get action() { return this.getAttribute('action') }
  get method() { return 'POST' }
  get submitMessage() { return 'Заявка успешно отправлена!' }

  /* Перед отправкой */
  _onPreSubmit(e) {
    if (this._onAir) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    this._onAir = true;
  }

  /* При отправке */
  _onSubmit() {
    this._submitBtn.textContent = this._submitBtn.getAttribute('data-loading-text');
    let ref = this.querySelectorAll('[name]');
    for (let i = 0, len = ref.length; i < len; i++) {
      ref[i].disabled = true;
    }
    this._submitBtn.disabled = true;
  }

  /* При успехе */
  _onSuccess(msg) {
    this._prepareForMessage();
    if (msg !== '') {
      this.submitMessage = msg;
    }
    this._display.textContent = this.submitMessage;
    this._display.classList.add('alert-success');
  }


  /* При ошибке */
  _onError(msg) {
    this._prepareForMessage();
    this._display.textContent = this.errorMessage;
    this._display.classList.add('alert-danger');
  }

  /* Подготовка к сообщению */
  _prepareForMessage() {
    this._onAir = false;
    if (this._submitBtn) {
      this._display.removeChild(this._submitBtn);
    }
    this._display.classList.add('alert');
  }

  /* Вызов сабмита */
  _submitForm(e) {
    e.preventDefault();
    this._onPreSubmit(e);
    this._onSubmit();
    this._validate();
    const json = this._serializeForm();
    this._makeAjaxRequest(json).then((res)=>{
      if(res.status === 200) {
        this._onSuccess(res.statusText);
      }else{
        this._onError();
      }
    });
  }

  //Сериализация формы
  _serializeForm() {
    let elements = this._getSubmittableElements();
    let json = {};
    for (let i = 0; i < elements.length; i++) {
      let values = this._serializeElementValues(elements[i])
      for (let v = 0; v < values.length; v++) {
        this._addSerializedElement(json, elements[i].name, values[v]);
      }
    }
    return json;
  }

  //Валидация
  _validate() {
    console.log('validate');
  }

  /* аjax */
  async _makeAjaxRequest(data) {
    const response = await fetch(this.action, {
      method: this.method,
      body: data
    });

    return await response;
  }

  /* Блок функций для валидации данных формы */

  /* Блок функций для сборки данных формы */
  _getSubmittableElements() {
    return this._callbackForm.querySelectorAll('[name]');
  }

  _serializeElementValues(element) {
    const tag = element.tagName.toLowerCase();

    if (tag === 'button' ||
        (tag === 'input' &&
            (element.type === 'submit' || element.type === 'reset'))) {
      return [];
    }

    if (tag === 'select') {
      return this._serializeSelectValues(element);
    } else if (tag === 'input') {
      return this._serializeInputValues(element);
    } else {
      if (element['_hasIronCheckedElementBehavior'] && !element.checked)
        return [];
      return [element.value];
    }
  }

  _serializeSelectValues(element) {
    let values = [];

    for (let i = 0; i < element.options.length; i++) {
      if (element.options[i].selected) {
        values.push(element.options[i].value)
      }
    }
    return values;
  }

  _serializeInputValues(element) {
    let type = element.type.toLowerCase();
    if (((type === 'checkbox' || type === 'radio') && !element.checked) ||
        type === 'file') {
      return [];
    }
    return [element.value];
  }

  _addSerializedElement(json, name, value) {
    if (json[name] === undefined) {
      json[name] = value;
    } else {
      if (!Array.isArray(json[name])) {
        json[name] = [json[name]];
      }
      json[name].push(value);
    }
  }
}

customElements.define('custom-callback-form', CustomCallbackForm);
