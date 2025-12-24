$(document).on('submit', '#industriesForm', function (e) {
  e.preventDefault();
  const $form = $(this);
  const $fields = $form.find('input[required], select[required]');

  let isValid = true;

  $fields.each(function () {
    const $field = $(this);
    if ($field.val().trim() === '') {
      alert('error');
      $field.addClass('error');
      isValid = false;
    }
  });

  if (!isValid) return;

  const data = {
    'entry.553943592': $form.find('#industries_name').val(),
    'entry.1407909850': $form.find('#industries_company').val(),
    'entry.1907295195': $form.find('#industries_phone').val(),
    'entry.971704265': $form.find('#industries_city').val(),
    'entry.2146570127': $form.find('#industries_industry').val(),
    'entry.1004580387': $form.find('#industries_help').val(),
  };

  $.ajax({
    type: 'POST',
    url: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScVYcfw2-aj7Awf15uUeXDnC6kpyWqP4d48tfV3xD4UsgLKSQ/formResponse',
    data: data,
    dataType: 'jsonp',
    crossDomain: true,
    success: industriesSuccess,
    error: industriesSuccess,
  });
});

function industriesSuccess() {
  $('.industriesMainForm .row').remove();
  $('.industriesSuccessBlock').show();
}

$(document).on('input change', '#industriesForm input[required], #industriesForm select[required]', function () {
  if ($(this).val().trim() !== '') {
    $(this).removeClass('error');
  }
});
