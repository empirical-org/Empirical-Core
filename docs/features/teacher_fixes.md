# Teacher Fixes

Teacher fixes are located at <https://quill.org/teacher_fix>.

These pages are designed to fix issues that are frequently reported on Intercom for which no fix is currently available for the users to implement themselves.

## Unarchive Units
<https://quill.org/teacher_fix/unarchive_units>

Use when a teacher has purposefully or accidentally deleted an activity pack and wants it back.

All archived units are selected by default. Unarchiving a unit will also unarchive all of that unit's classroom activities and activity sessions.

If the input field for a unit name is outlined in red, that means that it shares a name with one of that teacher's visible units. If you are going to unarchive this unit, make sure you change the name. Appending a number to the unit's name is a good way to handle this.

## Restore Classroom Activities
<https://www.quill.org/teacher_fix/recover_classroom_activities>

Use this when a teacher has archived and then unarchived a classroom and wants their data back.

This method will unarchive all of the classroom activities and associated activity sessions for a given classroom, as well as any units (activity packs) that are associated with these classroom activities in the event that they have been hidden.

## Restore Activity Sessions
<https://www.quill.org/teacher_fix/recover_activity_sessions>

Use as a first line of defense when teachers complain about missing activity sessions, frequently seen with the diagnostic.

This method will unarchive all of the activity sessions for a given unit that may have been accidentally unassigned. The student ids from the unarchived activity sessions are pushed back into the classroom activity's assigned_student_ids array if they are absent.

## Merge Student Accounts
<https://www.quill.org/teacher_fix/merge_student_accounts>

This method will not work unless both students are in the same classroom, and the second student only belongs to this classroom. If you need help with a different case, ask a dev.

Also please note that this method will transfer all of the second student's activities to the first student's account. It will not, however, delete the second student's account or remove it from the classroom.

## Merge Teacher Accounts
<https://www.quill.org/teacher_fix/merge_teacher_accounts>

This method will transfer all of the first teacher's classrooms and created units to the second teacher.

Please note that it will not delete the first teacher's account, nor impact the second teacher's premium status or other account information.

## Move Student from One Class to Another
<https://www.quill.org/teacher_fix/move_student>

This method will transfer a student and their data from the class identified by class code 1 to the class identified by class code 2.

Please note that if the classes have different teachers, all of the student's activities in the second classroom will belong to a new unit that is separate from anything that teacher may have assigned to the rest of the class.

## Unsync User with Google Classroom
<https://www.quill.org/teacher_fix/google_unsync>

This method will sever an account's connection with Google Classroom, allowing them to log in normally.

The new email field is optional, and can be left blank if the user does not wish to change their email.
