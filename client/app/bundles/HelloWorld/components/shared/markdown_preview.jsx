import React from 'react'
import ReactMarkdown from 'react-markdown'

export default class extends React.Component {

	constructor(){
		super()
	}

	render() {
    return (
    <div className="markdown-preview">
      <ReactMarkdown source={this.props.markdownText}/>
    </div>
  	)}

}
