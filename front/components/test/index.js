(function () {
'use strict';

const Class = Object.freeze({
  HEADER: `js-header`,
  TEST: `js-test`,
  TEST_TAG: `js-test__tag`,
  TEST_TITLE: `js-test__title`,
  TEST_LEAD_TEXT: `js-test__lead-text`,
  TEST_IS_CHECKED: `test--is-checked`,
  TEST_QUESTIONS: `js-test__questions`,
  TEST_SOCIAL: `js-test__social`,
  SUMMARY_SHARE_FB: `js-summary__share-btn--fb`,
  // SUMMARY_SHARE_FB2: `js-summary__share-btn--fb2`,
  SUMMARY_SHARE_VK: `js-summary__share-btn--vk`,
  SUMMARY_SHARE_TW: `js-summary__share-btn--tw`,
  TEST_SOCIAL_VISIBLE: `test__social--visible`,
  TEST_QUESTIONS_DONE: `test__questions--done`,
  RESULT_BTN: `js-test__result-btn`,
  RESULT_BTN_VISIBLE: `test__result-btn--visible`,
  RETAKE_BLOCK: `js-test__retake-block`,
  RETAKE_BLOCK_VISIBLE: `test__retake-block--visible`,
  RETAKE_BTN: `js-test__retake-btn`,
  RETAKE_MESSAGE: `js-test__retake-message`,
  QUESTION: `js-question`,
  QUESTION_OPTIONS: `js-question__options`,
  QUESTION_OPTION: `js-question__option`,
  QUESTION_OPTION_IS_CHECKED: `question__option--is-checked`,
  QUESTION_WRONG: `question--wrong`,
  TEST_SHARE_FB: `js-test__share-fb`,
  TEST_LIKE_FB: `js-test__like-fb`,
  TEST_DISQUS_VISIBLE: `test__disqus--visible`,
  TEST_DISQUS: `js-test__disqus`
});

const getQuestionsAndOptions = () => {
  const questions = document.querySelectorAll(`.${Class.QUESTION}`);
  let map = new Map();

  [].forEach.call(questions, function (elem) {
    map.set(elem, Array.from(elem.querySelectorAll(`.${Class.QUESTION_OPTION}`)));
  });

  return map;
};

const dom = {
  test: document.querySelector(`.${Class.TEST}`),
  header: document.querySelector(`.${Class.HEADER}`),
  testTag: document.querySelector(`.${Class.TEST_TAG}`),
  testTitle: document.querySelector(`.${Class.TEST_TITLE}`),
  testLeadText: document.querySelector(`.${Class.TEST_LEAD_TEXT}`),
  testQuestions: document.querySelector(`.${Class.TEST_QUESTIONS}`),
  testSocial: document.querySelector(`.${Class.TEST_SOCIAL}`),
  questionsAndOptions: getQuestionsAndOptions(),
  resultBtn: document.querySelector(`.${Class.RESULT_BTN}`),
  retakeBtn: document.querySelector(`.${Class.RETAKE_BTN}`),
  retakeBlock: document.querySelector(`.${Class.RETAKE_BLOCK}`),
  retakeMessage: document.querySelector(`.${Class.RETAKE_MESSAGE}`),
  testShareFb: document.querySelector(`.${Class.TEST_SHARE_FB}`),
  testLikeFb: document.querySelector(`.${Class.TEST_LIKE_FB}`),
  testDisqus: document.querySelector(`.${Class.TEST_DISQUS}`),
};

const fitty = ((w) => {

  // no window, early exit
  if (!w) {
    return;
  }

  // node list to array helper method
  const toArray = (nl) => [].slice.call(nl);

  // states
  const DrawState = {
    IDLE: 0,
    DIRTY_CONTENT: 1,
    DIRTY_LAYOUT: 2,
    DIRTY: 3
  };

  // all active fitty elements
  let fitties = [];

  // group all redraw calls till next frame, we cancel each frame request when a new one comes in. If no support for request animation frame, this is an empty function and supports for fitty stops.
  let redrawFrame = null;
  const requestRedraw = 'requestAnimationFrame' in w ? () => {
      w.cancelAnimationFrame(redrawFrame);
      redrawFrame = w.requestAnimationFrame(() => {
        redraw(fitties.filter(f => f.dirty));
      });
    } : () => {};


  // sets all fitties to dirty so they are redrawn on the next redraw loop, then calls redraw
  const redrawAll = (type) => () => {
    fitties.forEach(f => {
      f.dirty = type;
    });
    requestRedraw();
  };


  // redraws fitties so they nicely fit their parent container
  const redraw = fitties => {

    // getting info from the DOM should not trigger a reflow, let's gather as much intel as possible before triggering a reflow

    // check if styles of all fitties have been computed
    fitties
      .filter(f => !f.styleComputed)
      .forEach(f => { f.styleComputed = computeStyle(f); });

    // restyle elements that require pre-styling, this triggers a reflow, please try to prevent by adding CSS rules (see docs)
    fitties
      .filter(shouldPreStyle)
      .forEach(applyStyle);

    // we now determine which fitties should be redrawn, and if so, we calculate final styles for these fitties
    fitties
      .filter(shouldRedraw)
      .forEach(calculateStyles);

    // now we apply the calculated styles from our previous loop
    fitties.forEach(applyStyles);

    // now we dispatch events for all restyled fitties
    fitties.forEach(dispatchFitEvent);
  };

  const calculateStyles = f => {

    // get available width from parent node
    f.availableWidth = f.element.parentNode.clientWidth;

    // the space our target element uses
    f.currentWidth = f.element.scrollWidth;

    // remember current font size
    f.previousFontSize = f.currentFontSize;

    // let's calculate the new font size
    f.currentFontSize = Math.min(
      Math.max(
        f.minSize,
        (f.availableWidth / f.currentWidth) * f.previousFontSize
      ),
      f.maxSize
    );

    // if allows wrapping, only wrap when at minimum font size (otherwise would break container)
    f.whiteSpace = f.multiLine && f.currentFontSize === f.minSize
      ? 'normal'
      : 'nowrap';

  };

  // should always redraw if is not dirty layout, if is dirty layout, only redraw if size has changed
  const shouldRedraw = f => {
    return f.dirty !== DrawState.DIRTY_LAYOUT || (f.dirty === DrawState.DIRTY_LAYOUT && f.element.parentNode.clientWidth !== f.availableWidth);
  };

  // every fitty element is tested for invalid styles
  const computeStyle = f => {

    // get style properties
    const style = w.getComputedStyle(f.element, null);

    // get current font size in pixels (if we already calculated it, use the calculated version)
    f.currentFontSize = parseInt(style.getPropertyValue('font-size'), 10);

    // get display type and wrap mode
    f.display = style.getPropertyValue('display');
    f.whiteSpace = style.getPropertyValue('white-space');
  };


  // determines if this fitty requires initial styling, can be prevented by applying correct styles through CSS
  const shouldPreStyle = f => {

    let preStyle = false;

    // should have an inline style, if not, apply
    if (!/inline-/.test(f.display)) {
      preStyle = true;
      f.display = 'inline-block';
    }

    // to correctly calculate dimensions the element should have whiteSpace set to nowrap
    if (f.whiteSpace !== 'nowrap') {
      preStyle = true;
      f.whiteSpace = 'nowrap';
    }

    return preStyle;
  };


  // apply styles to array of fitties and automatically mark as non dirty
  const applyStyles = f => {
    applyStyle(f);
    f.dirty = DrawState.IDLE;
  };


  // apply styles to single fitty
  const applyStyle = f => {

    // remember original style, we need this to restore the fitty style when unsubscribing
    if (!f.originalStyle) {
      f.originalStyle = f.element.getAttribute('style') || '';
    }

    // set the new style to the original style plus the fitty styles
    f.element.style.cssText = `${f.originalStyle};white-space:${f.whiteSpace};display:${f.display};font-size:${f.currentFontSize}px`;
  };


  // dispatch a fit event on a fitty
  const dispatchFitEvent = f => {
    f.element.dispatchEvent(new CustomEvent('fit', {
      detail:{
        oldValue: f.previousFontSize,
        newValue: f.currentFontSize,
        scaleFactor: f.currentFontSize / f.previousFontSize
      }
    }));
  };


  // fit method, marks the fitty as dirty and requests a redraw (this will also redraw any other fitty marked as dirty)
  const fit = (f, type) => () => {
    f.dirty = type;
    requestRedraw();
  };


  // add a new fitty, does not redraw said fitty
  const subscribe = f => {

    // this is a new fitty so we need to validate if it's styles are in order
    f.newbie = true;

    // because it's a new fitty it should also be dirty, we want it to redraw on the first loop
    f.dirty = true;

    // we want to be able to update this fitty
    fitties.push(f);
  };


  // remove an existing fitty
  const unsubscribe = f => () => {

    // remove from fitties array
    fitties = fitties.filter(_ => _.element !== f.element);

    // stop observing DOM
    if (f.observeMutations) {
      f.observer.disconnect();
    }

    // reset font size to inherited size
    f.element.style.cssText = f.originalStyle;
  };

  const observeMutations = f => {

    // no observing?
    if (!f.observeMutations) {
      return;
    }

    // start observing mutations
    f.observer = new MutationObserver(fit(f, DrawState.DIRTY_CONTENT));

    // start observing
    f.observer.observe(
      f.element,
      f.observeMutations
    );

  };


  // default mutation observer settings
  const mutationObserverDefaultSetting = {
    subtree: true,
    childList: true,
    characterData: true
  };


  // default fitty options
  const defaultOptions = {
    minSize: 16,
    maxSize: 512,
    multiLine: true,
    observeMutations: 'MutationObserver' in w ? mutationObserverDefaultSetting : false
  };


  // array of elements in, fitty instances out
  function fittyCreate(elements, options) {

    // set options object
    const fittyOptions = {

      // expand default options
      ...defaultOptions,

      // override with custom options
      ...options
    };

    // create fitties
    const publicFitties = elements.map(element => {

      // create fitty instance
      const f = {

        // expand defaults
        ...fittyOptions,

        // internal options for this fitty
        element
      };

      // register this fitty
      subscribe(f);

      // should we observe DOM mutations
      observeMutations(f);

      // expose API
      return {
        element,
        fit: fit(f, DrawState.DIRTY),
        unsubscribe: unsubscribe(f)
      };

    });

    // call redraw on newly initiated fitties
    requestRedraw();

    // expose fitties
    return publicFitties;
  }


  // fitty creation function
  function fitty(target, options = {}) {

    // if target is a string
    return typeof target === 'string' ?

      // treat it as a querySelector
      fittyCreate( toArray( document.querySelectorAll(target) ), options) :

      // create single fitty
      fittyCreate([target], options)[0];
  }


  // handles viewport changes, redraws all fitties, but only does so after a timeout
  let resizeDebounce = null;
  const onWindowResized = () => {
    w.clearTimeout(resizeDebounce);
    resizeDebounce = w.setTimeout(
      redrawAll(DrawState.DIRTY_LAYOUT),
      fitty.observeWindowDelay
    );
  };


  // define observe window property, so when we set it to true or false events are automatically added and removed
  const events = [ 'resize', 'orientationchange' ];
  Object.defineProperty(fitty, 'observeWindow', {
    set: enabled => {
      const method = `${enabled ? 'add' : 'remove'}EventListener`;
      events.forEach(e => {
        w[method](e, onWindowResized);
      });
    }
  });


  // fitty global properties (by setting observeWindow to true the events above get added)
  fitty.observeWindow = true;
  fitty.observeWindowDelay = 100;


  // public fit all method, will force redraw no matter what
  fitty.fitAll = redrawAll(DrawState.DIRTY);

  // export our fitty function, we don't want to keep it to our selves
  return fitty;

})(typeof window === 'undefined' ? null : window);

var startFitty = (elem, options) => {
  if (elem) {
    fitty(elem, options);
  } else {
    return;
  }
}

class Accordion {
  constructor(parent, accordionClass) {
    this.titleClass = accordionClass;
    this.titleClassActive = `${this.titleClass}--active`;
    this.titles = parent.querySelectorAll(`.${accordionClass}`);
  }

  _setActiveElem(title) {
    this.activeTitle = title;
    this.activePanel = title.nextElementSibling;
  }

  _switchOffActiveElem() {
    this.activeTitle.classList.remove(this.titleClassActive);
    this.activePanel.style.maxHeight = `0px`;
  }

  _isTitleActive(title) {
    return title.classList.contains(this.titleClassActive);
  }

  _turnOnActiveElem() {
    this.activeTitle.classList.add(this.titleClassActive);
    this.activePanel.style.maxHeight = `${this.activePanel.scrollHeight}px`;
  }

  _setPrimaryHeight(title) {
    const panel = title.nextElementSibling;

    if (this._isTitleActive(title)) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;

      this._setActiveElem(title);
    } else {
      panel.style.maxHeight = `0px`;
    }
  }

  init() {
    for (let i = 0; i < this.titles.length; i++) {
      const title = this.titles[i];

      this._setPrimaryHeight(title);

      title.addEventListener(`click`, () => {
        if (!this._isTitleActive(title)) {
          this._switchOffActiveElem();
          this._setActiveElem(title);
          this._turnOnActiveElem();
        }
      });
    }
  }

  start() {
    if (document.readyState === `complete`) {
      this.init();
    } else {
      document.addEventListener(`readystatechange`, () => {
        if (document.readyState === `complete`) {
          this.init();
        }
      });
    }
  }
}

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @template A
 */
class MDCFoundation {
  /** @return enum{cssClasses} */
  static get cssClasses() {
    // Classes extending MDCFoundation should implement this method to return an object which exports every
    // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
    return {};
  }

  /** @return enum{strings} */
  static get strings() {
    // Classes extending MDCFoundation should implement this method to return an object which exports all
    // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
    return {};
  }

  /** @return enum{numbers} */
  static get numbers() {
    // Classes extending MDCFoundation should implement this method to return an object which exports all
    // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
    return {};
  }

  /** @return {!Object} */
  static get defaultAdapter() {
    // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
    // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
    // validation.
    return {};
  }

  /**
   * @param {A=} adapter
   */
  constructor(adapter = {}) {
    /** @protected {!A} */
    this.adapter_ = adapter;
  }

  init() {
    // Subclasses should override this method to perform initialization routines (registering events, etc.)
  }

  destroy() {
    // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
  }
}

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @template F
 */
class MDCComponent {
  /**
   * @param {!Element} root
   * @return {!MDCComponent}
   */
  static attachTo(root) {
    // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and
    // returns an instantiated component with its root set to that element. Also note that in the cases of
    // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized
    // from getDefaultFoundation().
    return new MDCComponent(root, new MDCFoundation());
  }

  /**
   * @param {!Element} root
   * @param {F=} foundation
   * @param {...?} args
   */
  constructor(root, foundation = undefined, ...args) {
    /** @protected {!Element} */
    this.root_ = root;
    this.initialize(...args);
    // Note that we initialize foundation here and not within the constructor's default param so that
    // this.root_ is defined and can be used within the foundation class.
    /** @protected {!F} */
    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;
    this.foundation_.init();
    this.initialSyncWithDOM();
  }

  initialize(/* ...args */) {
    // Subclasses can override this to do any additional setup work that would be considered part of a
    // "constructor". Essentially, it is a hook into the parent constructor before the foundation is
    // initialized. Any additional arguments besides root and foundation will be passed in here.
  }

  /**
   * @return {!F} foundation
   */
  getDefaultFoundation() {
    // Subclasses must override this method to return a properly configured foundation class for the
    // component.
    throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' +
      'foundation class');
  }

  initialSyncWithDOM() {
    // Subclasses should override this method if they need to perform work to synchronize with a host DOM
    // object. An example of this would be a form control wrapper that needs to synchronize its internal state
    // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM
    // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.
  }

  destroy() {
    // Subclasses may implement this method to release any resources / deregister any listeners they have
    // attached. An example of this might be deregistering a resize event from the window object.
    this.foundation_.destroy();
  }

  /**
   * Wrapper method to add an event listener to the component's root element. This is most useful when
   * listening for custom events.
   * @param {string} evtType
   * @param {!Function} handler
   */
  listen(evtType, handler) {
    this.root_.addEventListener(evtType, handler);
  }

  /**
   * Wrapper method to remove an event listener to the component's root element. This is most useful when
   * unlistening for custom events.
   * @param {string} evtType
   * @param {!Function} handler
   */
  unlisten(evtType, handler) {
    this.root_.removeEventListener(evtType, handler);
  }

  /**
   * Fires a cross-browser-compatible custom event from the component root of the given type,
   * with the given data.
   * @param {string} evtType
   * @param {!Object} evtData
   * @param {boolean=} shouldBubble
   */
  emit(evtType, evtData, shouldBubble = false) {
    let evt;
    if (typeof CustomEvent === 'function') {
      evt = new CustomEvent(evtType, {
        detail: evtData,
        bubbles: shouldBubble,
      });
    } else {
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(evtType, shouldBubble, false, evtData);
    }

    this.root_.dispatchEvent(evt);
  }
}

/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const cssClasses = {
  // Ripple is a special case where the "root" component is really a "mixin" of sorts,
  // given that it's an 'upgrade' to an existing component. That being said it is the root
  // CSS class that all other CSS classes derive from.
  ROOT: 'mdc-ripple-upgraded',
  UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
  BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
  FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
  FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
};

const strings = {
  VAR_LEFT: '--mdc-ripple-left',
  VAR_TOP: '--mdc-ripple-top',
  VAR_FG_SIZE: '--mdc-ripple-fg-size',
  VAR_FG_SCALE: '--mdc-ripple-fg-scale',
  VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
  VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
};

const numbers = {
  PADDING: 10,
  INITIAL_ORIGIN_SCALE: 0.6,
  DEACTIVATION_TIMEOUT_MS: 225, // Corresponds to $mdc-ripple-translate-duration (i.e. activation animation duration)
  FG_DEACTIVATION_MS: 150, // Corresponds to $mdc-ripple-fade-out-duration (i.e. deactivation animation duration)
  TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
};

/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Stores result from supportsCssVariables to avoid redundant processing to detect CSS custom variable support.
 * @private {boolean|undefined}
 */
let supportsCssVariables_;

/**
 * Stores result from applyPassive to avoid redundant processing to detect passive event listener support.
 * @private {boolean|undefined}
 */
let supportsPassive_;

/**
 * @param {!Window} windowObj
 * @return {boolean}
 */
function detectEdgePseudoVarBug(windowObj) {
  // Detect versions of Edge with buggy var() support
  // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11495448/
  const document = windowObj.document;
  const node = document.createElement('div');
  node.className = 'mdc-ripple-surface--test-edge-var-bug';
  document.body.appendChild(node);

  // The bug exists if ::before style ends up propagating to the parent element.
  // Additionally, getComputedStyle returns null in iframes with display: "none" in Firefox,
  // but Firefox is known to support CSS custom properties correctly.
  // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  const computedStyle = windowObj.getComputedStyle(node);
  const hasPseudoVarBug = computedStyle !== null && computedStyle.borderTopStyle === 'solid';
  node.remove();
  return hasPseudoVarBug;
}

/**
 * @param {!Window} windowObj
 * @param {boolean=} forceRefresh
 * @return {boolean|undefined}
 */

function supportsCssVariables(windowObj, forceRefresh = false) {
  let supportsCssVariables = supportsCssVariables_;
  if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
    return supportsCssVariables;
  }

  const supportsFunctionPresent = windowObj.CSS && typeof windowObj.CSS.supports === 'function';
  if (!supportsFunctionPresent) {
    return;
  }

  const explicitlySupportsCssVars = windowObj.CSS.supports('--css-vars', 'yes');
  // See: https://bugs.webkit.org/show_bug.cgi?id=154669
  // See: README section on Safari
  const weAreFeatureDetectingSafari10plus = (
    windowObj.CSS.supports('(--css-vars: yes)') &&
    windowObj.CSS.supports('color', '#00000000')
  );

  if (explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus) {
    supportsCssVariables = !detectEdgePseudoVarBug(windowObj);
  } else {
    supportsCssVariables = false;
  }

  if (!forceRefresh) {
    supportsCssVariables_ = supportsCssVariables;
  }
  return supportsCssVariables;
}

//
/**
 * Determine whether the current browser supports passive event listeners, and if so, use them.
 * @param {!Window=} globalObj
 * @param {boolean=} forceRefresh
 * @return {boolean|{passive: boolean}}
 */
function applyPassive(globalObj = window, forceRefresh = false) {
  if (supportsPassive_ === undefined || forceRefresh) {
    let isSupported = false;
    try {
      globalObj.document.addEventListener('test', null, {get passive() {
        isSupported = true;
      }});
    } catch (e) { }

    supportsPassive_ = isSupported;
  }

  return supportsPassive_ ? {passive: true} : false;
}

/**
 * @param {!Object} HTMLElementPrototype
 * @return {!Array<string>}
 */
function getMatchesProperty(HTMLElementPrototype) {
  return [
    'webkitMatchesSelector', 'msMatchesSelector', 'matches',
  ].filter((p) => p in HTMLElementPrototype).pop();
}

/**
 * @param {!Event} ev
 * @param {{x: number, y: number}} pageOffset
 * @param {!ClientRect} clientRect
 * @return {{x: number, y: number}}
 */
function getNormalizedEventCoords(ev, pageOffset, clientRect) {
  const {x, y} = pageOffset;
  const documentX = x + clientRect.left;
  const documentY = y + clientRect.top;

  let normalizedX;
  let normalizedY;
  // Determine touch point relative to the ripple container.
  if (ev.type === 'touchstart') {
    normalizedX = ev.changedTouches[0].pageX - documentX;
    normalizedY = ev.changedTouches[0].pageY - documentY;
  } else {
    normalizedX = ev.pageX - documentX;
    normalizedY = ev.pageY - documentY;
  }

  return {x: normalizedX, y: normalizedY};
}

/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Activation events registered on the root element of each instance for activation
const ACTIVATION_EVENT_TYPES = ['touchstart', 'pointerdown', 'mousedown', 'keydown'];

// Deactivation events registered on documentElement when a pointer-related down event occurs
const POINTER_DEACTIVATION_EVENT_TYPES = ['touchend', 'pointerup', 'mouseup'];

// Tracks activations that have occurred on the current frame, to avoid simultaneous nested activations
/** @type {!Array<!EventTarget>} */
let activatedTargets = [];

/**
 * @extends {MDCFoundation<!MDCRippleAdapter>}
 */
class MDCRippleFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }

  static get defaultAdapter() {
    return {
      browserSupportsCssVars: () => /* boolean - cached */ {},
      isUnbounded: () => /* boolean */ {},
      isSurfaceActive: () => /* boolean */ {},
      isSurfaceDisabled: () => /* boolean */ {},
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      containsEventTarget: (/* target: !EventTarget */) => {},
      registerInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      deregisterInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      registerDocumentInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      deregisterDocumentInteractionHandler: (/* evtType: string, handler: EventListener */) => {},
      registerResizeHandler: (/* handler: EventListener */) => {},
      deregisterResizeHandler: (/* handler: EventListener */) => {},
      updateCssVariable: (/* varName: string, value: string */) => {},
      computeBoundingRect: () => /* ClientRect */ {},
      getWindowPageOffset: () => /* {x: number, y: number} */ {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCRippleFoundation.defaultAdapter, adapter));

    /** @private {number} */
    this.layoutFrame_ = 0;

    /** @private {!ClientRect} */
    this.frame_ = /** @type {!ClientRect} */ ({width: 0, height: 0});

    /** @private {!ActivationStateType} */
    this.activationState_ = this.defaultActivationState_();

    /** @private {number} */
    this.initialSize_ = 0;

    /** @private {number} */
    this.maxRadius_ = 0;

    /** @private {function(!Event)} */
    this.activateHandler_ = (e) => this.activate_(e);

    /** @private {function(!Event)} */
    this.deactivateHandler_ = (e) => this.deactivate_(e);

    /** @private {function(?Event=)} */
    this.focusHandler_ = () => requestAnimationFrame(
      () => this.adapter_.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED)
    );

    /** @private {function(?Event=)} */
    this.blurHandler_ = () => requestAnimationFrame(
      () => this.adapter_.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED)
    );

    /** @private {!Function} */
    this.resizeHandler_ = () => this.layout();

    /** @private {{left: number, top:number}} */
    this.unboundedCoords_ = {
      left: 0,
      top: 0,
    };

    /** @private {number} */
    this.fgScale_ = 0;

    /** @private {number} */
    this.activationTimer_ = 0;

    /** @private {number} */
    this.fgDeactivationRemovalTimer_ = 0;

    /** @private {boolean} */
    this.activationAnimationHasEnded_ = false;

    /** @private {!Function} */
    this.activationTimerCallback_ = () => {
      this.activationAnimationHasEnded_ = true;
      this.runDeactivationUXLogicIfReady_();
    };

    /** @private {?Event} */
    this.previousActivationEvent_ = null;
  }

  /**
   * We compute this property so that we are not querying information about the client
   * until the point in time where the foundation requests it. This prevents scenarios where
   * client-side feature-detection may happen too early, such as when components are rendered on the server
   * and then initialized at mount time on the client.
   * @return {boolean}
   * @private
   */
  isSupported_() {
    return this.adapter_.browserSupportsCssVars();
  }

  /**
   * @return {!ActivationStateType}
   */
  defaultActivationState_() {
    return {
      isActivated: false,
      hasDeactivationUXRun: false,
      wasActivatedByPointer: false,
      wasElementMadeActive: false,
      activationEvent: null,
      isProgrammatic: false,
    };
  }

  init() {
    if (!this.isSupported_()) {
      return;
    }
    this.registerRootHandlers_();

    const {ROOT, UNBOUNDED} = MDCRippleFoundation.cssClasses;
    requestAnimationFrame(() => {
      this.adapter_.addClass(ROOT);
      if (this.adapter_.isUnbounded()) {
        this.adapter_.addClass(UNBOUNDED);
        // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
        this.layoutInternal_();
      }
    });
  }

  destroy() {
    if (!this.isSupported_()) {
      return;
    }

    if (this.activationTimer_) {
      clearTimeout(this.activationTimer_);
      this.activationTimer_ = 0;
      const {FG_ACTIVATION} = MDCRippleFoundation.cssClasses;
      this.adapter_.removeClass(FG_ACTIVATION);
    }

    this.deregisterRootHandlers_();
    this.deregisterDeactivationHandlers_();

    const {ROOT, UNBOUNDED} = MDCRippleFoundation.cssClasses;
    requestAnimationFrame(() => {
      this.adapter_.removeClass(ROOT);
      this.adapter_.removeClass(UNBOUNDED);
      this.removeCssVars_();
    });
  }

  /** @private */
  registerRootHandlers_() {
    ACTIVATION_EVENT_TYPES.forEach((type) => {
      this.adapter_.registerInteractionHandler(type, this.activateHandler_);
    });
    this.adapter_.registerInteractionHandler('focus', this.focusHandler_);
    this.adapter_.registerInteractionHandler('blur', this.blurHandler_);

    if (this.adapter_.isUnbounded()) {
      this.adapter_.registerResizeHandler(this.resizeHandler_);
    }
  }

  /**
   * @param {!Event} e
   * @private
   */
  registerDeactivationHandlers_(e) {
    if (e.type === 'keydown') {
      this.adapter_.registerInteractionHandler('keyup', this.deactivateHandler_);
    } else {
      POINTER_DEACTIVATION_EVENT_TYPES.forEach((type) => {
        this.adapter_.registerDocumentInteractionHandler(type, this.deactivateHandler_);
      });
    }
  }

  /** @private */
  deregisterRootHandlers_() {
    ACTIVATION_EVENT_TYPES.forEach((type) => {
      this.adapter_.deregisterInteractionHandler(type, this.activateHandler_);
    });
    this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);
    this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);

    if (this.adapter_.isUnbounded()) {
      this.adapter_.deregisterResizeHandler(this.resizeHandler_);
    }
  }

  /** @private */
  deregisterDeactivationHandlers_() {
    this.adapter_.deregisterInteractionHandler('keyup', this.deactivateHandler_);
    POINTER_DEACTIVATION_EVENT_TYPES.forEach((type) => {
      this.adapter_.deregisterDocumentInteractionHandler(type, this.deactivateHandler_);
    });
  }

  /** @private */
  removeCssVars_() {
    const {strings: strings$$1} = MDCRippleFoundation;
    Object.keys(strings$$1).forEach((k) => {
      if (k.indexOf('VAR_') === 0) {
        this.adapter_.updateCssVariable(strings$$1[k], null);
      }
    });
  }

  /**
   * @param {?Event} e
   * @private
   */
  activate_(e) {
    if (this.adapter_.isSurfaceDisabled()) {
      return;
    }

    const activationState = this.activationState_;
    if (activationState.isActivated) {
      return;
    }

    // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
    const previousActivationEvent = this.previousActivationEvent_;
    const isSameInteraction = previousActivationEvent && e && previousActivationEvent.type !== e.type;
    if (isSameInteraction) {
      return;
    }

    activationState.isActivated = true;
    activationState.isProgrammatic = e === null;
    activationState.activationEvent = e;
    activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : (
      e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'pointerdown'
    );

    const hasActivatedChild =
      e && activatedTargets.length > 0 && activatedTargets.some((target) => this.adapter_.containsEventTarget(target));
    if (hasActivatedChild) {
      // Immediately reset activation state, while preserving logic that prevents touch follow-on events
      this.resetActivationState_();
      return;
    }

    if (e) {
      activatedTargets.push(/** @type {!EventTarget} */ (e.target));
      this.registerDeactivationHandlers_(e);
    }

    activationState.wasElementMadeActive = this.checkElementMadeActive_(e);
    if (activationState.wasElementMadeActive) {
      this.animateActivation_();
    }

    requestAnimationFrame(() => {
      // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
      activatedTargets = [];

      if (!activationState.wasElementMadeActive && (e.key === ' ' || e.keyCode === 32)) {
        // If space was pressed, try again within an rAF call to detect :active, because different UAs report
        // active states inconsistently when they're called within event handling code:
        // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
        // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
        // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
        // variable is set within a rAF callback for a submit button interaction (#2241).
        activationState.wasElementMadeActive = this.checkElementMadeActive_(e);
        if (activationState.wasElementMadeActive) {
          this.animateActivation_();
        }
      }

      if (!activationState.wasElementMadeActive) {
        // Reset activation state immediately if element was not made active.
        this.activationState_ = this.defaultActivationState_();
      }
    });
  }

  /**
   * @param {?Event} e
   * @private
   */
  checkElementMadeActive_(e) {
    return (e && e.type === 'keydown') ? this.adapter_.isSurfaceActive() : true;
  }

  /**
   * @param {?Event=} event Optional event containing position information.
   */
  activate(event = null) {
    this.activate_(event);
  }

  /** @private */
  animateActivation_() {
    const {VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END} = MDCRippleFoundation.strings;
    const {FG_DEACTIVATION, FG_ACTIVATION} = MDCRippleFoundation.cssClasses;
    const {DEACTIVATION_TIMEOUT_MS} = MDCRippleFoundation.numbers;

    this.layoutInternal_();

    let translateStart = '';
    let translateEnd = '';

    if (!this.adapter_.isUnbounded()) {
      const {startPoint, endPoint} = this.getFgTranslationCoordinates_();
      translateStart = `${startPoint.x}px, ${startPoint.y}px`;
      translateEnd = `${endPoint.x}px, ${endPoint.y}px`;
    }

    this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
    this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
    // Cancel any ongoing activation/deactivation animations
    clearTimeout(this.activationTimer_);
    clearTimeout(this.fgDeactivationRemovalTimer_);
    this.rmBoundedActivationClasses_();
    this.adapter_.removeClass(FG_DEACTIVATION);

    // Force layout in order to re-trigger the animation.
    this.adapter_.computeBoundingRect();
    this.adapter_.addClass(FG_ACTIVATION);
    this.activationTimer_ = setTimeout(() => this.activationTimerCallback_(), DEACTIVATION_TIMEOUT_MS);
  }

  /**
   * @private
   * @return {{startPoint: PointType, endPoint: PointType}}
   */
  getFgTranslationCoordinates_() {
    const {activationEvent, wasActivatedByPointer} = this.activationState_;

    let startPoint;
    if (wasActivatedByPointer) {
      startPoint = getNormalizedEventCoords(
        /** @type {!Event} */ (activationEvent),
        this.adapter_.getWindowPageOffset(), this.adapter_.computeBoundingRect()
      );
    } else {
      startPoint = {
        x: this.frame_.width / 2,
        y: this.frame_.height / 2,
      };
    }
    // Center the element around the start point.
    startPoint = {
      x: startPoint.x - (this.initialSize_ / 2),
      y: startPoint.y - (this.initialSize_ / 2),
    };

    const endPoint = {
      x: (this.frame_.width / 2) - (this.initialSize_ / 2),
      y: (this.frame_.height / 2) - (this.initialSize_ / 2),
    };

    return {startPoint, endPoint};
  }

  /** @private */
  runDeactivationUXLogicIfReady_() {
    // This method is called both when a pointing device is released, and when the activation animation ends.
    // The deactivation animation should only run after both of those occur.
    const {FG_DEACTIVATION} = MDCRippleFoundation.cssClasses;
    const {hasDeactivationUXRun, isActivated} = this.activationState_;
    const activationHasEnded = hasDeactivationUXRun || !isActivated;

    if (activationHasEnded && this.activationAnimationHasEnded_) {
      this.rmBoundedActivationClasses_();
      this.adapter_.addClass(FG_DEACTIVATION);
      this.fgDeactivationRemovalTimer_ = setTimeout(() => {
        this.adapter_.removeClass(FG_DEACTIVATION);
      }, numbers.FG_DEACTIVATION_MS);
    }
  }

  /** @private */
  rmBoundedActivationClasses_() {
    const {FG_ACTIVATION} = MDCRippleFoundation.cssClasses;
    this.adapter_.removeClass(FG_ACTIVATION);
    this.activationAnimationHasEnded_ = false;
    this.adapter_.computeBoundingRect();
  }

  resetActivationState_() {
    this.previousActivationEvent_ = this.activationState_.activationEvent;
    this.activationState_ = this.defaultActivationState_();
    // Touch devices may fire additional events for the same interaction within a short time.
    // Store the previous event until it's safe to assume that subsequent events are for new interactions.
    setTimeout(() => this.previousActivationEvent_ = null, MDCRippleFoundation.numbers.TAP_DELAY_MS);
  }

  /**
   * @param {?Event} e
   * @private
   */
  deactivate_(e) {
    const activationState = this.activationState_;
    // This can happen in scenarios such as when you have a keyup event that blurs the element.
    if (!activationState.isActivated) {
      return;
    }

    const state = /** @type {!ActivationStateType} */ (Object.assign({}, activationState));

    if (activationState.isProgrammatic) {
      const evtObject = null;
      requestAnimationFrame(() => this.animateDeactivation_(evtObject, state));
      this.resetActivationState_();
    } else {
      this.deregisterDeactivationHandlers_();
      requestAnimationFrame(() => {
        this.activationState_.hasDeactivationUXRun = true;
        this.animateDeactivation_(e, state);
        this.resetActivationState_();
      });
    }
  }

  /**
   * @param {?Event=} event Optional event containing position information.
   */
  deactivate(event = null) {
    this.deactivate_(event);
  }

  /**
   * @param {Event} e
   * @param {!ActivationStateType} options
   * @private
   */
  animateDeactivation_(e, {wasActivatedByPointer, wasElementMadeActive}) {
    if (wasActivatedByPointer || wasElementMadeActive) {
      this.runDeactivationUXLogicIfReady_();
    }
  }

  layout() {
    if (this.layoutFrame_) {
      cancelAnimationFrame(this.layoutFrame_);
    }
    this.layoutFrame_ = requestAnimationFrame(() => {
      this.layoutInternal_();
      this.layoutFrame_ = 0;
    });
  }

  /** @private */
  layoutInternal_() {
    this.frame_ = this.adapter_.computeBoundingRect();
    const maxDim = Math.max(this.frame_.height, this.frame_.width);

    // Surface diameter is treated differently for unbounded vs. bounded ripples.
    // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
    // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
    // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
    // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
    // `overflow: hidden`.
    const getBoundedRadius = () => {
      const hypotenuse = Math.sqrt(Math.pow(this.frame_.width, 2) + Math.pow(this.frame_.height, 2));
      return hypotenuse + MDCRippleFoundation.numbers.PADDING;
    };

    this.maxRadius_ = this.adapter_.isUnbounded() ? maxDim : getBoundedRadius();

    // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
    this.initialSize_ = maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE;
    this.fgScale_ = this.maxRadius_ / this.initialSize_;

    this.updateLayoutCssVars_();
  }

  /** @private */
  updateLayoutCssVars_() {
    const {
      VAR_FG_SIZE, VAR_LEFT, VAR_TOP, VAR_FG_SCALE,
    } = MDCRippleFoundation.strings;

    this.adapter_.updateCssVariable(VAR_FG_SIZE, `${this.initialSize_}px`);
    this.adapter_.updateCssVariable(VAR_FG_SCALE, this.fgScale_);

    if (this.adapter_.isUnbounded()) {
      this.unboundedCoords_ = {
        left: Math.round((this.frame_.width / 2) - (this.initialSize_ / 2)),
        top: Math.round((this.frame_.height / 2) - (this.initialSize_ / 2)),
      };

      this.adapter_.updateCssVariable(VAR_LEFT, `${this.unboundedCoords_.left}px`);
      this.adapter_.updateCssVariable(VAR_TOP, `${this.unboundedCoords_.top}px`);
    }
  }

  /** @param {boolean} unbounded */
  setUnbounded(unbounded) {
    const {UNBOUNDED} = MDCRippleFoundation.cssClasses;
    if (unbounded) {
      this.adapter_.addClass(UNBOUNDED);
    } else {
      this.adapter_.removeClass(UNBOUNDED);
    }
  }
}

/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @extends MDCComponent<!MDCRippleFoundation>
 */
class MDCRipple extends MDCComponent {
  /** @param {...?} args */
  constructor(...args) {
    super(...args);

    /** @type {boolean} */
    this.disabled = false;

    /** @private {boolean} */
    this.unbounded_;
  }

  /**
   * @param {!Element} root
   * @param {{isUnbounded: (boolean|undefined)}=} options
   * @return {!MDCRipple}
   */
  static attachTo(root, {isUnbounded = undefined} = {}) {
    const ripple = new MDCRipple(root);
    // Only override unbounded behavior if option is explicitly specified
    if (isUnbounded !== undefined) {
      ripple.unbounded = /** @type {boolean} */ (isUnbounded);
    }
    return ripple;
  }

  /**
   * @param {!RippleCapableSurface} instance
   * @return {!MDCRippleAdapter}
   */
  static createAdapter(instance) {
    const MATCHES = getMatchesProperty(HTMLElement.prototype);

    return {
      browserSupportsCssVars: () => supportsCssVariables(window),
      isUnbounded: () => instance.unbounded,
      isSurfaceActive: () => instance.root_[MATCHES](':active'),
      isSurfaceDisabled: () => instance.disabled,
      addClass: (className) => instance.root_.classList.add(className),
      removeClass: (className) => instance.root_.classList.remove(className),
      containsEventTarget: (target) => instance.root_.contains(target),
      registerInteractionHandler: (evtType, handler) =>
        instance.root_.addEventListener(evtType, handler, applyPassive()),
      deregisterInteractionHandler: (evtType, handler) =>
        instance.root_.removeEventListener(evtType, handler, applyPassive()),
      registerDocumentInteractionHandler: (evtType, handler) =>
        document.documentElement.addEventListener(evtType, handler, applyPassive()),
      deregisterDocumentInteractionHandler: (evtType, handler) =>
        document.documentElement.removeEventListener(evtType, handler, applyPassive()),
      registerResizeHandler: (handler) => window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
      updateCssVariable: (varName, value) => instance.root_.style.setProperty(varName, value),
      computeBoundingRect: () => instance.root_.getBoundingClientRect(),
      getWindowPageOffset: () => ({x: window.pageXOffset, y: window.pageYOffset}),
    };
  }

  /** @return {boolean} */
  get unbounded() {
    return this.unbounded_;
  }

  /** @param {boolean} unbounded */
  set unbounded(unbounded) {
    this.unbounded_ = Boolean(unbounded);
    this.setUnbounded_();
  }

  /**
   * Closure Compiler throws an access control error when directly accessing a
   * protected or private property inside a getter/setter, like unbounded above.
   * By accessing the protected property inside a method, we solve that problem.
   * That's why this function exists.
   * @private
   */
  setUnbounded_() {
    this.foundation_.setUnbounded(this.unbounded_);
  }

  activate() {
    this.foundation_.activate();
  }

  deactivate() {
    this.foundation_.deactivate();
  }

  layout() {
    this.foundation_.layout();
  }

  /** @return {!MDCRippleFoundation} */
  getDefaultFoundation() {
    return new MDCRippleFoundation(MDCRipple.createAdapter(this));
  }

  initialSyncWithDOM() {
    this.unbounded = 'mdcRippleIsUnbounded' in this.root_.dataset;
  }
}

/**
 * See Material Design spec for more details on when to use ripples.
 * https://material.io/guidelines/motion/choreography.html#choreography-creation
 * @record
 */
class RippleCapableSurface {}

/** @protected {!Element} */
RippleCapableSurface.prototype.root_;

/**
 * Whether or not the ripple bleeds out of the bounds of the element.
 * @type {boolean|undefined}
 */
RippleCapableSurface.prototype.unbounded;

/**
 * Whether or not the ripple is attached to a disabled component.
 * @type {boolean|undefined}
 */
RippleCapableSurface.prototype.disabled;

const toggleAbility = (elem, condition) => {
  elem.disabled = condition ? false : true;
};

const toggleVisibility = (elem, condition) => {
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

const formatDate = (dateInString) => {
  let date = new Date(dateInString);

  let dd = date.getDate();

  if (dd < 10) {
    dd = `0${dd}`;
  }

  let mm = date.getMonth() + 1;

  if (mm < 10) {
    mm = `0${mm}`;
  }

  let yy = date.getFullYear() % 100;

  if (yy < 10) {
    yy = `0${yy}`;
  }

  return `${dd}.${mm}.${yy}`;
};
// export const runIfEventFired = (status, event, callback, ...args) => {
//   if (status) {
//     callback(args[0], args[1], args[2]);
//   } else {
//     document.addEventListener(event, () => {
//       callback(args[0], args[1], args[2]);
//     });
//   }
// };

// export const initFbBtns = (likeBtn, shareBtn, block) => {
//   if (likeBtn) {
//     likeBtn.addEventListener(`click`, () => {

//       window.gtag(`event`, `clickToPostFb`, {
//         'event_category': `social`,
//         'event_label': `like${block}`
//       });

//       window.FB.ui({
//         method: `share_open_graph`,
//         action_type: `og.shares`,
//         action_properties: JSON.stringify({
//           object: window.location.href
//         })
//       }, function (response) {
//         if (response) {
//           window.gtag(`event`, `post`, {
//             'event_category': `social`,
//             'event_label': `FbLike${block}`
//           });
//         }
//       });
//     });
//   }

//   if (shareBtn) {
//     shareBtn.addEventListener(`click`, () => {
//       window.FB.ui({
//         method: `share`,
//         href: window.location.href
//       }, function (response) {
//         if (response) {
//           window.gtag(`event`, `post`, {
//             'event_category': `social`,
//             'event_label': `FbShare${block}`
//           });
//         }
//       });

//       window.gtag(`event`, `clickToPostFb`, {
//         'event_category': `social`,
//         'event_label': `share${block}`
//       });
//     });
//     window.FB.api(
//         `/`,
//         {
//           "id": window.location.href,
//           "fields": `engagement`,
//           "access_token": `1749739928442230|6c993bd89f7f20c463971b1582ad7cc0`
//         },
//         function (response) {
//           if (response && !response.error) {
//             const engagement = response.engagement;

//             if (engagement && engagement.share_count > 5) {
//               const sharesQuantity = shareBtn.querySelector(`.fb-btn__shares-quantity`);
//               sharesQuantity.innerHTML = engagement.share_count;
//             }
//           }
//         }
//     );
//   }
// };

const checkIfClassInMap = (map, className) => {

  for (let arr of map.values()) {
    if (!_checkIfClassInArr(arr, className)) {
      return false;
    }
  }

  return true;
};

const showPage = () => {
  setTimeout(() => {
    document.body.classList.add(`body__visible`);
  }, 600);
};

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

const Share = {
  vkontakte(purl) {
    const url = `http://vkontakte.ru/share.php?url=${encodeURIComponent(purl)}`;
    Share.popup(url);
  },
  twitter(purl) {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(purl)}`;
    Share.popup(url);
  },
  fb(purl, hashtag) {
    const hash = `#${hashtag}`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(purl)}&hashtag=${encodeURIComponent(hash)}`;
    Share.popup(url);
  },
  popup(url) {
    window.open(url, ``, `toolbar=0,status=0,width=626,height=436`);
  }
};

class TestView {
  constructor() {
    this.dom = dom;
  }

  _markWrongAnsweredQuestion(ids) {
    ids.forEach((id) => {
      for (let key of this.dom.questionsAndOptions.keys()) {
        if (key.id === `${id}`) {
          key.classList.add(Class.QUESTION_WRONG);
          break;
        }
      }
    });
  }

  getUserAnswers(questionsAndOptions) {
    let obj = {};

    for (let entry of questionsAndOptions) {
      let id = entry[0].id;
      let answers = this._getUserAnswer(entry[1]);

      obj[id] = answers;
    }

    return obj;
  }

  _getUserAnswer(arr) {
    let chosenOptions = [];

    arr.forEach((elem) => {
      if (elem.classList.contains(Class.QUESTION_OPTION_IS_CHECKED)) {
        const optionId = elem.id.substr(-1);

        chosenOptions.push(optionId);
      }
    });

    return chosenOptions;
  }

  _disableSelection(elem) {
    elem.classList.add(Class.TEST_QUESTIONS_DONE);
  }

  changePage(pass, retakeMessage) {
    this._disableSelection(this.dom.testQuestions);
    toggleVisibility(this.dom.resultBtn, false);
    this._changeTestTag(pass.date);
    this._showSocial();
    this._showRetakeBlock(retakeMessage);
    this._markWrongAnsweredQuestion(pass.result.wrongQuestionsIds);

    if (pass.answers) {
      this._markChosenOptions(pass.answers);
    }

    this._handleDisqus();
  }

  _changeTestTag(date) {
    this.dom.testTag.innerHTML = `Результаты теста от ${formatDate(date)}`;
  }

  _handleDisqus() {
    let disqusLoaded = window.disqusLoaded;

    if (disqusLoaded === false) {
      window.addEventListener(`scroll`, () => {
        if (!disqusLoaded && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          this.dom.testDisqus.classList.add(Class.TEST_DISQUS_VISIBLE);

          window.startDisqus();
          disqusLoaded = true;
        }
      });
    }
  }

  _showRetakeBlock(message) {
    if (message) {

      this.dom.retakeMessage.innerHTML = message;
      toggleAbility(this.dom.retakeBtn, false);
    } else {
      this.dom.retakeBtn.addEventListener(`click`, () => {
        window.gtag(`event`, `retake`, {
          'event_category': `test`
        });

        location.href = `?attempt=new`;
      });
    }

    this.dom.retakeBlock.classList.add(Class.RETAKE_BLOCK_VISIBLE);
  }

  _showSocial() {
    // ставим обработчики на соц кнопки в блоке test
    // обработчики повесятся асинхронно
    // runIfEventFired(window.isfbApiInited, `fbApiInit`, initFbBtns, this.dom.testLikeFb, this.dom.testShareFb, `test`);
    this.dom.testSocial.classList.add(Class.TEST_SOCIAL_VISIBLE);
  }

  _initSocial(data, parent) {
    const fbShareBtn = parent.querySelector(`.${Class.SUMMARY_SHARE_FB}`);
    const vkShareBtn = parent.querySelector(`.${Class.SUMMARY_SHARE_VK}`);
    const twShareBtn = parent.querySelector(`.${Class.SUMMARY_SHARE_TW}`);

    // fbShareBtn.addEventListener(`click`, () => {
    //   const fbShareData = {
    //     method: `share_open_graph`,
    //     hashtag: shareData.hashtag,
    //     action_type: `og.shares`,
    //     action_properties: JSON.stringify({
    //       object: shareData.passUrl
    //     })
    //   };

    //   window.FB.ui(fbShareData, function (response) {
    //     if (response) {
    //       window.gtag(`event`, `post`, {
    //         'event_category': `award`,
    //         'event_label': `FB`
    //       });
    //     }
    //   });

    //   window.gtag(`event`, `clickToShare`, {
    //     'event_category': `award`,
    //     'event_label': `FB`
    //   });
    // });

    fbShareBtn.addEventListener(`click`, (event) => {
      event.preventDefault();
      Share.fb(data.passUrl, data.hashtag);

      window.gtag(`event`, `clickToShare`, {
        'event_category': `award`,
        'event_label': `FB`
      });
    });

    vkShareBtn.addEventListener(`click`, (event) => {
      event.preventDefault();
      Share.vkontakte(data.passUrl);

      window.gtag(`event`, `clickToShare`, {
        'event_category': `award`,
        'event_label': `VK`
      });
    });

    twShareBtn.addEventListener(`click`, (event) => {
      event.preventDefault();
      Share.twitter(data.passUrl);

      window.gtag(`event`, `clickToShare`, {
        'event_category': `award`,
        'event_label': `TW`
      });
    });
  }

  initAccordion() {
    const accordion = new Accordion(this.dom.test, `accordion__title`);
    accordion.start();
  }

  // data = {"1": ["a", "b"], ...}
  _markChosenOptions(answers) {
    this.dom.questionsAndOptions.forEach((options, question) => {
      const chosenOptions = answers[question.id];

      if (chosenOptions) {
        chosenOptions.forEach((option) => {
          const optionId = `${question.id}_${option}`;

          for (let i = 0; i <= options.length; i++) {
            if (options[i].id === optionId) {
              options[i].classList.add(Class.QUESTION_OPTION_IS_CHECKED);
              break;
            }
          }
        });
      }
    });
  }

  showSummary(html, shareData, recommendation) {
    this.dom.testTitle.insertAdjacentHTML(`afterEnd`, html);

    this.dom.test.classList.add(Class.TEST_IS_CHECKED);

    const summary = document.querySelector(`.js-summary`);
    const summaryPercent = summary.querySelector(`.js-summary__percent`);

    startFitty(summaryPercent, {maxSize: 108});

    if (shareData) {
      this._initSocial(shareData, summary);
    }

    if (recommendation && recommendation.isFirstSeen) {
      const recBlock = summary.querySelector(`.js-summary__recommendation`);
      const recLinks = recBlock.getElementsByTagName(`a`);
      const category = `recommend-${recommendation.levelName}`;
      const action = `goTo-${recommendation.name}`;
      let isRecommendClicked = false;

      [].forEach.call(recLinks, (link, index) => {
        link.addEventListener(`click`, () => {

          window.gtag(`event`, action, {
            'event_category': category,
            'event_label': index
          });

          if (!isRecommendClicked) {
            window.gtag(`event`, `take`, {
              'event_category': `recommendation`,
              'event_label': category
            });
          }

          isRecommendClicked = true;
        });
      });

      window.gtag(`event`, `receive`, {
        'event_category': category,
      });
    }
  }

  bind() {
    for (let questionOptions of this.dom.questionsAndOptions.values()) {
      questionOptions.forEach((option) => {
        option.addEventListener(`click`, (evt) => {
          const elem = evt.currentTarget;

          elem.classList.toggle(Class.QUESTION_OPTION_IS_CHECKED);

          const areAllQuestionsAnswered = checkIfClassInMap(this.dom.questionsAndOptions, Class.QUESTION_OPTION_IS_CHECKED);

          toggleAbility(this.dom.resultBtn, areAllQuestionsAnswered);
        });
      });
    }

    this.dom.resultBtn.addEventListener(`click`, () => {
      toggleAbility(this.dom.resultBtn, false);

      const userAnswers = this.getUserAnswers(this.dom.questionsAndOptions);

      window.gtag(`event`, `pass`, {
        'event_category': `test`
      });

      this.handleUserAnswers(userAnswers);

    });

    MDCRipple.attachTo(this.dom.resultBtn);
    MDCRipple.attachTo(this.dom.retakeBtn);
  }
}

class Test {
  constructor() {
    this._view = new TestView();
  }

  showTestResult(data) {
    this._view.changePage(data.pass);
    this._view.showSummary(data.summaryTemplate, data.shareData, data.recommendation);
    this._view.initAccordion();
    scrollToTop();
  }

  init() {
    this._view.handleUserAnswers = function (userAnswers) {
      app.getTestResult(userAnswers);
    };

    this._view.bind();
  }
}

const sendPass = (data) => {
  const dataJSON = JSON.stringify(data);

  const requestSettings = {
    method: `POST`,
    body: dataJSON,
    headers: {
      'Content-Type': `application/json`
    },
    credentials: `include`
  };

  return fetch(location.href, requestSettings)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return {};
        }
      });
};

var loader = {
  sendPass
};

let infoContainer;

const init = (info, secondBlock = dom.test) => {
  infoContainer = info.parentElement;

  const infoBtn = infoContainer.querySelector(`.js-info__btn`);
  const infoStartTest = info.querySelector(`.js-info__start-test`);
  // const fbShareBtn = info.querySelector(`.js-info__share-fb`);
  // const fbLikeBtn = info.querySelector(`.js-info__like-fb`);

  infoContainer.classList.add(`js-info__container`);
  secondBlock.classList.add(`info__second-block`);

  infoBtn.addEventListener(`click`, () => {
    infoContainer.classList.toggle(`info__container--on`);
    scrollToTop();
  });

  infoStartTest.addEventListener(`click`, () => {
    infoContainer.classList.toggle(`info__container--on`);
    scrollToTop();
  });

  // runIfEventFired(window.isfbApiInited, `fbApiInit`, initFbBtns, fbLikeBtn, fbShareBtn, `info`);

  MDCRipple.attachTo(infoStartTest);
};

const show = () => {
  infoContainer.classList.add(`info__container--on`);
};

var infoModule = {
  show,
  init
};

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

class App {
  constructor() {
  }

  getTestResult(userAnswers) {
    const sendResultTime = Date.now();
    this.preloader.smoothOpacityOn();

    loader.sendPass(userAnswers)
        .then((data) => {
          // чтобы не появлялись результаты раньше чем прелоадер раскроется
          setTimeout(this.handleData.bind(this), 1000, data);
          const leftTime = sendResultTime + 4000 - Date.now();

          if (leftTime < 0) {
            this.preloader.smoothOpacityOff();
          } else {
            setTimeout(this.preloader.smoothOpacityOff.bind(this), leftTime);
          }
        });
  }

  handleData(data) {
    this.test.showTestResult(data);
  }

  get preloader() {
    if (!this._preloader) {
      this._preloader = document.querySelector(`.preloader`);
      addSmoothOpacity(this._preloader, `preloader--hidden`);
    }

    return this._preloader;
  }

  init(param) {
    this.test = new Test();
    const info = document.querySelector(`.js-info`);

    if (info) {
      infoModule.init(info);
    }

    if (param === `attempt=new`) {
      this.test.init();
      infoModule.show();
      showPage();
    } else {
      loader.sendPass({})
          .then((data) => {
            if (Object.keys(data).length === 0) {
              infoModule.show();
              this.test.init();
            } else {
              this.handleData(data);
            }

            showPage();
          });
    }
  }
}

var app = new App();

const param = location.search.replace(`?`, ``);

app.init(param);

}());
