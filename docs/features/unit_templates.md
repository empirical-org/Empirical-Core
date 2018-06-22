# Unit Templates

Unit templates, also known as featured activity packs on the front end, are collections of activities that Quill staff and volunteer teacher contributors have created. They can be bulk-assigned, saving teachers that are new to Quill the effort of looking through all of our activities and deciding what should comprise a unit (activity pack) for their students.

## Ordering and Grouping

Each unit template has an order number assigned to it, which dictates the order in which it appears on the featured activity packs page.

In addition, all unit templates are grouped into categories, known as unit_template_categories on the back end. These are joined through the unit_template_category_id on the unit_template table. As of 11/1/17, these categories are: ELL, Elementary, Middle, High, University, Themed, and Diagnostic. Teachers can filter by any of the first four on the Featured Activity Packs page on Quill. For the "Related Activity Packs" section of the Featured Activity Pack profile page, other unit templates in the same unit template category are shown.

## Flagging

Unit templates also have a flag attribute, which is used to scope their visibility to users who have the same or higher-access flags. For instance, a unit template with a beta flag is visible to users with alpha (higher-access) and beta (same access) flags, but not to a user with a production flag.

## Assigning a Unit Template
See [Assigning A Unit Template](assigning_a_unit_template.md)

## Creating a Unit Template
See [Activity Packs Editor](activity_packs_editor.md)

## Editing a Unit Template
See [Activity Packs Editor](activity_packs_editor.md)
