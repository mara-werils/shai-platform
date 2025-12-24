$(document).ready(function (){
  $('.homeSlick').slick({
    infinite: true,
    autoplay: false,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    speed: 1000,
  });

  let isAutomaticSwitch = true;
  let autoSwitchTimeout;

  $('#lines .line').eq(0).addClass('filled');

  function startAutoSwitch() {
    autoSwitchTimeout = setTimeout(() => {
      $('.homeSlick').slick('slickNext');
    }, 9000);
  }

  function stopAutoSwitch() {
    clearTimeout(autoSwitchTimeout);
  }

  startAutoSwitch();

  $('.homeSlick').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
    $('#lines .line').removeClass('filled');
    $('#lines .line').eq(nextSlide).addClass('filled');
    isAutomaticSwitch = false;
    stopAutoSwitch();
  });

  $('.homeSlick').on('afterChange', function(event, slick, currentSlide) {
    isAutomaticSwitch = true;
    startAutoSwitch();
  });

  $('.homeSlick').on('click', function() {
    stopAutoSwitch();
    startAutoSwitch();
  });
});


$('.faqList .item').click(function(){
  $('.faqList .item').removeClass('opened');
  $(this).addClass('opened');
});

// posts auto scroll - start
$(document).ready(function (){
  const $container = $('#postsScroll');
  const scrollSpeed = 12;
  let scrollInterval;
  let isScrolling = false;

  function startScroll(direction) {
    if (isScrolling) return;
    isScrolling = true;

    scrollInterval = setInterval(function() {
      $container.scrollLeft($container.scrollLeft() + (direction === 'left' ? -scrollSpeed : scrollSpeed));
    }, 10);
  }

  function stopScroll() {
    clearInterval(scrollInterval);
    isScrolling = false;
  }

  $container.hover(
    function(e) {
      const width = $container.outerWidth();
      const mouseX = e.pageX - $container.offset().left;

      if (mouseX < width * 0.20) {
        startScroll('left');
      } else if (mouseX > width * 0.80) {
        startScroll('right');
      }
    },
    function() {
      stopScroll();
    }
  );

  $container.on('mousemove', function(e) {
    const width = $container.outerWidth();
    const mouseX = e.pageX - $container.offset().left;

    if (mouseX < width * 0.20) {
      startScroll('left');
    } else if (mouseX > width * 0.80) {
      startScroll('right');
    } else {
      stopScroll();
    }
  });
});
// posts auto scroll - end

// posts - start
$(document).ready(function (){
  function truncate(str, maxLength) {
    return str.length > maxLength ? str.slice(0, maxLength).trim() + '...' : str;
  }

  const isEnglish = window.location.pathname.includes('/en');

  fetch('https://blog.shai.pro/api/latest-news')
    .then(response => response.json())
    .then(data => {
      if (data.success && data.data.length > 0) {
        const newsList = document.getElementById("postsScroll");
        let html = '';

        data.data.forEach(item => {
          const current_url = item.source ? item.source : `https://blog.shai.pro/post/${item.id}`;
          const current_title = truncate(item.title, 65);
          const current_descr = truncate(item.descr, 90);

          html += `
                       <div class="block">
                          <div class="headBlock">
                              <p class="title bWeight">${current_title}</p>
                              <div class="image"><img src="https://blog.shai.pro/storage/${item.image}" alt=""></div>
                          </div>
                          <p class="text">${current_descr}</p>
                          <a href="${current_url}" class="link">
                              ${isEnglish ? 'Read more' : 'Подробнее'}
                              <span class="iconify plus" data-icon="si:arrow-right-line" data-inline="false"></span>
                          </a>
                      </div>
                    `;
        });

        newsList.innerHTML = html;
        document.getElementById("main-news-block").style.display = "block";
      }
    })
    .catch(error => {
      console.error("Ошибка загрузки новостей:", error);
    });
});
// posts - end
