'use strict'

 import React from 'react'
 import MarkdownParser from '../../../shared/markdown_parser.jsx'

 export default class extends React.Component {
   render() {
     return <MarkdownParser markdownText={this.props.data.activity_info} />
   }
 }
