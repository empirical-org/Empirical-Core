import newrelic from 'newrelic';

// shorter wrapper around the startWebTransaction function
export function track(key, callback) {
  newrelic.startWebTransaction(key, function transactionHandler() {
    callback();
  });
}
