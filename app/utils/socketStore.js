import openSocket from 'socket.io-client'

class SocketStore {
  constructor(){
    this.instance = null;
    this.classroomActivityId = null;
    this.tokenUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v1/lessons_tokens`;
    this.socketsUrl = process.env.LESSONS_WEBSOCKETS_URL;
  }

  _initSocket(callback = null) {
    const formData = new FormData();
    formData.append('classroom_activity_id', this.classroomActivityId);

    fetch(this.tokenUrl, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      body: formData,
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
    this._closeCurrentSocket()

    let socket = openSocket(this.socketsUrl, {
      query: { token }
    });

    this.instance = socket;
    if (callback) {
      return callback();
    }
  }

  _closeCurrentSocket() {
    if (this.instance) {
      this.instance.close();
      this.instance = null;
    }
  }

  connect(newClassroomActivityId = null, callback = null) {
    let isSocketMissing      = !this.classroomActivityId && !this.instance
    let isNewActivitySession = this.classroomActivityId !== newClassroomActivityId
    let canCreateSocket      = isSocketMissing || isNewActivitySession

    if (canCreateSocket) {
      this.classroomActivityId = newClassroomActivityId;
      this._initSocket(callback);
    }
  }
}

const instance = new SocketStore();

export default instance;
