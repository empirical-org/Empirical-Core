'use strict'
EC.ResultsPage = React.createClass({

  mapResults: function(results, name) {
    console.log(this.props.results)
    var that = this
    var section = results.map(function(result) {
      return (
        <div key={result.conceptId}>
          {result.conceptName}
          {that.displayImages(result.correctCount, 'correct')}
          {that.displayImages(result.incorrectCount, 'incorrect')}
        </div>
       );
      }
    );
    return <div>
              <h3>{name}</h3>
              {section}
            </div>
  },

  displayImages: function(num, type) {
    var src = type == 'correct' ? 'O' : 'X'
    var x = ''
    for (var i = 0; i < num; i ++) {
      x =  x + src;
    }
    return <span>{x}</span>
  },

  score: function() {
    return <div>{this.props.score}</div>
  },

  headerMessage: function() {
    return (
      <div>
        <h1>Lesson Complete!</h1>
        <h3>You completed the activity: {this.props.activityName}</h3>
      </div>
      )
  },

  render: function() {
    return (
      <div>
        {this.score()}
        {this.headerMessage()}
        <div>
          <h3>Results</h3>
            {this.mapResults(this.props.results.story, 'Passage Proofreading')}
            {this.mapResults(this.props.results.sentence, 'Sentence Writing')}
        </div>
      </div>
    );
  }

  }
);
