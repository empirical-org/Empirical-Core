'use strict';

var TestUtils = React.addons.TestUtils;

describe('ConceptResultStat', function() {
  beforeEach(function() {
    this.conceptStat = {
        name: 'Foobar',
        correct: 5,
        incorrect: 7
    };

    this.component = TestUtils.renderIntoDocument(
      <EC.ConceptResultStat name={this.conceptStat.name}
                            correct={this.conceptStat.correct}
                            incorrect={this.conceptStat.incorrect} />
    );
  });

  it('renders', function () {
    expect(this.component).to.be.ok();
  });
});