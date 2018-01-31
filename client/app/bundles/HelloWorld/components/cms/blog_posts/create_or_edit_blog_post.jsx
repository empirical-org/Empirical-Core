import React from 'react';
import request from 'request';
import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown.jsx'
import MarkdownParser from '../../shared/markdown_parser.jsx'
import PreviewCard from '../../shared/preview_card.jsx';

const defaultPreviewCardContent = `<img class='preview-card-image' src='http://placehold.it/300x135' />
<div class='preview-card-body'>
   <h3>Write Your Title Here</h3>
   <p>Write your description here, but be careful not to make it too long!</p>
   <p class='author'>by First Last</p>
</div>`;

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
      preview_card_content: p ? p.preview_card_content : defaultPreviewCardContent,
    };

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this)
    this.handleBodyChange = this.handleBodyChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTopicChange = this.handleTopicChange.bind(this)
    this.handleAuthorChange = this.handleAuthorChange.bind(this)
    this.handlePreviewChange = this.handlePreviewChange.bind(this)
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

  handlePreviewChange(e) {
    this.setState({preview_card_content: e.target.value})
    const container = document.getElementById('preview-markdown-content');
    container.rows = 4;
    const rows = Math.ceil((container.scrollHeight - 64) / 20.3);
    container.rows = 2 + rows;
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
      if (httpStatus.statusCode === 200 && this.props.action === 'new') {
        alert('Post added successfully!');
        window.location.href = `/cms/blog_posts/${JSON.parse(body).id}/edit`
      } else if (httpStatus.statusCode === 200) {
        alert('Update successful!');
      } else {
        alert("😨 Rut roh. Something went wrong! (Don't worry, it's probably not your fault.)");
      }
    })
  }

  insertMarkdown(bodyOrCard, startChar, endChar = null) {
    /*
      TODO:
        - Special behaviors:
          - startChars should automatically be placed at the front of the line
          - if multiple lines are highlighted, we should insert startChar at beginning of each line
        - Extract this and the buttons into a separate component
    */
    const container = bodyOrCard === 'body' ? document.getElementById('markdown-content') : document.getElementById('preview-markdown-content');
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

    bodyOrCard === 'body' ? this.setState({ body: newValue }) : this.setState({ preview_card_content: newValue })
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
          <i onClick={() => this.insertMarkdown('body', '# ')} className="fa fa-header" />
          <i onClick={() => this.insertMarkdown('body', '**', '**')} className="fa fa-bold" />
          <i onClick={() => this.insertMarkdown('body', '*', '*')} className="fa fa-italic" />
          <i onClick={() => this.insertMarkdown('body', '* ')} className="fa fa-list-ul" />
          <i onClick={() => this.insertMarkdown('body', '1. ')} className="fa fa-list-ol" />
          <i onClick={() => this.insertMarkdown('body', '> ')} className="fa fa-quote-left" />
          <i onClick={() => this.insertMarkdown('body', '[', '](http://samepicofdavecoulier.tumblr.com)')} className="fa fa-link" />
          <i onClick={() => this.insertMarkdown('body', '![', '](http://cultofthepartyparrot.com/parrots/hd/dealwithitparrot.gif)')} className="fa fa-file-image-o" />
        </div>
        <textarea rows={4} type="text" id="markdown-content" value={this.state.body} onChange={this.handleBodyChange} />
        <a href="http://commonmark.org/help/" className='markdown-cheatsheet'>Markdown Cheatsheet</a>

        <label>Body Preview:</label>
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

        <label>Preview Card Content:</label>
        <div id='markdown-shortcuts'>
          <i onClick={() => this.insertMarkdown('card', '# ')} className="fa fa-header" />
          <i onClick={() => this.insertMarkdown('card', '**', '**')} className="fa fa-bold" />
          <i onClick={() => this.insertMarkdown('card', '*', '*')} className="fa fa-italic" />
          <i onClick={() => this.insertMarkdown('card', '* ')} className="fa fa-list-ul" />
          <i onClick={() => this.insertMarkdown('card', '1. ')} className="fa fa-list-ol" />
          <i onClick={() => this.insertMarkdown('card', '> ')} className="fa fa-quote-left" />
          <i onClick={() => this.insertMarkdown('card', '[', '](http://samepicofdavecoulier.tumblr.com)')} className="fa fa-link" />
          <i onClick={() => this.insertMarkdown('card', '![', '](http://cultofthepartyparrot.com/parrots/hd/dealwithitparrot.gif)')} className="fa fa-file-image-o" />
        </div>
        <textarea rows={4} type="text" id="preview-markdown-content" value={this.state.preview_card_content} onChange={this.handlePreviewChange} />
        <a href="http://commonmark.org/help/" className='markdown-cheatsheet'>Markdown Cheatsheet</a>

        <label>Card Preview:</label>
        <PreviewCard content={this.state.preview_card_content} />

        <input type="submit" value="Submit" />
      </form>
    )
  }
}
