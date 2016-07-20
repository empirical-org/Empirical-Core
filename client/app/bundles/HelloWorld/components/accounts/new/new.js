function areCookiesEnabled() {
  document.cookie = "__verify=1";
  var supportsCookies = document.cookie.length >= 1 &&
    document.cookie.indexOf("__verify=1") !== -1;
  var thePast = new Date(1976, 8, 16);
  document.cookie = "__verify=1;expires=" + thePast.toUTCString();
  if (supportsCookies === false) {
    alert("We've detected that your browser's cookies are disabled.\n\n\n" +
      "Please go to your browser's privacy or security settings and enable cookies. Otherwise, Quill may not work as intended."
    );
  }
}

areCookiesEnabled();
