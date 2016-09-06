import React from 'react'
import Response from './response.jsx'
import _ from 'underscore'
import keysForPOS from './POSIndex.jsx'
import POSForResponse from './POSForResponse.jsx'

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

  sortResponses: function(posTagsList) {
    _.each(posTagsList, (tag) => {
      tag.responses.sort((a,b) => {
        return b.count-a.count
      })
    })
    return posTagsList
  },

  renderPOSTagsList: function() {
    var posTagsList = this.sortResponses(this.getPOSTagsList())

    return _.map(posTagsList, (tag, index) => {
      var bgColor;
      var icon;
      if (!tag.responses[0].feedback) {
        bgColor = "not-found-response";
      } else if (!!tag.responses[0].parentID) {
        // var parentResponse = this.props.getResponse(tag.responses[0].parentID)
        bgColor = "algorithm-sub-optimal-response";
      } else {
        bgColor = (tag.responses[0].optimal ? "human-optimal-response" : "human-sub-optimal-response");
      }
      if (tag.responses[0].weak) {
        icon = "⚠️";
      }

      var tagsToRender = [];
      const posTagKeys = keysForPOS()

      tag.tags.forEach((index) => {
        tagsToRender.push(posTagKeys[index])
      })

      var headerStyle = {
        "padding": "10px 20px",
        "borderBottom": "0.2px solid #e6e6e6"
      }
      const contentStyle = {"marginBottom": "0px"}

      return (
        <POSForResponse bgColor={bgColor} headerStyle={headerStyle} contentStyle={contentStyle} tagsToRender={tagsToRender}
                        tag={tag} icon={icon} />
      )
    })
  },

  render: function () {
    // console.log(this.renderPOSTagsList())
    const style = {
      "borderTop": "0.2px solid #e6e6e6",
      "borderLeft": "0.2px solid #e6e6e6",
      "borderRight": "0.2px solid #e6e6e6",
    }
    return (
      <div style={style}>
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
