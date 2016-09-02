import React from 'react'
import Response from './response.jsx'
import _ from 'underscore'

export default React.createClass({

  getPOSTagsList: function() {
    const responses = this.props.responses;
    var posTagsList = {}, posTagsAsString = ""
    responses.forEach((response) => {
      posTagsAsString = response.posTags.join()
      if(posTagsList[posTagsAsString]) {
        posTagsList[posTagsAsString].count += response.count
        posTagsList[posTagsAsString].responses.push(response)
      } else {
        posTagsList[posTagsAsString] = {
          tags: response.posTags,
          count: response.count,
          responses: [
            response
          ]
        }
      }
    })
    return posTagsList
  },

  renderPOSTagsList: function() {
    var posTagsList = this.getPOSTagsList()
    _.each(posTagsList, (tag) => {
      tag.responses.sort((a,b) => {
        return b.count-a.count
      })
    })
    return _.map(posTagsList, (tag) => {
      return (
        <div>
          {tag.tags.join("; ")} {"Hits: " + (tag.count===undefined? 0 : tag.count)}
          <br />
          {"Most common response: "}
          {tag.responses[0].text} {"Hits: " + (tag.responses[0].count===undefined ? 0 : tag.responses[0].count)}
          <br />
          <br />
        </div>
      )
    })
  },

  render: function () {
    // console.log(this.renderPOSTagsList())
    return (
      <div>
        {this.renderPOSTagsList()}
      </div>
    )
  }
})

// var responseListItems = this.props.responses.map((resp) => {
//   if (resp) {
//     return (
//       <Response
//       response={resp}
//       responses={this.props.responses}
//       getResponse={this.props.getResponse}
//       getChildResponses={this.props.getChildResponses}
//       states={this.props.states}
//       state={this.props.states[this.props.questionID]}
//       questionID={this.props.questionID}
//       dispatch={this.props.dispatch}
//       key={resp.key}
//       readOnly={this.props.admin}
//       allExpanded={this.props.expanded}
//       expanded={this.props.expanded[resp.key]}
//       expand={this.props.expand}
//       getMatchingResponse={this.props.getMatchingResponse}
//       showPathways={this.props.showPathways}
//       printPathways={this.props.printPathways}
//       toPathways={this.props.toPathways}
//       conceptsFeedback={this.props.conceptsFeedback}
//       mode={this.props.mode}
//       concepts={this.props.concepts} />
//   )}
// })
// if (this.props.ascending) {
//   return (
//     <div>
//       {responseListItems}
//     </div>
//   );
// } else {
//   return (
//     <div>
//       {responseListItems.reverse()}
//     </div>
//   );
// }
