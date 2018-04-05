export const toggleAccessibility = (elem, condition) => {
  elem.disabled = condition ? false : true;
};

export const toggleVisibility = (elem, condition) => {
  elem.style.display = condition ? `block` : `none`;
};

const _checkIfClassInArr = (arr, className) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].classList.contains(className)) {
      return true;
    }
  }

  return false;
};

export const checkIfClassInMap = (map, className) => {

  for (let arr of map.values()) {
    if (!_checkIfClassInArr(arr, className)) {
      return false;
    }
  }

  return true;
};

export const showPage = () => {
  document.body.classList.remove(`body__unvisible`);
};
