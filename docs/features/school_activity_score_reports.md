# School Wide Activity Score Reports

## Feature: School Dashboard Level Activity Scores Report
As a School Admin user

I want to view the activity scores of all students in the schools I administrate on one page

Because viewing them while impersonating a teacher is slow and limiting.

## Scenario: Viewing the activity scores of all students.
Given I'm logged in and I have administrator access to at least one school

When I go to the "School Dashboard" Tab

And I click on the "Activity Scores" link in the sub-sub-nav

Then I should be taken to a page that resembles the existing teacher Activity Scores report

And be able see Student name, activities completed, overal score, last active, school name, teacher name, class name, and a link to the student's activity scores report.

And then I should be able to filter the list by school, teacher, and classroom
