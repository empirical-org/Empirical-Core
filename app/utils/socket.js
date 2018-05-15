import openSocket from 'socket.io-client'

const tokenUrl    = `${process.env.EMPIRICAL_BASE_URL}/api/v1/lessons_tokens`;
const socketUrl   = 'http://localhost:8000';
const formData    = new FormData();
const requestJSON = JSON.stringify({ app: process.env.FIREBASE_APP_NAME });
const request     = new XMLHttpRequest();

function handleResponse(request) {
  if (request.status === 200) {
    return JSON.parse(request.responseText);
  } else {
    throw request.status
  }
}

formData.append("json", requestJSON);
request.open('POST', tokenUrl, false);
request.send(formData);
const data = handleResponse(request);
const socket = openSocket(socketUrl, { query: { token: data.token } });
const SocketSingleton = { instance: socket };

Object.freeze(SocketSingleton)
export default SocketSingleton;
