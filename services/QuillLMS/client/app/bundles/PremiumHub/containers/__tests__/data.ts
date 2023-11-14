export const classrooms = [
  { "id": 1408989, "name": "AP English - Composition" },
  { "id": 1408990, "name": "Algebra II" },
  { "id": 1408991, "name": "Physics" },
  { "id": 1408992, "name": "U.S. History" },
  { "id": 1408993, "name": "Spanish III" }
];

export const teachers = [
  { "id": 14664732, "name": "Emily Acevedo" },
  { "id": 14664862, "name": "Tomi Adeyemi" },
  { "id": 14664863, "name": "Abdiel Acevedo" },
  { "id": 14664864, "name": "Jahari Acosta" },
  { "id": 14664865, "name": "Timothy Acosta" }
];

export const schools = [
  { "id": 82005, "name": "Douglass High School" },
  { "id": 176650, "name": "MLK Middle School" }
];

export const defaultFilterData = {
  "timeframes": [
    { "value": "today", "name": "Today", "default": true },
    { "value": "yesterday", "name": "Yesterday", "default": false },
    { "value": "last-7-days", "name": "Last 7 days", "default": false },
    { "value": "last-30-days", "name": "Last 30 days", "default": false },
    { "value": "this-month", "name": "This Month", "default": false },
    { "value": "last-month", "name": "Last Month", "default": false },
    { "value": "custom", "name": "Custom", "default": false }
  ],
  "schools": schools,
  "grades": [
    { "value": "Kindergarten", "name": "Kindergarten" },
    { "value": "1", "name": "1st" },
    { "value": "2", "name": "2nd" },
    { "value": "3", "name": "3rd" },
    { "value": "4", "name": "4th" },
    { "value": "5", "name": "5th" },
    { "value": "6", "name": "6th" },
    { "value": "7", "name": "7th" },
    { "value": "8", "name": "8th" },
    { "value": "9", "name": "9th" },
    { "value": "10", "name": "10th" },
    { "value": "11", "name": "11th" },
    { "value": "12", "name": "12th" }
  ],
  "teachers": teachers,
  "classrooms": classrooms,
  "all_teachers": teachers,
  "all_classrooms": classrooms,
  "all_schools": schools
};
