'use strict';

var TestUtils = React.addons.TestUtils;

describe('ActivityIconWithTooltip', function() {
  beforeEach(function() {
    this.data = {
      percentage: 1,
      due_date_or_completed_at_date: '8/21/2015',
      activity: {
        name: 'Activity Name',
        description: 'Activity Description',
        classification: {
          alias: 'Classification Name'
        },
        topic: {
          name: 'Topic Name',
          section: {
            name: 'Section Name'
          },
          topic_category: {
            name: 'Topic Category Name'
          }
        }
      },
      concept_results: []
    };

    this.component = TestUtils.renderIntoDocument(
      <EC.ActivityIconWithTooltip data={this.data}/>
    );
  });

  it('exists', function() {
    expect(this.component).to.be.ok();
  });

  describe('the tooltip popover', function () {
    beforeEach(function () {
      this.node = this.component.refs.activateTooltip.getDOMNode();
      this.tooltipMarkup = $(this.node).data()['bs.tooltip'].options.title;
    });

    it('includes the activity name', function () {
      expect(this.tooltipMarkup).to.contain('Activity Name');
    });

    it('includes the activity classification name', function () {
      expect(this.tooltipMarkup).to.contain('Classification Name');
    });

    it('includes the section name', function () {
      expect(this.tooltipMarkup).to.contain('Section Name');
    });

    it('includes the topic name', function () {
      expect(this.tooltipMarkup).to.contain('Topic Name');
    });

    it('includes the activity description', function () {
      expect(this.tooltipMarkup).to.contain('Activity Description');
    });

    it('includes the topic category name', function () {
      expect(this.tooltipMarkup).to.contain('Topic Category Name');
    });

    it('includes the score', function () {
      expect(this.tooltipMarkup).to.contain('100%');
    });

    it('includes the completion date', function () {
      expect(this.tooltipMarkup).to.contain('8/21/2015');
    });
  });
});