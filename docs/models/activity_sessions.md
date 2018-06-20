# ActivitySession

## Columns

#### id
Description Goes Here

Type: Fixnum

Example: 1

Defaults To:

Allowed Values:

#### classroom_activity_id
Description Goes Here

Type: Fixnum

Example: 1

Defaults To:

Allowed Values:

#### activity_id
Description Goes Here

Type: Fixnum

Example: 1

Defaults To:

Allowed Values:

#### user_id
Description Goes Here

Type: Fixnum

Example: 165

Defaults To:

Allowed Values:

#### pairing_id
Description Goes Here

Type: String

Example: Vm-aqy_L2GtADiUM1SKWsw

Defaults To:

Allowed Values:

#### percentage
Description Goes Here

Type: NilClass

Example:

Defaults To:

Allowed Values:

#### state
Description Goes Here

Type: String

Example: started

Defaults To:

Allowed Values:

#### completed_at
Description Goes Here

Type: NilClass

Example:

Defaults To:

Allowed Values:

#### uid
Description Goes Here

Type: String

Example: IhBwKH9i0Ll8wfjnNTxQtQ

Defaults To:

Allowed Values:

#### temporary
Description Goes Here

Type: FalseClass

Example: false

Defaults To:

Allowed Values:

#### data
Description Goes Here

Type: Hash

Example:

Defaults To:

Allowed Values:

#### created_at
Description Goes Here

Type: ActiveSupport::TimeWithZone

Example: 2013-10-08 19:59:44 UTC

Defaults To:

Allowed Values:

#### updated_at
Description Goes Here

Type: ActiveSupport::TimeWithZone

Example: 2013-10-08 19:59:44 UTC

Defaults To:

Allowed Values:

#### started_at
Description Goes Here

Type: ActiveSupport::TimeWithZone

Example: 2013-10-08 19:59:44 UTC

Defaults To:

Allowed Values:

#### is_retry
Description Goes Here

Type: FalseClass

Example: false

Defaults To:

Allowed Values:

#### is_final_score
Description Goes Here

Type: FalseClass

Example: false

Defaults To:

Allowed Values:

#### visible
Description Goes Here

Type: TrueClass

Example: true

Defaults To:

Allowed Values:



## Relations

belongs_to => classroom_activities

belongs_to => activities

has_one => units through classroom_activity

has_many => concept_results

has_many => concepts through concept_results

belongs_to => users => nil