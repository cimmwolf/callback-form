Polymer
  is: 'callback-form'

  properties:
    action: String

  ready: ->
    @.listen @.$.callbackForm, 'iron-form-submit', 'onSubmit'
    @.listen @.$.callbackForm, 'iron-form-error', 'onError'
    @.listen @.$.callbackForm, 'iron-form-response', 'onResponse'

  onSubmit: ->
    btn = @.$.callbackSubmitButton
    btn.textContent = btn.getAttribute('data-loading-text')
    for input in @.querySelectorAll('paper-input, paper-textarea')
      input.disabled = true
    btn.disabled = true

  onError: ->
    @prepareForMessage()
    @.$.callbackFormBottom.textContent = 'Произошла ошибка. Напишите нашему вебмастеру: webmaster@eco74.com.'
    @.toggleClass 'alert-danger', true, @.$.callbackFormBottom

  onResponse: ->
    @prepareForMessage()
    @.$.callbackFormBottom.textContent = 'Заявка успешно отправлена!'
    @.toggleClass 'alert-success', true, @.$.callbackFormBottom

  prepareForMessage: ->
    @.$.callbackSubmitButton.parentNode.removeChild @.$.callbackSubmitButton
    @.toggleClass 'alert', true, @.$.callbackFormBottom