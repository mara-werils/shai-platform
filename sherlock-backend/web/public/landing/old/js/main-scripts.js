function slowScroll(block){
  $('body').removeClass('burgerActive');
  $('html, body').animate ({
    scrollTop: $(block).offset ().top - 60
  }, 800);
  return false;
}
$(window).on('scroll', function () {
  const image = $('#mainBlock .firstBlock .container .mainImage');
  const imageTop = image.offset().top;
  const scrollTop = $(window).scrollTop();
  const windowHeight = $(window).height();

  const distanceToImage = imageTop - scrollTop;
  const maxScrollDistance = windowHeight;
  let visibleRatio = 1 - Math.max(0, Math.min(1, distanceToImage / maxScrollDistance));

  const newWidth = 80 + visibleRatio * 10;
  image.css('width', newWidth + '%');
});
