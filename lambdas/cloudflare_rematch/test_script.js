var src_default = {
  async fetch(request, env, ctx) {
    return new Response(`Hello World v2 \n ${request} ${env} ${ctx}`);
  }
};
export {
  src_default as default
};