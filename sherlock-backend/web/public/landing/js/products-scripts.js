const title   = document.querySelector('.agentsTitle');
const tabs    = document.querySelector('.tabs');
const third   = document.querySelector('.container-fluid.thirdBlock');
const buttons = tabs.querySelectorAll('button');

function updatePositions() {
  tabs.start = tabs.getBoundingClientRect().top + window.scrollY;
  tabs.stop  = third.getBoundingClientRect().top + window.scrollY + 100;
}
updatePositions();
window.addEventListener('resize', updatePositions);

function setActiveButton(index) {
  buttons.forEach(btn => btn.classList.remove('active'));
  if (buttons[index]) buttons[index].classList.add('active');
}

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  if (y >= tabs.start && y < tabs.stop) {
    title.classList.add('withMargin');
    tabs.classList.add('fixed');
    setActiveButton(1);
  } else if (y >= tabs.stop) {
    title.classList.remove('withMargin');
    tabs.classList.remove('fixed');
    setActiveButton(1);
  } else {
    title.classList.remove('withMargin');
    tabs.classList.remove('fixed');
    setActiveButton(0);
  }
});
