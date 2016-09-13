var Firebase = require('firebase');
var _ = require('lodash');
var underscore = require('underscore');
var jsDiff = require('diff');
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

// console.log("LessonID\tStudentID\tQuestionID\tPrompt\tTop Optimal Answer\tOptimal Edits\tAttempt 1\tFeedback 1\tGrade 1\tEdits 1\tEdits to Optimal 1\tAttempt 2\tFeedback 2\tGrade 2\tEdits 2\tEdits to Optimal 2\tAttempt 3\tFeedback 3\tGrade 3\tEdits 3\tEdits to Optimal 3")
var lessonsRef = new Firebase("https://quillconnect.firebaseio.com/lessons");
lessonsRef.on("value", function(snapshot) {
  _.each(hashToCollection(snapshot.val()), function (value) {
    var ref = new Firebase("https://quillconnect.firebaseio.com/sessions");
    ref.orderByChild("lessonID").startAt(value.key).endAt(value.key).on("value", function(snapshot) {
      // // console.log(value.name);
      _.each(hashToCollection(snapshot.val()), function (studentValue) {

        // // console.log(studentValue.name);
        // // console.log("LessonID\tStudentID\tQuestionID\tPrompt\tAttempt 1\tFeedback 1\tGrade 1\tEdits 1\tAttempt 2\tFeedback 2\tGrade 2\tEdits 2\tAttempt 3\tFeedback 3\tGrade 3\tEdits 3")
        _.each(studentValue.questions, function (question) {
          var optimal = getTopOptimalResponse(question.responses)
          var string = value.key + "\t"
                     + studentValue.key + "\t"
                     + question.key + "\t"
                     + question.prompt + "\t"
                     + optimal + "\t"
                     + applyDiff(optimal, question.prompt)
          _.each(question.attempts, function (attempt, index) {
            var diffs = "";
            if (index === 0) {
              diffs = applyDiff(attempt.submitted, question.prompt)
            } else {
              diffs = applyDiff(attempt.submitted, question.attempts[index -1].submitted)
            }
            string += '\t' + attempt.submitted
                   + '\t' + ((attempt.response && (attempt.response.feedback != undefined)) ? attempt.response.feedback : '') + '\t'
                   + (attempt.response ? attempt.response.optimal : '') + "\t"
                   + diffs + "\t"
                   + applyDiff(optimal, attempt.submitted)
            // // console.log(attempt)
          })
          _.times((3 - question.attempts.length), function (n) {
            string += "\t\t\t\t\t"
          })
          // console.log(string)
        })
      })
      // // console.log("\n")
      // // console.log("-------------")
    });
  });
  // // console.log(snapshot.val());
});

function getTopOptimalResponse (responses) {
  return underscore.chain(responses)
          .where({optimal: true})
          .sortBy("count")
          .last().value().text
}

// var ref = new Firebase("https://quillconnect.firebaseio.com/sessions");
// ref.orderByChild("lessonID").startAt('-KGTdJwVUlyGLMIO-HKp').endAt('-KGTdJwVUlyGLMIO-HKp').on("value", function(snapshot) {
//   // console.log(snapshot.val());
// });

function applyDiff (answer, response) {
  answer = answer || '';
  response = response || '';

  var diff = jsDiff.diffWords(response, answer);
  var spans = diff.map(function (part) {
    var openingTag = '';
    var closingTag = '';
    if (part.added) {
      openingTag = "<ins>";
      closingTag = "</ins>";
    }
    if (part.removed) {
      openingTag = "<del>";
      closingTag = "</del>";
    }
    return openingTag + part.value + closingTag;
  });
  return spans.join('');
}
