var Firebase = require('firebase');
var _ = require('lodash');

function embedKeys (hash) {
  return _.mapValues(hash, (val, key) => {
    val.key = key;
    return val
  })
}

function hashToCollection (hash) {
  var wEmbeddedKeys = embedKeys(hash)
  return _.values(wEmbeddedKeys)
}


var lessonsRef = new Firebase("https://quillconnect.firebaseio.com/lessons");
lessonsRef.on("value", function(snapshot) {
  _.each(hashToCollection(snapshot.val()), function (value) {
    var ref = new Firebase("https://quillconnect.firebaseio.com/sessions");
    ref.orderByChild("lessonID").startAt(value.key).endAt(value.key).on("value", function(snapshot) {
      // console.log(value.name);
      _.each(hashToCollection(snapshot.val()), function (studentValue) {
        // console.log("\n")
        // console.log(studentValue.name);
        // console.log("Prompt\tNumber of Attempts\tAttempt 1\tFeedback 1\tGrade 1\tAttempt 2\tFeedback 2\tGrade 2\tAttempt 3\tFeedback 3\tGrade 3")
        _.each(studentValue.questions, function (question) {
          var string = ""
          string += question.prompt
          string += "\t" + question.attempts.length
          _.each(question.attempts, function (attempt) {
            string += '\t' + attempt.submitted + '\t' + ((attempt.response && (attempt.response.feedback != undefined)) ? attempt.response.feedback : '') + '\t' + (attempt.response ? attempt.response.optimal : '')
            // // console.log(attempt)
          })
          _.times((3 - question.attempts.length), function (n) {
            string += "\t\t\t"
          })
          // console.log(string)
        })
      })
      // console.log("\n")
      // console.log("-------------")
    });
  });
  // // console.log(snapshot.val());
});

// var ref = new Firebase("https://quillconnect.firebaseio.com/sessions");
// ref.orderByChild("lessonID").startAt('-KGTdJwVUlyGLMIO-HKp').endAt('-KGTdJwVUlyGLMIO-HKp').on("value", function(snapshot) {
//   // console.log(snapshot.val());
// });
