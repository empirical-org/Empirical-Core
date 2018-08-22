# Integrating an External Activity

When a user begins an activity session they hit the `/activity_sessions/classroom_units/:classroom_unit_id/activities/:activity_id` (`#activity_session_from_classroom_unit_and_activity`) route. This either finds an existing started activity session, which is the case when a user is resuming an activity, or creates a new record in the database, when a user has either never started or already completed an activity. The user is then redirected to the `/activity_sessions/:activity_session_id/play` route.

The `ActivitySessionsController#play` function redirects the user to the activity page by building a URL from the activity model function `module_url` which calls `module_url_helper`. The `module_url_helper` function looks to the `ActivityClassification` model to fetch the `module_url` value so that it can build a URL for the user. The built URL has the structure `:ActivityClassification.module_url?uid=:Activity.uid&student=:ActivitySession.uid` for example: `grammar.quill.org/play/?uid=1234&student=abcd`.

- `:ActivityClassification.module_url` evaluates to `grammar.quill.org/play/`
- `uid=:Activity.uid` evaluates to `uid=1234`
- `student=:ActivitySession.uid` evaluates to `student=abcd`

Assuming the records in the database are:

ActivityClassification: `id: 1, module_url: "grammar.quill.org/play/"`

Activity: `id: 1, activity_classification_id: 1, uid: '1234'`

ActivitySession: `id: 1, activity_id: 1, uid: 'abcd'`

`Activities` belong to `ActivityClassifications` through `activity_classification_id` field on their model.

The page the the user is redirected to must be able to interpret the url by parsing the query parameters to load the appropriate lesson from the `uid` value,  and save to the appropriate `activity session` via `PUT` request to `/api/v1/activity_sessions/:student` when the activity is complete by using the `student` value from the parameters.

If the `student` value is not present, an anonymous session can be create by making a `POST` request to `/api/v1/activity_sessions/`.

## What do the `/api/v1/activity_sessions/` routes expect?

The activity session `PUT` and `POST` routes expect `JSON` in the following form.

```
{
  state: 'finished',
  activity_uid: :activitySessionUID,
  concept_results: :ArrayOfConceptResults,
  percentage: :FloatingPointValueBetween0-1,
}
```

where

- `state: 'finished'` update the activity to the completed state.
- `activity_uid` is the `uid` value from the query parameters
- `concept_results` is an array of objects representing concept measurement from the activity. This will be given in more detail later.
- `percentage` takes a floating point value between 0 and 1, representing the students percentage score.

# Questions
How can we improve this page?
