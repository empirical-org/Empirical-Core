'use strict'
EC.StudentResultsTables = React.createClass({

    mapResults: function(results) {
        var that = this;
        var section = results.map(function(result) {
            return (
                <tr key={result.conceptId}>
                    <td>
                        {result.conceptName}
                    </td>
                    <td>
                        {that.displayImages(result.correctCount, 'correct')}
                        {that.displayImages(result.incorrectCount, 'incorrect')}
                    </td>
                </tr>
            );
        });
        return section
    },

    correct: function() {
        return (
            <div className="circle">
                <div className="inner-circle"></div>
            </div>
        );
    },

    incorrect: function() {
        return (
            <div className="circle circle-red"></div>
        );
    },

    displayImages: function(num, type) {
        var feedback = type === 'correct' ? this.correct() : this.incorrect();
        var shapes = [];
        for (var i = 0; i < num; i++) {
            shapes.push(feedback);
        }
        return (
            <span>{shapes}</span>
        );
    },

    score: function(result) {
        var correct = result.reduce(function(prev, curr) {
            return prev.correctCount + curr.correctCount;
        });
        var total = result.reduce(function(prev, curr) {
            return (prev.correctCount + prev.incorrectCount) + (curr.correctCount + curr.incorrectCount);
        });
        return <span className='pull-right'>{correct} of {total} Errors Found</span>
    },

    tableBuilder: function(data, name) {
        return (
            <div>
              <div className='container'>
                <span className='pull-left'>{name}</span>
                <span className='pull-right'>{this.score(data)}</span>
              </div>
                <table className='table quill-table'>
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.mapResults(data)}
                    </tbody>
                </table>
            </div>
        )
    },

    render: function() {
        return (
            <div id='results-table-section'>
              <div className='container key'>
                <div className='pull-left'>Results</div>
                            <div className='pull-right'>
                                <div>{this.correct()}<span className='key-div'>Correct</span></div>
                                <div>{this.incorrect()}<span className='key-div'>Incorrect</span></div>
                              </div>
              </div>
                {this.tableBuilder(this.props.results.story, 'Passage Proofreading')}
                {this.tableBuilder(this.props.results.sentence, 'Sentence Writing')}
            </div>
        );
    }

});
