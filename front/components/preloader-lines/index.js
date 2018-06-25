function addSmoothOpacity(elem) {
  const HIDE = `smooth-elem--hidden`;
  const REVERSE = `smooth-elem--animate-reverse`;
  const ANIMATE = `smooth-elem--animate`;

  elem.classList.add(HIDE);

  elem.smoothOpacityOn = () => {
    if (elem.classList.contains(HIDE)) {
      elem.classList.remove(HIDE);
      elem.classList.add(ANIMATE);
    }
  };

  elem.smoothOpacityOff = () => {
    if (!elem.classList.contains(HIDE)) {
      elem.classList.add(REVERSE);
    }
  };

  elem.addEventListener(`animationend`, () => {
    if (elem.classList.contains(REVERSE)) {
      elem.classList.add(HIDE);
      elem.classList.remove(REVERSE);
    } else {
      elem.classList.remove(ANIMATE);
    }
  });
}

const preloader = document.querySelector(`.preloader`);
addSmoothOpacity(preloader);
