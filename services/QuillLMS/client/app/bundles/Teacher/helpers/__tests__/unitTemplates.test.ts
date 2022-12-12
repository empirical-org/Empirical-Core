import { renderActivityPackTooltipElement, renderPreviouslyAssignedActivitiesTooltipElement } from '../unitTemplates';

const data1 = {
  activities: [
    {
      name: 'Activity One',
      readability: '4th-6th',
      classification: {
        name: 'Quill Connect'
      }
    },
    {
      name: 'Activity Two',
      readability: '4th-6th',
      classification: {
        name: 'Quill Grammar'
      }
    }
  ]
}

const data2 = [
  {
    name: 'Unit 1',
    assigned_date: '2021-04-05T20:43:27.698Z',
    classrooms: ['Class One'],
    students: [
      {
        assigned_student_count: 3,
        total_student_count: 5
      }
    ]
  },
  {
    name: 'Unit 2',
    assigned_date: '2021-12-06T20:43:27.698Z',
    classrooms: ['Class One, Class Two'],
    students: [
      {
        assigned_student_count: 3,
        total_student_count: 5
      },
      {
        assigned_student_count: 1,
        total_student_count: 5
      }
    ]
  },
]

describe('Unit Templates helper functions', () => {

  describe('#renderActivityPackTooltipElement', () => {
    it('should render the expected activity details', () => {
      const tooltipElementString = renderActivityPackTooltipElement(data1);
      const containsActivityName = tooltipElementString.includes('Activity One') && tooltipElementString.includes('Activity Two');
      const containsActivityReadability = tooltipElementString.includes('4th-6th') && tooltipElementString.includes('4th-6th');
      const containsActivityClassification = tooltipElementString.includes('Quill Connect') && tooltipElementString.includes('Quill Grammar');
      expect(containsActivityName).toBeTruthy();
      expect(containsActivityReadability).toBeTruthy();
      expect(containsActivityClassification).toBeTruthy();
    })
  });
  describe('#renderPreviouslyAssignedActivitiesTooltipElement', () => {
    it('should render the expected activity details', () => {
      const tooltipElementString = renderPreviouslyAssignedActivitiesTooltipElement(data2);
      const containsUnitName = tooltipElementString.includes('Unit 1') && tooltipElementString.includes('Unit 2');
      const containsAssignedDate = tooltipElementString.includes('12/06/21');
      const containsClasses = tooltipElementString.includes('Class One') && tooltipElementString.includes('Class Two');
      const containsAssignedCount = tooltipElementString.includes('3/5 students') && tooltipElementString.includes('1/5 students');
      expect(containsUnitName).toBeTruthy();
      expect(containsAssignedDate).toBeTruthy();
      expect(containsClasses).toBeTruthy();
      expect(containsAssignedCount).toBeTruthy();
    })
  });
});
