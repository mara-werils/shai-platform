function slowScroll(block){
  $('body').removeClass('burgerActive');
  $('html, body').animate ({
    scrollTop: $(block).offset ().top - 60
  }, 800);
  return false;
}

// partners animation - start
$(document).ready(function (){
  const partnersList = document.getElementById('partnersList');
  partnersList.innerHTML += partnersList.innerHTML;

  const partnersScrollSpeed = 1;
  let partnersScrollInterval = null;
  let restartTimeout = null;

  function infiniteScroll() {
    if (partnersList.scrollLeft >= partnersList.scrollWidth / 2) {
      partnersList.scrollLeft = 0;
    } else {
      partnersList.scrollLeft += partnersScrollSpeed;
    }
  }

  function startScrolling() {
    partnersScrollInterval = setInterval(infiniteScroll, 16);
  }

  function stopScrolling() {
    clearInterval(partnersScrollInterval);
  }

  function handleMouseOver() {
    stopScrolling();
    clearTimeout(restartTimeout);
  }

  function handleMouseOut() {
    restartTimeout = setTimeout(startScrolling, 300);
  }

  partnersList.addEventListener('mouseover', handleMouseOver);
  partnersList.addEventListener('mouseout', handleMouseOut);

  partnersList.addEventListener('touchstart', handleMouseOver);
  partnersList.addEventListener('touchend', handleMouseOut);

  startScrolling();
});
// partners animation - end



function showFormModal(){
  $('#formModal').fadeIn();
  $('body').addClass('modalOpened');
}
function hideFormModal(){
  $('#formModal').fadeOut();
  $('body').removeClass('modalOpened');
}

$(document).on('change', '#agree', function () {
  $('#submitBtn').prop('disabled', !this.checked);
});

$(document).on('submit', '#modalForm', function (e) {
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
    'entry.553943592': $form.find('#name').val(),
    'entry.1407909850': $form.find('#company').val(),
    'entry.1907295195': $form.find('#phone').val(),
    'entry.971704265': $form.find('#city').val(),
    'entry.2146570127': $form.find('#industry').val(),
    'entry.212334338': $form.find('#product').val(),
  };

  $.ajax({
    type: 'POST',
    url: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScVYcfw2-aj7Awf15uUeXDnC6kpyWqP4d48tfV3xD4UsgLKSQ/formResponse',
    data: data,
    dataType: 'jsonp',
    crossDomain: true,
    success: showSuccess,
    error: showSuccess,
  });
});

function showSuccess() {
  $('#formModal .formBlock').hide();
  $('#formModal .successBlock').show();
  setTimeout(function () {
    $('#formModal').fadeOut();
    $('body').removeClass('modalOpened');
  }, 2000);
}

$(document).on('input change', '#modalForm input[required], #modalForm select[required]', function () {
  if ($(this).val().trim() !== '') {
    $(this).removeClass('error');
  }
});
