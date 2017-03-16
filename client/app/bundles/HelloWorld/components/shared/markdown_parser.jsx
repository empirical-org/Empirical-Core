import React from 'react'
import ReactMarkdown from 'react-markdown'

export default class extends React.Component {

	constructor(){
		super()
	}

	render() {
    return (
      <ReactMarkdown className={`markdown-text ${this.props.className}`} source={this.props.markdownText}/>
  	)}
}
