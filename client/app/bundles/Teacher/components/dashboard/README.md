#Teacher Dashboard

The teacher dashboard is the first page that teachers are presented with after completing the onboarding workflow. The front-end is entirely in React, and relies primarily on the ```ClassroomManagerController``` (```app/controllers/teachers/classroom_manager_controller.rb```).

See the demo dashboard here [http://www.quill.org/demo?name=demoaccount]

Each of the sections is detailed in the order it is presented.


## Performance Overview

The first section provides an overview of the teachers lowest performing students, along with the most difficult concepts. The queries for this come from ```app/queries/dashboard.rb``` and the title and table fields are passed back as JSON, then constructed in ```overview_min.jsx```.

One function of note is ```miniSpecificButton```, which will parse the header for ```"concept"``` or ```"student"``` and based on this, provide a button that leads to the relevant concept result section.

If a teacher's students have completed fewer than 30 activities, the minis will present static images informing them of such.

If a teacher does not have premium or a premium trial, and never has before, then there will be a mini (```EC.PremiumMini```) inviting them to activate their free trial. Clicking the button here triggers the ```beginTrial``` function, which sends a post request beginning the user's 30 day trial.


## My Classes

This section provides information about each of the current user's classrooms, along with a link to the relevant classroom manager.


### EC.MyClasses
```EC.MyClasses``` has one ```prop```, ```classList```, which is pulled from the server via an AJAX request in ```dashboard.jsx```.

It maps ```this.prop.classList```, and returns an ```EC.ClassMini``` object for each element in the array.

### EC.ClassMini

This is where the actual mini tiles are constructed. The ```classroomSpecificButton``` function determines what the call to action is. Each mini also has a gear icon linking to the relevant "Manage Classroom" page.

The final mini is a button to add a new classroom. Similar styling is also used for creating custom activity packs on the activity packs page.

## My Resources

A section for miscellaneous minis.
