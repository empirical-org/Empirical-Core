export default {
  async fetch(request, env, ctx) {
    //const body = JSON.parse(request.body);
    const requestJson = await request.json()
    console.log("requestJson: ", requestJson)
    return new Response(JSON.stringify(requestJson));
  },
};

