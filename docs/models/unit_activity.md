# Unit Activity

## Columns

### order_number
Type: Integer
Nullable: True

This column was added to support manually-assigned sort orders of activities within a unit.  This allows teachers to drag and drop activities into different orders if they decide that they want students to encounter them in a specific order.

Note that logic was also added to the Student API to respect this sort order when returning activities for students to undertake next.
