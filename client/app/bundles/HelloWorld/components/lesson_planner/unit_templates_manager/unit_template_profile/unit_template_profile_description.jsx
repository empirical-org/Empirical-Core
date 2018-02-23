'use strict'

 import React from 'react'
import createReactClass from 'create-react-class'
 import MarkdownParser from '../../../shared/markdown_parser.jsx'

 export default  createReactClass({
  render: function () {
    return <MarkdownParser markdownText={this.props.data.activity_info}/>
  }
});
