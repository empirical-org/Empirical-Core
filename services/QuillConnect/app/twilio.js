const functions = require('firebase-functions');

// Max number of lines of the chat history.
const MAX_LOG_COUNT = 5;

// Removes siblings of the node that element that triggered the function if there are more than MAX_LOG_COUNT.
// In this example we'll keep the max number of chat message history to MAX_LOG_COUNT.
exports.chat = functions.database.ref('/v3/chat/{phoneNumber}').onWrite((event) => {
  const parentRef = event.data.ref.message;
  return parentRef.once('value').then((snapshot) => {
    if (snapshot.numChildren() >= MAX_LOG_COUNT) {
      let childCount = 0;
      const updates = {};
      snapshot.forEach((child) => {
        childCount += 1;
        if (childCount <= snapshot.numChildren() - MAX_LOG_COUNT) {
          updates[child.key] = null;
        }
      });
      // Update the parent. This effectively removes the extra children.
      return parentRef.update(updates);
    }
  });
});
