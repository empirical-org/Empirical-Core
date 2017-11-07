# Dashboard Cards

The teacher dashboard lists several cards which display or do not display depending on the teacher's use of Quill. Of the cards that display, several have different states. Below is a summary of the order of the cards, as well as the conditions around their being displayed.

## Position 1: Getting Started

Getting started guide renders if each item on the list has not been accomplished.

## Position 2: Diagnostic

There are three states for this card:

* The diagnostic has not been assigned
* The diagnostic has been assigned but not completed by anyone
* Someone has completed the diagnostic in the last seven days

If none of the above conditions are true (so one or more students have completed the diagnostic, but not in the last seven days), nothing renders.

## Position 3: Lessons

There are three states for this card:

* The teacher has never assigned a lesson and the diagnostic has not been completed
* The teacher has never assigned a lesson but the diagnostic has been completed
* The teacher has assigned lessons

## Position 4: Premium

There are two states for this card:

* The teacher has not done a trial, but has had a student complete at least one activity
* The teacher's trial has expired

If none of the above conditions are true (so no students have completed any activities, the teacher is in the middle of the trial, or the teacher has premium), nothing renders.

## Position 5:

Renders list of lowest performing students if students have completed at least thirty activities in total in the last thirty days. Otherwise, renders card explaining that.

## Position 6:

Renders list of difficult concepts if students have completed at least thirty activities in total in the last thirty days. Otherwise, renders card explaining that.

## Position 7:

If the user has a beta flag, renders card announcing that they have beta access.
