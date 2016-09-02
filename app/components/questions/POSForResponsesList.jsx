import React from 'react'
import Response from './response.jsx'
import _ from 'underscore'
import keysForPOS from './POSIndex.jsx'

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

    return _.map(posTagsList, (tag) => {
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
      const headerStyle = {"borderColor": "black"}
      const contentStyle = {"marginBottom": "0px"}
      return (
        <header className={"card-content " + bgColor} style={headerStyle}>
          <div className="content">
            <div className="media">
              <div className="media-content" style={contentStyle}>
                <p>{tagsToRender.join("---")}</p>
                <p>{tag.responses[0].text}</p>
              </div>
              <div className="media-right">
                <figure className="image is-32x32">
                  <p>{icon} {tag.count===undefined ? 0 : tag.count}</p>
                  <p>{tag.responses[0].count===undefined ? 0 : tag.responses[0].count}</p>
                </figure>
              </div>
            </div>
          </div>
        </header>
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
