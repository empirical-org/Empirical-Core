# Activities Endpoints

It looks like the #update, #create, and #destroy are never being hit as of 12/11/2017. For this reason, only their routes will be included in this file.

## #show
GET `/api/v1/activities/:id`

Returns a hash with the following format:
`{activity: activity, meta: {status: 'success', message: nil, errors: nil}}`

## #update
PUT `/api/v1/activities/:id`

## #create
POST `/api/v1/activities`

## #destroy
DELETE `/api/v1/activities/:id`

## #follow_up_activity_name_and_supporting_info
GET `/api/v1/activities/:id/follow_up_activity_name_and_supporting_info`

Returns a hash with the following format, based on the attributes and associations of the activity with the id in the parameters:
`{
  follow_up_activity_name: String,
  supporting_info: String(URL)
}`

## #supporting_info
GET `/api/v1/activities/:id/supporting_info`

Returns a hash with the following format, based on the attributes and associations of the activity with the id in the parameters:
`{
  supporting_info: String(URL)
}`

## #uids_and_flags
GET `/api/v1/activities/uids_and_flags`

Returns a hash of hashes with the format `{flag: String(flag)}`, with activity uids as keys.

## #published_edition
POST `/api/v1/published_edition`

This method will find or create a UserObjective and UserMilestone for the objective 'Publish Customized Lesson' and the milestone 'Publish Customized Lesson'.

Returns an empty hash.
