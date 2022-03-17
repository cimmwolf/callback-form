class CallbackForm extends HTMLElement {

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes () {
    return ['errorMessage', 'submitMessage']
  }

  // noinspection JSUnusedGlobalSymbols
  connectedCallback () {
    const { shadowRoot } = this

    shadowRoot.innerHTML = `
        <style>
            :host { display: block; }
        </style>
        <slot></slot>
        `

    this._submitBtn = this.querySelector('[type="submit"]')

    if (!this.querySelector('form') && this.action) {
      const form = document.createElement('form')
      form.setAttribute('id', 'callbackForm')
      form.setAttribute('action', this.action)
      form.setAttribute('method', this.method)
      while (this.children.length > 0) {
        form.appendChild(this.children[0])
      }
      this.appendChild(form)
      this._callbackForm = form
    }

    if (!this._submitBtn) {
      this._submitBtn = this.querySelector('button:not([type="button"])')
    }

    if (!this._submitBtn) {
      console.error('Can\'t find submit button')
    } else {
      this._display = this._submitBtn.parentNode
      this._callbackForm.addEventListener('submit', (e) => { this._submitForm(e) })
    }
  }

  get action () { return this.getAttribute('action') }

  get method () {
    let method = 'POST'
    if (this.hasAttribute('method')) {
      method = this.getAttribute('method')
    }
    return method
  }

  get submitMessage () {
    let message = 'Заявка успешно отправлена!'
    if (this.hasAttribute('submit-message')) {
      message = this.getAttribute('submit-message')
    }
    return message
  }

  get errorMessage () {
    let message = 'Произошла ошибка. Попробуйте отправить вашу заявку позднее.'
    if (this.hasAttribute('error-message')) {
      message = this.getAttribute('error-message')
    }
    return message
  }

  /* При отправке */
  _onSubmit () {
    this._submitBtn.textContent = this._submitBtn.getAttribute('data-loading-text')
    let ref = this.querySelectorAll('[name]')
    for (let i = 0, len = ref.length; i < len; i++) {
      ref[i].disabled = true
    }
    this._submitBtn.disabled = true
  }

  /* При успехе */
  _onSuccess (response) {
    this._prepareForMessage()
    this._display.textContent = this.submitMessage
    this._display.classList.add('alert-success')

    response.json().then(data => {
      this._display.textContent = data.message ? data.message : this.submitMessage
    }).catch(() => {
      this._display.textContent = this.submitMessage
    })
    this.dispatchEvent(new CustomEvent('callback-form-sending-success', { detail: { formData: this._formData } }))
  }

  /* При ошибке */
  _onError () {
    this._prepareForMessage()
    this._display.textContent = this.errorMessage
    this._display.classList.add('alert-danger')
    this.dispatchEvent(new CustomEvent('callback-form-sending-error', { detail: { formData: this._formData } }))
  }

  /* Подготовка к сообщению */
  _prepareForMessage () {
    this._onAir = false
    if (this._submitBtn) {
      this._display.removeChild(this._submitBtn)
    }
    this._display.classList.add('alert')
  }

  /* Вызов сабмита */
  _submitForm (e) {
    e.preventDefault()
    if (!this._callbackForm) {
      return false
    }

    if (this._onAir) {
      e.stopPropagation()
      e.preventDefault()
      return false
    }
    this._onAir = true
    this._formData = new FormData(e.target)

    this._onSubmit()

    fetch(this.action, {
      method: this.method,
      body: new URLSearchParams(this._formData)
    }).then((response) => {
      if (response.status !== 200) {
        return this._onError()
      }
      this._onSuccess(response)
    })
  }
}

customElements.define('callback-form', CallbackForm)
