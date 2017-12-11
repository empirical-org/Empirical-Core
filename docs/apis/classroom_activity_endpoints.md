# Classroom Activity Endpoints

## #student_names
GET `/api/v1/classroom_activities/:id/student_names`

Returns a hash of the names of students that have activity sessions for the classroom activity, with their activity session uids as keys.

## #teacher_and_classroom_name
GET `/api/v1/classroom_activities/:id/teacher_and_classroom_name`

Returns a hash with the following format, referring to the classroom of the classroom activity:
`{teacher: #{classroom owner name}, classroom: #{classroom name}}`

## #finish_lesson
PUT `/api/v1/classroom_activities/:id/finish_lesson`

Expects data in the following format: {
  follow_up: Boolean(whether or not there is a follow up lesson),
  concept_results: Array({
      concept_uid: String,
      question_type: String,
      metadata: {
        correct: Integer,
        directions: String,
        prompt: String|HTML,
        answer: String,
        attemptNumber: Integer,
        questionNumber: Integer
      },
      activity_session_uid: String
    })
}

<!-- "{\"follow_up\":true,\"concept_results\":[{\"concept_uid\":\"X37oyfiNxSphA34npOb-Ig\",\"question_type\":\"lessons-slide\",\"metadata\":{\"correct\":1,\"directions\":\"Combine the sentences using one of the joining words.\",\"prompt\":\"<p>The football star leaped toward the end zone.&nbsp;</p>\\n<p>He did not score a touchdown.</p>\",\"answer\":\"The football star leaped toward the end zone, but he did not score a touchdown.\",\"attemptNumber\":1,\"questionNumber\":1},\"activity_session_uid\":\"CzdnkJa649c3eZ-Ag8udAQ\"},{\"concept_uid\":\"X37oyfiNxSphA34npOb-Ig\",\"question_type\":\"lessons-slide\",\"metadata\":{\"correct\":1,\"directions\":\"Combine the sentences using a joining word.\",\"prompt\":\"<p>The quarterback was fast.&nbsp;</p>\\n<p>The other players couldn’t catch him.&nbsp;</p>\",\"answer\":\"The quarterback was fast, but the other players couldn't catch him.\",\"attemptNumber\":1,\"questionNumber\":2},\"activity_session_uid\":\"CzdnkJa649c3eZ-Ag8udAQ\"}]}" -->

## #pin_activity


## #unpin_and_lock_activity
