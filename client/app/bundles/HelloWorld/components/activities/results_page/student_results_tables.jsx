'use strict'
import React from 'react'

export default React.createClass({

    mapResults: function(results) {
        var that = this;
        var section = results.map(function(result) {
            if (result.correctCount + result.incorrectCount !== 0){
            return (
                <tr key={result.conceptId}>
                    <td className='left-column'>
                        {result.conceptName}
                    </td>
                    <td>
                        {that.displayImages(result.correctCount, 'correct')}
                        {that.displayImages(result.incorrectCount, 'incorrect')}
                    </td>
                </tr>
            );
        }
        });
        return section;
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
        var correct = result.reduce(function (prev, curr) {
               return prev + curr.correctCount;
           }, 0);
        var incorrect = result.reduce(function (prev, curr) {
               return prev + curr.incorrectCount;
           }, 0);
        return <span className='pull-right'>{correct} of {correct + incorrect} Errors Found</span>
    },

    tableBuilder: function(data, name) {
        return (
            <div>
              <div className='container table-meta-data'>
                <span className='pull-left'>{name}</span>
                <span className='pull-right'>{this.score(data)}</span>
              </div>
                <table className='table quill-table'>
                    <thead>
                        <tr>
                            <th className='left-column'>Question</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.mapResults(data)}
                    </tbody>
                </table>
            </div>
        );
    },

    resultTypes: function() {
      if (this.props.results.story && this.props.results.sentence) {
        return <div>
                    {this.tableBuilder(this.props.results.story, 'Passage Proofreading')}
                    {this.tableBuilder(this.props.results.sentence, 'Sentence Writing')}
                </div>
      } else if (this.props.results.story) {
        return this.tableBuilder(this.props.results.story, 'Passage Proofreading');
      } else {
        return this.tableBuilder(this.props.results.sentence, 'Sentence Writing');
      }
    },

    render: function() {
        return (
            <div id='results-table-section'>
              <div className='container key'>
                <div className='pull-left'>Results</div>
                <div className='pull-right'>
                    <div className='correct'>{this.correct()}<span className='key-div'>Correct</span></div>
                    <div>{this.incorrect()}<span className='key-div'>Incorrect</span></div>
                  </div>
              </div>
                {this.resultTypes()}
            </div>
        );
    }

});
