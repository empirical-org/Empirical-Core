import openSocket from 'socket.io-client';

class SocketStore {
  constructor() {
    this.instance = null;
    this.classroomActivityId = null;
    this.tokenUrl = `${process.env.EMPIRICAL_BASE_URL}/api/v1/lessons_tokens`;
    this.socketsUrl = process.env.LESSONS_WEBSOCKETS_URL;
    this.token = null;
  }

  _getAuthTokenAndConnect(callback = null) {
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
        this.token = data.token;
        this._handleConnection(callback);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  _handleConnection(callback = null) {
    if (this.instance) {
      this._addAuthtokenToConnection();
    } else {
      this._openNewConnection();
    }

    if (callback) {
      return callback();
    }
  }

  _addAuthtokenToConnection() {
    this.instance.emit('authentication', { token: this.token, });
  }

  _openNewConnection() {
    this.instance = openSocket(this.socketsUrl);

    this.instance.on('connect', () => {
      this._addAuthtokenToConnection();
      console.log('connected to server');
    });

    this.instance.on('disconnect', () => {
      console.log('disconnected to server');
    });
  }

  connect(newClassroomActivityId = null, callback = null) {
    const isNewActivitySession = this.classroomActivityId !== newClassroomActivityId;
    const isSocketMissing = !this.classroomActivityId && !this.instance;

    if (isSocketMissing || isNewActivitySession) {
      this.classroomActivityId = newClassroomActivityId;
      this._getAuthTokenAndConnect(callback);
    }
  }
}

const instance = new SocketStore();

export default instance;
