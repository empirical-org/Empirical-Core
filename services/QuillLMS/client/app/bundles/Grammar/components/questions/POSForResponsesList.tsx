import * as React from 'react'
import _ from 'underscore'
import POSForResponse from './POSForResponse'
import keysForPOS from './POSIndex'

export default class POSForResponsesList extends React.Component {

  sortResponses(posTagsList) {
    _.each(posTagsList, (tag) => {
      tag.responses.sort((a, b) => {
        return b.count - a.count
      })
    })
    return posTagsList
  }

  renderPOSTagsList() {
    const posTagsList = this.sortResponses(this.props.posTagsList)

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

      const tagsToRender = [];
      const posTagKeys = keysForPOS()

      if (tag.tags) {
        tag.tags.forEach((i) => {
          tagsToRender.push(posTagKeys[i])
        })
      }

      const headerStyle = {
        padding: "10px 20px",
        borderBottom: "0.2px solid #e6e6e6"
      }
      const contentStyle = {marginBottom: "0px"}

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
  }

  render() {
    const style = {
      borderTop: "0.2px solid #e6e6e6",
      borderLeft: "0.2px solid #e6e6e6",
      borderRight: "0.2px solid #e6e6e6",
    }
    return (
      <div style={style}>
        {this.renderPOSTagsList()}
      </div>
    )
  }
}
