# Co-Teachers Documentation.
Co-teaching allows multiple teachers to manage one classroom. It entails an invitation stage, at which point the invitee receives an email notifying them of the invitation and can accept or reject an invitation.

## Co-teaching
Teachers are associated with a classroom through the `ClassroomsTeacher` table. This has three columns: `classroom_id`, `user_id`, and `role` (`"owner"` or `"coteacher"`).

There are a number of helper methods for accessing a teachers related classrooms and colleagues in the `teacher.rb` doc. There are also several auth methods in `quill_authentication.rb` to verify that the current user has access to a specific classroom.

When a new `ClassroomsTeacher` row is created, callbacks destroy the classrooms_minis cache so when a user revisits their dashboard it will pull in the new list of classrooms which they have access to.

### Co-Teacher Permissions
At the data base level, a classroom co-teacher, (defined by their column in the `ClassroomsTeacher` table having `role: 'coteacher'`) can do anything the classroom owner (`role: 'owner'`) can do. However, through the UI and controller auth methods, we prohibit them from taking several actions.

A coteacher cannot:
- archive a classroom they do not own.
- remove students from a classroom they do not own.
- add new activities to a unit they did not create.

## Coteacher Classroom Invitations

The coteacher classroom invitations table is how we keep track of teachers being invited to coteach individual classrooms.

Each row represents an association between a single classroom and a single invitation (joined to the [invitations table](invitations.html) on invitation_id). The joined invitation tells us the inviter and invitee.

The CoteacherClassroomInvitation model has a before_save callback that will prevent an invitation from being created if the user already has a classrooms teacher relationship. It also has an after_commit callback that will archive the associated Invitation if all of the associated coteacher classroom invitations have been accepted or declined.
