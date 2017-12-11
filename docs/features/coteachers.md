# Co-Teachers Documentation.
Add docs here.

## Google Doc Spec
Here is an overview of how the co-teachers work. [Link](https://docs.google.com/document/d/1K7b7FhjmfrNouL8Re12B2NMUHOK7Kqt36-JZ2n4Fu2c/edit)

## Coteacher Classroom Invitations

The coteacher classroom invitations table is how we keep track of teachers being invited to coteach individual classrooms.

Each row represents an association between a single classroom and a single invitation (joined to the [invitations table](invitations.html) on invitation_id). The joined invitation tells us the inviter and invitee.

The CoteacherClassroomInvitation model has a before_save callback that will prevent an invitation from being created if the user already has a classrooms teacher relationship. It also has an after_commit callback that will archive the associated Invitation if all of the associated coteacher classroom invitations have been accepted or declined.
