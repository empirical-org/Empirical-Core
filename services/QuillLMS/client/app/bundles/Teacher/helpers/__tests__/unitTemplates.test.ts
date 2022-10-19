import { renderActivityPackTooltipElement } from '../unitTemplates';

const data = {
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

describe('Unit Templates helper functions', () => {

  describe('#renderActivityPackTooltipElement', () => {
    it('should render the expected activity details', () => {
      const tooltipElementString = renderActivityPackTooltipElement(data);
      const containsActivityName = tooltipElementString.includes('Activity One') && tooltipElementString.includes('Activity Two');
      const containsActivityReadability = tooltipElementString.includes('4th-6th') && tooltipElementString.includes('4th-6th');
      const containsActivityClassification = tooltipElementString.includes('Quill Connect') && tooltipElementString.includes('Quill Grammar');
      expect(containsActivityName).toBeTruthy();
      expect(containsActivityReadability).toBeTruthy();
      expect(containsActivityClassification).toBeTruthy();
    })
  });
});
