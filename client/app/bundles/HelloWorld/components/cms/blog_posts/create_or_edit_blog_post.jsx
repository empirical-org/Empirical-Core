import React from 'react';
import request from 'request';
import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown.jsx'
import MarkdownParser from '../../shared/markdown_parser.jsx'

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
    };

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this)
    this.handleBodyChange = this.handleBodyChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTopicChange = this.handleTopicChange.bind(this)
    this.handleAuthorChange = this.handleAuthorChange.bind(this)
  }

  handleTitleChange(e) {
    this.setState({title: e.target.value})
  }

  handleSubtitleChange(e) {
    this.setState({subtitle: e.target.value})
  }

  handleBodyChange(e) {
    this.setState({body: e.target.value})
    const container = document.getElementById('markdown-content');
    container.rows = 4;
    const rows = Math.ceil((container.scrollHeight - 64) / 20.3);
    container.rows = 2 + rows;
  }

  handleTopicChange(e) {
    this.setState({topic: e})
  }

  handleAuthorChange(e) {
    this.setState({author_id: e.id})
  }

  handleSubmit(e) {
    e.preventDefault();
    let action
    let url = `${process.env.DEFAULT_URL}/cms/blog_posts/`
    if (this.props.action === 'new') {
      action = 'post'
    } else {
      action = 'put'
      url += this.props.postToEdit.id
    }
    request[action]({
      url,
      form: {
        blog_post: this.state,
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

  insertMarkdown(startChar, endChar = null) {
    /*
      TODO:
        - Special behaviors:
          - startChars should automatically be placed at the front of the line
          - if multiple lines are highlighted, we should insert startChar at beginning of each line
    */
    const container = document.getElementById('markdown-content');
    let newValue = this.state.body;
    if (container.selectionStart || container.selectionStart === 0) {
      var startPos = container.selectionStart;
      var endPos = container.selectionEnd;
      newValue = container.value.substring(0, startPos);
      newValue += startChar;
      newValue += container.value.substring(startPos, endPos);
      newValue += endChar ? endChar : '';
      newValue += container.value.substring(endPos, container.value.length);
      container.focus();
    } else {
      newValue += startChar;
    }
    this.setState({ body: newValue });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Title:</label>
        <input type="text" value={this.state.title} onChange={this.handleTitleChange} />

        <label>Subtitle:</label>
        <input type="text" value={this.state.subtitle} onChange={this.handleSubtitleChange} />

        <label>Body:</label>
        <div id='markdown-shortcuts'>
          <i onClick={() => this.insertMarkdown('# ')} className="fa fa-header" />
          <i onClick={() => this.insertMarkdown('**', '**')} className="fa fa-bold" />
          <i onClick={() => this.insertMarkdown('*', '*')} className="fa fa-italic" />
          <i onClick={() => this.insertMarkdown('* ')} className="fa fa-list-ul" />
          <i onClick={() => this.insertMarkdown('1. ')} className="fa fa-list-ol" />
          <i onClick={() => this.insertMarkdown('> ')} className="fa fa-quote-left" />
          <i onClick={() => this.insertMarkdown('[', '](http://samepicofdavecoulier.tumblr.com)')} className="fa fa-link" />
          <i onClick={() => this.insertMarkdown('![', '](http://cultofthepartyparrot.com/parrots/hd/dealwithitparrot.gif)')} className="fa fa-file-image-o" />
        </div>
        <textarea rows={4} type="text" id="markdown-content" value={this.state.body} onChange={this.handleBodyChange} />
        <a href="http://commonmark.org/help/" className='markdown-cheatsheet'>Markdown Cheatsheet</a>

        <label>Markdown Preview:</label>
        <MarkdownParser className='markdown-preview' markdownText={this.state.body} />

        <div className='flex-two-cols'>
          <div className='left'>
            <label>Author:</label>
            <ItemDropdown items={this.props.authors} callback={this.handleAuthorChange} selectedItem={this.props.authors.find(a => a.id === this.state.author_id)} />
          </div>
          <div className='right'>
            <label>Topic:</label>
            <ItemDropdown items={this.props.topics} callback={this.handleTopicChange} selectedItem={this.props.topics.find(t => t === this.state.topic)} />
          </div>
        </div>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}
