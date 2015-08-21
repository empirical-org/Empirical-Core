'use strict';

describe('ActivityIconWithTooltip', function() {
  it('works', function() {
    var data = {
      percentage: 100,
      activity: {
        classification: {},
        topic: {
          section: {
            name: 'Foobar'
          }
        }
      },
    };

    React.addons.TestUtils.renderIntoDocument(
      <EC.ActivityIconWithTooltip data={data}/>
    );

    expect(true).to.be(true);
  });
});