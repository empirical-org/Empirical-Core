import React from 'react';
import request from 'request';
import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown.jsx'
import MarkdownParser from '../../shared/markdown_parser.jsx'
import _ from 'underscore'

export default class extends React.Component {
  constructor(props) {
    super(props);
    const p = this.props.postToEdit
    // set state to empty values or those of the postToEdit
    this.state = {
      title: p
        ? p.title
        : '',
      subtitle: p
        ? p.subtitle
        : '',
      body: p
        ? p.body
        : '',
      author_id: p ? p.author_id : null,
      topic: p ? p.topic : '',
      selectedAuthorId: p ? p.author_id : null,
    };

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this)
    this.handleBodyChange = this.handleBodyChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleTitleChange(e) {
    this.setState({title: e.target.value})
  }

  handleSubtitleChange(e) {
    this.setState({subtitle: e.target.value})
  }

  handleBodyChange(e) {
    this.setState({body: e.target.value})
  }

  handleSubmit(e) {
    e.preventDefault();
    let action,
      url
    if (this.props.action === 'new') {
      action = 'post'
      url = '/cms/blog_posts'
    } else {
      action = 'puts'
      url = `/cms/blog_posts${this.props.postToEdit.id}`
    }
    request[action]({
      url: `${process.env.DEFAULT_URL}/cms/blog_posts`,
      form: {
        blog_post: _.omit(this.state, 'selectedAuthorId'),
        authenticity_token: ReactOnRails.authenticityToken()
      }
    }, (error, httpStatus, body) => {
      if (httpStatus.statusCode === 200) {
        alert('saved')
      } else {
        alert('there was a problem saving')
      }
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Title:
          <input type="text" value={this.state.title} onChange={this.handleTitleChange}/>
        </label>
        <br/>
        <label>
          Subtitle:
          <input type="text" value={this.state.subtitle} onChange={this.handleSubtitleChange}/>
        </label>
        <br/>
        <label>
          Body:
          <textarea type="text" value={this.state.body} onChange={this.handleBodyChange}/>
          <a href="http://commonmark.org/help/" style={{
            color: '#027360'
          }}>Markdown Cheatsheet</a>
        </label>
        <br/>
        <label>
          Markdown Preview
        </label>
        <MarkdownParser className='markdown-preview' markdownText={this.state.body}/>
        <br/>
        <label>
          Author:
          <ItemDropdown items={this.props.authors} callback={this.switchAuthor} selectedItem={this.state.selectedAuthor}/>
        </label>
        <br/>

        <input type="submit" value="Submit"/>
      </form>
    )
  }
}
