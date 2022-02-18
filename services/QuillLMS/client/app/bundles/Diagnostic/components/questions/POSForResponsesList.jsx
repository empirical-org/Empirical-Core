import React from 'react'
import Response from './response.jsx'
import _ from 'underscore'
import keysForPOS from './POSIndex.jsx'
import POSForResponse from './POSForResponse.jsx'

export default class extends React.Component {
  // getPOSTagsList: function() {
  //   const responses = this.props.responses;
  //   var posTagsList = {}, posTagsAsString = ""
  //   responses.forEach((response) => {
  //     posTagsAsString = response.posTags.join()
  //     if(posTagsList[posTagsAsString]) {
  //       posTagsList[posTagsAsString].count += response.count
  //       posTagsList[posTagsAsString].responses.push(response)
  //     } else {
  //       posTagsList[posTagsAsString] = {
  //         tags: response.posTags,
  //         count: response.count,
  //         responses: [
  //           response
  //         ]
  //       }
  //     }
  //   })
  //   return posTagsList
  // },

  sortResponses = (posTagsList) => {
    _.each(posTagsList, (tag) => {
      tag.responses.sort((a,b) => {
        return b.count-a.count
      })
    })
    return posTagsList
  };

  renderPOSTagsList = () => {
    let posTagsList = this.sortResponses(this.props.posTagsList)

    return _.map(posTagsList, (tag, index) => {
      let bgColor;
      let icon;
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

      let tagsToRender = [];
      const posTagKeys = keysForPOS()

      tag.tags.forEach((index) => {
        tagsToRender.push(posTagKeys[index])
      })
      let headerStyle = {
        "padding": "10px 20px",
        "borderBottom": "0.2px solid #e6e6e6"
      }
      const contentStyle = {"marginBottom": "0px"}

      return (
        <POSForResponse
          bgColor={bgColor}
          contentStyle={contentStyle}
          headerStyle={headerStyle}
          icon={icon}
          tag={tag}
          tagsToRender={tagsToRender}
        />
      )
    })
  };

  render() {
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
}
