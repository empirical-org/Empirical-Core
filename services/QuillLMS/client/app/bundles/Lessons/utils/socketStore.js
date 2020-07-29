import openSocket from 'socket.io-client';

class SocketStore {
  constructor() {
    this.instance = null;
    this.classroomUnitId = null;
    this.tokenUrl = `${process.env.DEFAULT_URL}/api/v1/lessons_tokens`;
    this.socketsUrl = process.env.LESSONS_WEBSOCKETS_URL;
    this.token = null;
  }

  _getAuthTokenAndConnect(callback = null) {
    const formData = new FormData();
    formData.append('classroom_unit_id', this.classroomUnitId);

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
      // to do, use Sentry to capture error
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
    });

    this.instance.on('disconnect', () => {
    });
  }

  connect(newClassroomUnitId = null, callback = null) {
    const isNewActivitySession = this.classroomUnitId !== newClassroomUnitId;
    const isSocketMissing = !this.classroomUnitId && !this.instance;

    if (isSocketMissing || isNewActivitySession) {
      this.classroomUnitId = newClassroomUnitId;
      this._getAuthTokenAndConnect(callback);
    }
  }
}

const instance = new SocketStore();

export default instance;
