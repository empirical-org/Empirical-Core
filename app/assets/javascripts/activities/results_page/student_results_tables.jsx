'use strict'
EC.StudentResultsTables = React.createClass({

    mapResults: function(results, name) {
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

    displayImages: function(num, type) {
      var correct = function() {return (<div className="circle">
                                        <div className="inner-circle">
                                        </div>
                                      </div>
                                    );
                                  };
      var incorrect = function() {return (
                                    <div className="circle circle-red">
                                      </div>);
                                    };
        var feedback = type === 'correct' ? correct : incorrect;
        var x = [];
        for (var i = 0; i < num; i++) {
            x.push(feedback());
        }
        return (
            <span>{x}</span>
        );
    },

    tableBuilder: function(data, name) {
        return (
            <div>
                <span>{name}</span>
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
                <h3>Results</h3>
                {this.tableBuilder(this.props.results.story, 'Passage Proofreading')}
                {this.tableBuilder(this.props.results.sentence, 'Sentence Writing')}
            </div>
        );
    }

});
