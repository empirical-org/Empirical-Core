import openSocket from 'socket.io-client'

class SocketStore {
  constructor(){
    this.instance = null;
    this.classroomActivityId = null;
    this.tokenUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v1/lessons_tokens`;
    this.socketUrl = 'http://localhost:8000';
  }

  _initSocket(callback = null) {
    let requestData = JSON.stringify({
      classroom_activity_id: this.classroomActivityId
    });
    let body = new FormData();
    body.append('json', requestData);

    fetch(this.tokenUrl, {
      method: 'POST',
      mode: "cors",
      credentials: 'include',
      body,
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((data) => {
      if (data && data.token) {
        this._openSocket(data.token, callback);
      }
    })
  }

  _openSocket(token, callback = null) {
    let socket = openSocket(this.socketUrl, {
      query: { token }
    });
    this.instance = socket;
    if (callback) {
      return callback()
    }
  }

  connect(newClassroomActivityId = null, callback = null) {
    let isSocketMissing      = !this.classroomActivityId && !this.instance
    let isNewActivitySession = this.classroomActivityId !== newClassroomActivityId
    let canCreateSocket      = isSocketMissing || isNewActivitySession

    if (canCreateSocket) {
      let data = this._initSocket(callback);
      this.classroomActivityId = newClassroomActivityId;
    }
  }
}

const instance = new SocketStore();

export default instance;
