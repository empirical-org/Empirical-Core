'use strict'

 import React from 'react'
 import MarkdownParser from '../../../shared/markdown_parser.jsx'

 export default  React.createClass({
  render: function () {
    return <MarkdownParser markdownText={this.props.data.activity_info}/>
  }
});
