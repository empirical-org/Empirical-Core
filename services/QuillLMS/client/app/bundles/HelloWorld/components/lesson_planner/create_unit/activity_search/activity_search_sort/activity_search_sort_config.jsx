export default [
  {
    field: 'activity_category',
    alias: 'Concept',
    selected: false,
    asc_or_desc: 'asc',
    sortPath: 'activity_category.name',
  },
  {
    field: 'activity_classification_id',
    alias: 'Tool',
    selected: false,
    asc_or_desc: 'asc',
    sortPath: 'activity_classification.id',
  },
  {
    field: 'name',
    alias: 'Activity Name',
    selected: false,
    asc_or_desc: 'asc',
    sortPath: 'name',
  },
  {
    field: 'checked',
    alias: '',
    // asc_or_desc: 'asc',
    // sortPath: 'selected',
    className: 'scorebook-icon-check'
  }
];
