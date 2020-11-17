# Activities

## Columns

#### id
The primary key for the table.

Type: integer

Example: 1


#### name
This is the name displayed to teacher and students.

Type: string

Example: Shackleton Returns from the Antarctic


#### description
This gives teacher and students extra information on the activity, and is normally displayed in a drop-down.

Type: text
Example: In the passage _Shackleton Returns from the Antarctic_ students must find and fix 9 errors in the text. Based on their performance they will be given Quill Grammar follow up activities to complete.

#### uid
This is the value passed to the external Quill App that represents the firebase endpoint that the activity data can be found at. The LMS uses this value and the activity_classification_id to build a link to the external apps activities.

Type: string

Example:  BaJi4-PhNRz9um-o0u-w6Q

#### data
deprecated

#### activity_classification_id
This indicates which App the activity belongs to. This allows us to show the correct tool-tips for the activities, allow teachers to filter in the pack creator, and render appropriate react components for App specific features on the LMS.

Type: integer

Example: 1

### standard_id
This allows us to categorize activities and align them to standards.

Type: integer

Example: 1

#### created_at
Managed by ActiveRecord and automatically set to time of row creation

Type: timestamp

Example: 2013-09-14 00:01:09.788782000 Z

#### updated_at
Managed by ActiveRecord and automatically set to the last time the row was updated.

Type: timestamp

Example: 2013-09-14 00:01:09.788782000 Z

#### flags
This allows us to hide content from certain users. This is useful for testing as it allows us to set a matching flag on a Users row and allow certain users to beta test new content. Archiving is better than deleting as it prevents content from being assigned, but still allows existing assignments to be completed and teachers can still view the reports.

Type: array[string]

Allowed Values: alpha, beta, production, archived

Example: ["production"]

Defaults To: ["alpha"]

#### repeatable
Some activities are not repeatable and this column helps us indicate that on the front end. This column may end up moving to the activity_classifications table when we decide if this is a classification wide value. Currently all Diagnostic and Lesson activities are non repeatable. Activities are only non-repeatable within a Unit.

Type: boolean

Example: true

Defaults To: true

#### follow_up_activity_id
Tools like Quill Lessons allow a teacher to assign a follow up activity to students. The presence of a value here indicates that the option to show the _assign follow up activity_ button to teachers.

Type: integer

Example: 2

Defaults To: nil

#### supporting_info
With Lessons we started providing additional information on how to deliver content to students. This value links to a file on our CDN. The url from this column should never be displayed on the frontend. We provide the route ```/activities/:id/supporting_info``` to redirect users to this value which allows us to avoid breaking links and to keep everything up to date.

Type: string

Example: https://assets.quill.org/supporting_info/teaching-commas.pdf

## Relations

has_and_belongs_to_many => unit_templates

belongs_to => activity_classifications

belongs_to => standards

has_one => standard level through standard

belongs_to => activities

has_many => unit_activities

has_many => units through unit_activities

has_many => unit_classrooms through units

has_many => classrooms through unit_classrooms

has_many => activity_category_activities

has_many => activity_categories through activity_category_activities
