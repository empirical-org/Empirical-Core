import newrelic from 'newrelic';

// // shorter wrapper around the startWebTransaction function
export function nrTrack(key, data, callback) {
  newrelic.startWebTransaction('socket/' + key, function transactionHandler() {
    data ? callback(data) : callback();
  });
}
