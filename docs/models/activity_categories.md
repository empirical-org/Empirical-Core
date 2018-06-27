# ActivityCategory

## Columns

#### id
Description Goes Here

Type: Fixnum

Example: 1

Defaults To:

Allowed Values:

#### name
Description Goes Here

Type: String

Example: Determiners

Defaults To:

Allowed Values:

#### order_number
Description Goes Here

Type: Fixnum

Example: 1

Defaults To:

Allowed Values:

#### created_at
Description Goes Here

Type: ActiveSupport::TimeWithZone

Example: 2017-09-18 15:53:05 UTC

Defaults To:

Allowed Values:

#### updated_at
Description Goes Here

Type: ActiveSupport::TimeWithZone

Example: 2017-09-19 16:07:53 UTC

Defaults To:

Allowed Values:



## Relations

has_many => activity_category_activities

has_many => activities through activity_category_activities