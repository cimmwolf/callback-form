Polymer
  is: 'callback-form'

  properties:
    action: String
    errorMessage:
      type: String
      value: 'Произошла ошибка. Попробуйте отправить вашу заявку позднее.'
    submitBtn: Object
    display: Object

  ready: ->
    @submitBtn = @.querySelector('[type="submit"]')
    if !@submitBtn?
      @submitBtn = @.querySelector('button:not([type="button"])')
    if !@submitBtn?
      console.error("Can't find submit button")
    else
      @display = @submitBtn.parentNode

    @.listen @.$.callbackForm, 'iron-form-submit', 'onSubmit'
    @.listen @.$.callbackForm, 'iron-form-error', 'onError'
    @.listen @.$.callbackForm, 'iron-form-response', 'onResponse'

  onSubmit: ->
    @submitBtn.textContent = @submitBtn.getAttribute('data-loading-text')
    for input in @.querySelectorAll('[name]')
      input.disabled = true
    @submitBtn.disabled = true

  onError: ->
    @prepareForMessage()
    @display.textContent = @errorMessage
    @.toggleClass 'alert-danger', true, @display

  onResponse: ->
    @prepareForMessage()
    @display.textContent = 'Заявка успешно отправлена!'
    @.toggleClass 'alert-success', true, @display

  prepareForMessage: ->
    @display.removeChild @submitBtn
    @.toggleClass 'alert', true, @display