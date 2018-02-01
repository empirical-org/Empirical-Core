import React from 'react';
import request from 'request';
import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown.jsx'
import MarkdownParser from '../../shared/markdown_parser.jsx'
import PreviewCard from '../../shared/preview_card.jsx';

const defaultPreviewCardContent = `<img class='preview-card-image' src='http://placehold.it/300x135' />
<div class='preview-card-body'>
   <h3>Write Your Title Here</h3>
   <p>Write your description here, but be careful not to make it too long!</p>
   <p class='author'>by Quill Staff</p>
</div>`;

export default class extends React.Component {
  constructor(props) {
    super(props);
    const p = this.props.postToEdit
    // set state to empty values or those of the postToEdit
    this.state = {
      title: p ? p.title : '',
      subtitle: p ? p.subtitle : '',
      body: p ? p.body : '',
      author_id: p ? p.author_id : 11 /* Quill Staff */,
      topic: p ? p.topic : '',
      preview_card_content: p ? p.preview_card_content : defaultPreviewCardContent,
      custom_preview_card_content: p ? p.preview_card_content : defaultPreviewCardContent,
      // TODO: restore appropriate format on load
      preview_card_type: 'Blog Post',
      blogPostPreviewImage: 'http://placehold.it/300x135',
      blogPostPreviewTitle: 'Write Your Title Here',
      blogPostPreviewDescription: 'Write your description here, but be careful not to make it too long!',
    };

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this)
    this.handleBodyChange = this.handleBodyChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTopicChange = this.handleTopicChange.bind(this)
    this.handleAuthorChange = this.handleAuthorChange.bind(this)
    this.handleCustomPreviewChange = this.handleCustomPreviewChange.bind(this)
    this.handlePreviewCardTypeChange = this.handlePreviewCardTypeChange.bind(this)
    this.handleBlogPostPreviewImageChange = this.handleBlogPostPreviewImageChange.bind(this)
    this.handleBlogPostPreviewTitleChange = this.handleBlogPostPreviewTitleChange.bind(this)
    this.handleBlogPostPreviewDescriptionChange = this.handleBlogPostPreviewDescriptionChange.bind(this)
    this.updatePreviewCardFromBlogPostPreview = this.updatePreviewCardFromBlogPostPreview.bind(this)
    this.renderPreviewCardContentFields = this.renderPreviewCardContentFields.bind(this)
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
    this.setState({author_id: e.id}, this.updatePreviewCardFromBlogPostPreview)
  }

  handleCustomPreviewChange(e) {
    this.setState({
      preview_card_content: e.target.value,
      custom_preview_card_content: e.target.value
    })
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
        blog_post: {
          title: this.state.title,
          subtitle: this.state.subtitle,
          body: this.state.body,
          topic: this.state.topic,
          author_id: this.state.author_id,
          preview_card_content: this.state.preview_card_content
        },
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

  insertMarkdown(startChar, endChar = null) {
    /*
      TODO:
        - Special behaviors:
          - startChars should automatically be placed at the front of the line
          - if multiple lines are highlighted, we should insert startChar at beginning of each line
        - Extract this and the buttons into a separate component
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

  handlePreviewCardTypeChange(e) {
    this.setState({ preview_card_type: e })
  }

  handleBlogPostPreviewImageChange(e) {
    this.setState({
      blogPostPreviewImage: e.target.value
    }, this.updatePreviewCardFromBlogPostPreview)
  }

  handleBlogPostPreviewTitleChange(e) {
    this.setState({
      blogPostPreviewTitle: e.target.value
    }, this.updatePreviewCardFromBlogPostPreview)
  }

  handleBlogPostPreviewDescriptionChange(e) {
    this.setState({
      blogPostPreviewDescription: e.target.value
    }, this.updatePreviewCardFromBlogPostPreview)
  }

  updatePreviewCardFromBlogPostPreview() {
    const previewCardContent = `<img class='preview-card-image' src='${this.state.blogPostPreviewImage}' />
    <div class='preview-card-body'>
       <h3>${this.state.blogPostPreviewTitle}</h3>
       <p>${this.state.blogPostPreviewDescription}</p>
       <p class='author'>by ${this.props.authors.find(a => a.id == this.state.author_id).name}</p>
    </div>`;
    this.setState({ preview_card_content: previewCardContent })
  }

  renderPreviewCardContentFields() {
    const preview_card_type = this.state.preview_card_type;
    let contentFields;
    if(preview_card_type === 'Blog Post') {
      contentFields = [
        <label>Header Image:</label>,
        <input onChange={this.handleBlogPostPreviewImageChange} type='text' value={this.state.blogPostPreviewImage} />,
        <label>Title:</label>,
        <input onChange={this.handleBlogPostPreviewTitleChange} type='text' value={this.state.blogPostPreviewTitle} />,
        <label>Description:</label>,
        <input onChange={this.handleBlogPostPreviewDescriptionChange} type='text' value={this.state.blogPostPreviewDescription} />
      ]
    } else if(preview_card_type === 'Custom HTML') {
      contentFields = [
        <label>Custom HTML:</label>,
        <textarea rows={4} type="text" id="preview-markdown-content" value={this.state.custom_preview_card_content} onChange={this.handleCustomPreviewChange} />
      ]
    } else if(preview_card_type === 'Tweet') {
      contentFields = [
        <label>Link to Tweet:</label>,
        <input type='text' value='https://twitter.com/EdSurge/status/956861254982873088' />,
        <label>Text to Display:</label>,
        <input type='text' value='"Climbing up Ben Bloom’s learning hierarchy won’t be easy, but it is necessary if we want to build education technology capable of helping learners move beyond basic remembering and understanding."' />,
      ]
    } else if(preview_card_type === 'YouTube Video') {
      contentFields = [
        <label>Link to YouTube Video:</label>,
        <input type='text' value='https://www.youtube.com/watch?v=O_HyZ5aW76c' />
      ]
    }

    return (<div id='preview-card-content-fields'>{contentFields}</div>)
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
          <i onClick={() => this.insertMarkdown('![', '](http://cultofthepartyparrot.com/parrots/hd/parrot.gif)')} className="fa fa-file-image-o" />
        </div>
        <textarea rows={4} type="text" id="markdown-content" value={this.state.body} onChange={this.handleBodyChange} />
        <a href="http://commonmark.org/help/" className='markdown-cheatsheet'>Markdown Cheatsheet</a>

        <label>Body Preview:</label>
        <MarkdownParser className='markdown-preview' markdownText={this.state.body} />

        <div className='flex-three-cols'>
          <div>
            <label>Author:</label>
            <ItemDropdown items={this.props.authors} callback={this.handleAuthorChange} selectedItem={this.props.authors.find(a => a.id === this.state.author_id)} />
          </div>
          <div>
            <label>Topic:</label>
            <ItemDropdown items={this.props.topics} callback={this.handleTopicChange} selectedItem={this.props.topics.find(t => t === this.state.topic)} />
          </div>
          <div >
            <label>Preview Card Type:</label>
            <ItemDropdown
              items={['Blog Post', 'YouTube Video', 'Tweet', 'Custom HTML']}
              callback={this.handlePreviewCardTypeChange}
              selectedItem={this.state.preview_card_type}
            />
          </div>
        </div>

        <label>Preview Card Content:</label>
        {this.renderPreviewCardContentFields()}

        <label>Card Preview:</label>
        <PreviewCard content={this.state.preview_card_content} />

        <input type="submit" value="Submit" />
      </form>
    )
  }
}
