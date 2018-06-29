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
    callback(args[0], args[1], args[2]);
  } else {
    document.addEventListener(event, () => {
      callback(args[0], args[1], args[2]);
    });
  }
};

export const initFbBtns = (likeBtn, shareBtn, block) => {
  if (likeBtn) {
    likeBtn.addEventListener(`click`, () => {

      window.gtag(`event`, `clickToPostFb`, {
        'event_category': `social`,
        'event_label' : `like${block}`
      });

      window.FB.ui({
        method: `share_open_graph`,
        action_type: `og.shares`,
        action_properties: JSON.stringify({
          object: window.location.href
        })
      }, function (response) {
        if (response) {
          window.gtag(`event`, `post`, {
            'event_category': `social`,
            'event_label' : `FbLike${block}`
          });
        }
      });
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener(`click`, () => {
      window.FB.ui({
        method: `share`,
        href: window.location.href
      }, function (response) {
        if (response) {
          window.gtag(`event`, `post`, {
            'event_category': `social`,
            'event_label' : `FbShare${block}`
          });
        }
      });

      window.gtag(`event`, `clickToPostFb`, {
        'event_category': `social`,
        'event_label' : `share${block}`
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
  setTimeout(() => {
    document.body.classList.add(`body__visible`);
  }, 600);
};

export const scrollToTop = () => {
  window.scrollTo(0, 0);
};
