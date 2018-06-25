const addSmoothOpacity = (elem, hideClass) => {
  const REVERSE = `smooth-elem--animate-reverse`;
  const ANIMATE = `smooth-elem--animate`;

  elem.smoothOpacityOn = () => {
    if (elem.classList.contains(hideClass)) {
      elem.classList.remove(hideClass);
      elem.classList.add(ANIMATE);
    }
  };

  elem.smoothOpacityOff = () => {
    if (!elem.classList.contains(hideClass)) {
      elem.classList.add(REVERSE);
    }
  };

  elem.addEventListener(`animationend`, () => {
    elem.classList.remove(ANIMATE);

    if (elem.classList.contains(REVERSE)) {
      elem.classList.add(hideClass);
      elem.classList.remove(REVERSE);
    }
  });
};

export default addSmoothOpacity;
