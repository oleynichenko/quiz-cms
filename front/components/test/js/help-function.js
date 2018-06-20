export const toggleAbility = (elem, condition) => {
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

export const runIfEventFired = (status, event, callback, ...args) => {
  if (status) {
    callback(args[0], args[1]);
  } else {
    document.addEventListener(event, () => {
      callback(args[0], args[1]);
    });
  }
};

export const initFbBtns = (likeBtn, shareBtn) => {
  if (likeBtn) {
    likeBtn.addEventListener(`click`, () => {
      window.FB.ui({
        method: `share_open_graph`,
        action_type: `og.shares`,
        action_properties: JSON.stringify({
          object: window.location.href,
        })
      });
    });

  }

  if (shareBtn) {
    shareBtn.addEventListener(`click`, () => {
      window.FB.ui({
        method: `share`,
        href: window.location.href
      });
    });
    window.FB.api(
        `/`,
        {
          "id": window.location.href,
          "fields": `engagement`,
          "access_token": `1749739928442230|6c993bd89f7f20c463971b1582ad7cc0`
        },
        function (response) {
          if (response && !response.error) {
            const engagement = response.engagement;

            if (engagement && engagement.share_count > 5) {
              const sharesQuantity = shareBtn.querySelector(`.fb-btn__shares-quantity`);
              sharesQuantity.innerHTML = engagement.share_count;
            }
          }
        }
    );
  }
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

export const scrollToTop = () => {
  window.scrollTo(0, 0);
};
