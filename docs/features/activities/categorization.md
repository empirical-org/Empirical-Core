# Activity Categorization

There are multiple ways to organize activities on Quill. Activities themselves are agnostic to their order, but they are often organized by means of order numbers on related tables. In addition, they are organized within the groupings of units and unit templates. For the purposes of this doc, these are designated by "organized by" (where another table is used to order activities) and "organized within".

## Organized By
### Activity Classifications
Each activity has an activity_classification_id attribute, which links it to one of the activity classifications (roughly equivalent to each of the Quill tools). These activity classifications, in turn, have order numbers on them which are sometimes used to provide a rough order for the sequence in which activities appear around the site. For instance, if activity A is linked to an activity classification with order number 3, but activity B is linked to an activity classification with order number 1, B will appear before A on lists organized this way.

This is the broadest level of organization used in the default order for the Activity Search.

### Activity Categories

Activity categories comprise broad categories of activities, spanning activity classifications. Some example activity categories include "Parallel Structure", "Capitalization", and "Science: Geology". These have order numbers attached to them. They are joined to activities through the join table `activity category activities`, which also have an order number attribute. Activity category activities also have an activity_id attribute, which joins them to activities directly and activity categories to activities indirectly. The activity category activity order number is used to organize activities within an activity category. For instance, if activity category activities A, B, and C have order numbers 1, 2, and 3 respectively, but A and C belong to an activity category with order number 2 while B belongs to an activity category with order number 1, their related activities will appear in the order B, A, C.

This is the secondary and tertiary level of organization used in the default order for the Activity Search.

### Standards, Standard Levels, and Standard Categories
Standards correlate roughly to Common Core standards. Each activity has a standard, to which it is joined through the standard_id on the activity table. These are used to sort activities on the Common Core Standards report. They are commonly referred to as 'Standards' on the front end.

Each standard has a standard level, which roughly correlates to the Common Core Grade Level standards. Standards are joined with standard levels through the standard_level_id attribute on the standard table. They appear as a column on the Activity Search, although are not used in the default sorting order.

Standards also have standard categories, which are rough groupings of activities which overlap in some, but not all, places with Activity Categories. They are joined by the standard_category_id attribute on the standards table. These are no longer used to sort activities.

## Organized Within
### Units
Activities are organized in units in the order that they were added to the unit.

#### Reorganization
Activities can only be reordered in a unit if a teacher removes the activities and then manually re-added  in the correct order.

### Unit Templates
Activities are organized in unit templates, per a getter method on the Unit Template model, by activity category order number and then activity category order number.

> This is also the order that the activities will be in within a unit created from this unit template.

#### Reorganization
Activities can be reorganized in unit templates by changing their activity category's order number and their activity category activity order number, but this will also impact everywhere else that these are used.
