/**
 * Here is write function use common
 * @class Helper
 */
class Helper {
  /**
   * Is browser?
   * https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser?answertab=votes#tab-top
   */
  static get broswer() {
    // don't support at server
    if (typeof window === 'undefined') {
      return {};
    }
    return {
      // Opera 8.0+
      isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0, // eslint-disable-line
      // Firefox 1.0+
      isFirefox: typeof InstallTrigger !== 'undefined',
      // Safari 3.0+ "[object HTMLElementConstructor]"
      isSafari: /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]'; }(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification))),  // eslint-disable-line
      // Internet Explorer 6-11
      isIE: /* @cc_on!@ */false || !!document.documentMode,
      // Chrome 1+
      isChrome: !!window.chrome && !!window.chrome.webstore,
    };
  }

  /**
   * Want to show a new window
   *
   * @param {*} url
   * @param {*} title
   * @param {*} w
   * @param {*} h
   * @memberof Helper
   */
  static popupCenter(url, title, w, h) {
    if (typeof window !== 'undefined') {
      // Fixes dual-screen position                         Most browsers      Firefox
      const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
      const dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
  
      const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
      const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
  
      const left = ((width / 2) - (w / 2)) + dualScreenLeft;
      const top = ((height / 2) - (h / 2)) + dualScreenTop;
      const newWindow = window.open(url, title, `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`);
  
      // Puts focus on the newWindow
      if (window.focus) {
        newWindow.focus();
      }
    }
  };
}

export default Helper;
