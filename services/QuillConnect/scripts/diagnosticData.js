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

// console.log("Name\tQ1\tQ2\tQ3\tQ4\tQ5\tQ6")
var lessonsRef = new Firebase("https://quillconnect.firebaseio.com/lessons");
lessonsRef.on("value", function(snapshot) {
  _.each(hashToCollection(snapshot.val()), function (value) {
    var ref = new Firebase("https://quillconnect.firebaseio.com/sessions");

    ref.orderByChild("lessonID").startAt(value.key).endAt(value.key).on("value", function(snapshot) {
      // console.log(value.name);
      _.each(hashToCollection(snapshot.val()), function (studentValue) {

        var string = ""
        string += studentValue.name
        _.each(studentValue.questions, function (question) {

          string += "\t" + question.attempts.length
          _.each(question.attempts, function (attempt) {
          })
          _.times((6 - studentValue.questions.length), function (n) {
            string += "\t"
          })

        })
        // console.log(string)
      })

    });
  });
  // // console.log(snapshot.val());
});

// var ref = new Firebase("https://quillconnect.firebaseio.com/sessions");
// ref.orderByChild("lessonID").startAt('-KGTdJwVUlyGLMIO-HKp').endAt('-KGTdJwVUlyGLMIO-HKp').on("value", function(snapshot) {
//   // console.log(snapshot.val());
// });
