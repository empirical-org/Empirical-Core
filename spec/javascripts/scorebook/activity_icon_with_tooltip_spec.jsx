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
    };

    this.component = TestUtils.renderIntoDocument(
      <EC.ActivityIconWithTooltip data={this.data}/>
    );
  });

  it('exists', function() {
    expect(this.component).to.be.ok();
  });

  it('has a title containing all the necessary markup for the tooltip', function() {
    var domNode = this.component.refs.activateTooltip.getDOMNode();
    var title = $(domNode).data('original-title');
    expect(title).to.eql('<h1>Activity Name</h1><p>Classification Name</p><p>Section Name</p><p>Topic Name</p><p>Activity Description</p><p>Topic Category Name</p><p>100%</p><p>8/21/2015</p>');
  });
});