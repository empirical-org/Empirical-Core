# Reports Overview
Reports consolidate all available data we have about a teacher's students. Some reports are freely available to all users, while others are only for premium users.


## Premium Reports
When a report is only available to premium users, we blur out the parts that are to be hidden, thereby hopefully enticing the user to upgrade. This blur is accomplished with the class `.non-premium-blur`.

## Report Table Conventions
For sortable, highly customizable tables, we use the ReactTable library. This is a very (perhaps overly) full featured library which makes it extremely easy to create tables.

These docs will focus on the parts of ReactTable that are unique to Quill, and presuppose that for the columns, data, etc.. you will look at the ReactTable docs (https://react-table.js.org)

Below is an example of a Quill ReactTable with props:

``` <ReactTable data={filteredClassroomsData}
    columns={this.columns()}
    showPagination={false}
    defaultSorted={[{id: 'last_active', desc: true}]}
    showPaginationTop={false}
    showPaginationBottom={false}
    showPageSizeOptions={false}
    defaultPageSize={Math.min(filteredClassroomsData.length)}
    className='progress-report has-green-arrow'/>
    ```

`showPagination` (top and/or bottom): this can be true or false, depending on how long the table is. If true, be sure to include a defaultPageSize of `Math.min(dataRows.length, 25)` so that there will not be excess rows on the bottom.

`defaultSorted`: generally this is by name or score, but it can be anything.

`className`: use `progress-report` for progress reports. This will automatically give the green hover styling.

## Download CSV Conventions
Teachers often want exportable data, so we offer them CSV's via react-csv (https://www.npmjs.com/package/react-csv). This is only available to teachers who have premium subscriptions, however, we show the option to all and then give them an alert saying they'll need to upgrade to use it.

## The Different Reports
All reports are viewable from quill.org/teachers/progress_reports/landing_page if you log in as a teacher with students that have completed activities.

### Activity Summary
quill.org/teachers/classrooms/scorebook

A top level report, organized by class. This shows each student's highest score per classroom activity, along with metadata such as activity type and completion status. Clicking on a completed activity will bring the user to an activity analysis.


### Activity Analysis
quill.org/teachers/progress_reports/diagnostic_reports#/u/unit-id/a/activity-id/c/classroom-id/student_report/user-id

This report gives a detailed breakdown of a specific activity from a specific unit per specific student in a specific classroom. All of this information is passed through the URL.

The activity analysis logs total score, along with each individual attempt and feedback served to the student.


### Diagnostics
quill.org/teachers/progress_reports/diagnostic_reports/#/diagnostics

This simply shows all diagnostics that have been assigned to the teacher's classrooms. Clicking on one brings the teacher to a breakdown of the student overview for the activity.

### Diagnostic Students
quill.org/teachers/progress_reports/diagnostic_reports#/u/unit-id/a/activity-id/c/classroom-id/students?_k=k74k4t

Gives a breakdown of each students performance on a specific diagnostic, including their score, questions answered, and total time.

### Activity Scores By Classroom
Allows the teacher to view the overall average score for each student in an active classroom. If they click on an individual student to view their scores by activity pack and activity. Most of this is blurred out for non-premium users.

### List Overview
quill.org/teachers/progress_reports/activity_sessions

View all of the activities teacher's students have completed. Can be filtered by classroom, unit, or student.

### Concept Results
quill.org/teachers/progress_reports/concepts/students

Each time a student correctly demonstrates a concept or creates an error, Quill generates a concept result. This report provides an aggregate picture of student progress on each concept. Parts of this are blurred out for non-premium users.

### Standards Report
quill.org/teachers/progress_reports/standards/classrooms

User can filter by classroom and student to see student mastery on the Common Core standards.

### Data Export
quill.org/teachers/progress_reports/activity_sessions

Shows each students performance across all activity packs and activities
