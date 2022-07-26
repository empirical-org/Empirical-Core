export default () => {
  const csrfToken: HTMLElement | null =
    document.getElementsByName("csrf-token")[0];

  return csrfToken instanceof HTMLMetaElement ? csrfToken.content : 0;
};
