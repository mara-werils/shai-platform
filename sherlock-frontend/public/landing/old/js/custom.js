$(document).ready(function (){
  $('#mainBlock .faqBlock .faqList .item').click(function(){
    $('#mainBlock .faqBlock .faqList .item').removeClass('opened');
    $(this).addClass('opened');
  });
  $('.mobileButtonsList button').click(function(){
    var current_id = $(this).attr('id');
    $('.mobileButtonsList button').removeClass('active');
    $(this).addClass('active');
    $('#mainBlock .priceBlock .block').removeClass('active');
    $('#mainBlock .priceBlock .block.'+current_id).addClass('active');
  });
  $('.tabs button').click(function(){
    var current_id = $(this).attr('id');
    $('.tabs button').removeClass('active');
    $(this).addClass('active');
    $('.tabBody').removeClass('opened');
    $('.tabBody.'+current_id).addClass('opened');
  });

  $("#mainForm").submit(function (e) {
    e.preventDefault();

    const submitBtn = $('#mainForm button[type="submit"]');
    submitBtn.prop('disabled', true);


    const plan    = $('#mainForm input#planName').val();
    const name    = $('#mainForm input#formName').val();
    const company = $('#mainForm input#formCompany').val();
    const phone   = $('#mainForm input#formPhone').val();
    // const email   = $('#mainForm input#formEmail').val();

    if (name && company && phone) {
      $.ajax({
        type: "POST",
        url: "https://blog.shai.pro/api/send-amocrm",
        data: {
          name: name,
          company: company,
          phone: phone,
          plan: plan,
          email: ''
        },
        dataType: "json",
        headers: {
          "Accept": "application/json"
        },
        success: function (response) {
          console.log("Ответ AmoCRM:", response);
          if (response.status === "ok") {
            $('#mainForm input').prop('readonly', true);
            $('#mainForm').hide();
            $('.modalMain>.modalBlock p.label').hide();
            $('.modalMain>.modalBlock .successBlock').show();
          } else {
            console.warn("Ошибка при отправке:", response.data?.detail || response);
            alert("Ошибка при отправке. Попробуйте позже.");
          }
        },
        error: function (xhr, status, error) {
          console.error("AJAX error:", xhr.responseText || status, error);
          alert("Ошибка связи с сервером. Попробуйте позже.");
        },
        complete: function () {
          submitBtn.prop('disabled', false);
        }
      });
    } else {
      submitBtn.prop('disabled', false);
    }
  });

  $('.casesSlick').slick({
    infinite: true,
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots:false,
    arrows: false,
    responsive: [
      {
        breakpoint: 679,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  });
});

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
