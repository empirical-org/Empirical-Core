import * as React from 'react'

var TestUtils = React.addons.TestUtils;

describe('ConceptResultStat', function() {
  beforeEach(function() {
    this.conceptStat = {
        name: 'Foobar',
        correct: 5,
        incorrect: 7
    };

    this.component = TestUtils.renderIntoDocument(
      <EC.ConceptResultStat
        correct={this.conceptStat.correct}
        incorrect={this.conceptStat.incorrect}
        name={this.conceptStat.name}
      />
    );
  });

  it('renders', function () {
    expect(this.component).to.be.ok();
  });
});
