'use strict';

var TestUtils = React.addons.TestUtils;

describe('ConceptResultStats', function() {
  beforeEach(function() {
    this.conceptResults = [
      {
        concept: {
          name: 'Foobar'
        },
        metadata: {
          correct: 1
        }
      },
      {
        concept: {
          name: 'Foobar'
        },
        metadata: {
          correct: 0
        }
      }
    ];

    this.component = TestUtils.renderIntoDocument(
      <EC.ConceptResultStats results={this.conceptResults} />
    );

    this.node = this.component.getDOMNode();
  });

  it('renders', function () {
    expect(this.component).to.be.ok();
  });

  it('calculates statistics for the set of concept results', function () {
    // This is kind of a janky way of testing this because it relies on the child component.
    expect($(this.node).find('.correct-answer').text()).to.equal('1');
    expect($(this.node).find('.incorrect-answer').text()).to.equal('1');
  });
});