import React from 'react';
import request from 'request';
import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown.jsx'
import MarkdownParser from '../../shared/markdown_parser.jsx'

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      subtitle: null,
      body: null,
      authorId: null,
      topic: null,
      authors: this.props.authors,
      selectedAuthorId: null,
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
    const action = this.props.action === 'new'
      ? 'post'
      : 'puts'
    request[action]({
      url: `${process.env.DEFAULT_URL}/cms/blog_posts`,
    form: {
      blog_post: this.state,
      authenticity_token: ReactOnRails.authenticityToken()
    },
    function(err, httpResponse, body) {
      if (httpResponse.status === 200) {
        alert('success!')
      } else {
        alert('failure')
      }
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
