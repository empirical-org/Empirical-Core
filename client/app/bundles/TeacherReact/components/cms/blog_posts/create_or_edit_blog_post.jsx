import React from 'react';
import request from 'request';
import moment from 'moment'
import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown.jsx'
import MarkdownParser from '../../shared/markdown_parser.jsx'
import PreviewCard from '../../shared/preview_card.jsx';
import BlogPostContent from '../../blog_posts/blog_post_content'
import DatePicker from 'react-datepicker'
import Dropzone from 'react-dropzone'
import getAuthToken from '../../modules/get_auth_token'

const defaultPreviewCardContent = `<img class='preview-card-image' src='http://cultofthepartyparrot.com/parrots/hd/middleparrot.gif' />
<div class='preview-card-body'>
   <h3>Party Parrot Parade</h3>
   <p>There exist many excellent party parrots.</p>
</div>
<div class='preview-card-footer'>
  <p class='author'>by Quill Staff</p>
</div>`;

export default class extends React.Component {
  constructor(props) {
    super(props);
    const p = this.props.postToEdit
    // set state to empty values or those of the postToEdit
    this.state = {
      id: p ? p.id : null,
      title: p ? p.title : '',
      subtitle: p ? p.subtitle : '',
      body: p ? p.body : '',
      author_id: p ? p.author_id : 11 /* Quill Staff */,
      topic: p ? p.topic : 'Webinars',
      draft: p ? p.draft : true,
      slug: p ? p.slug : true,
      preview_card_content: p ? p.preview_card_content : null,
      custom_preview_card_content: p ? p.preview_card_content : defaultPreviewCardContent,
      preview_card_type: this.props.action === 'new' ? 'Medium Image' : 'Custom HTML',
      blogPostPreviewImage: 'http://placehold.it/300x135',
      blogPostPreviewTitle: p ? p.title : 'Write Your Title Here',
      blogPostPreviewDescription: 'Write your description here, but be careful not to make it too long!',
      videoLink: 'https://www.youtube.com/watch?v=oVXZTmi2ruI',
      videoDescription: "I'll write it myself, and we'll do it live!",
      tweetLink: 'https://twitter.com/EdSurge/status/956861254982873088',
      tweetImage: 'http://placehold.it/300x135/00998a/fff',
      tweetText: '"Climbing up Ben Bloom’s learning hierarchy won’t be easy, but it is necessary if we want to build education technology capable of helping learners move beyond basic remembering and understanding."',
      tweetAuthor: 'EdSurge',
      premium: p ? p.premium : false,
      publishedAt: p ? p.published_at : null,
      externalLink: p ? p.external_link : null,
      centerImages: p ? p.center_images : false
    };

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this)
    this.handleBodyChange = this.handleBodyChange.bind(this)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
    this.handleTopicChange = this.handleTopicChange.bind(this)
    this.handleExternalLinkChange = this.handleExternalLinkChange.bind(this)
    this.handleAuthorChange = this.handleAuthorChange.bind(this)
    this.handleCustomPreviewChange = this.handleCustomPreviewChange.bind(this)
    this.handlePreviewCardTypeChange = this.handlePreviewCardTypeChange.bind(this)
    this.handleBlogPostPreviewImageChange = this.handleBlogPostPreviewImageChange.bind(this)
    this.handleBlogPostPreviewTitleChange = this.handleBlogPostPreviewTitleChange.bind(this)
    this.handleBlogPostPreviewDescriptionChange = this.handleBlogPostPreviewDescriptionChange.bind(this)
    this.updatePreviewCardFromBlogPostPreview = this.updatePreviewCardFromBlogPostPreview.bind(this)
    this.renderPreviewCardContentFields = this.renderPreviewCardContentFields.bind(this)
    this.updatePreviewCardVideoLink = this.updatePreviewCardVideoLink.bind(this)
    this.updatePreviewCardVideoDescription = this.updatePreviewCardVideoDescription.bind(this)
    this.updatePreviewCardVideoContent = this.updatePreviewCardVideoContent.bind(this)
    this.updateTweetLink = this.updateTweetLink.bind(this)
    this.updateTweetImage = this.updateTweetImage.bind(this)
    this.updateTweetText = this.updateTweetText.bind(this)
    this.updateTweetAuthor = this.updateTweetAuthor.bind(this)
    this.updatePreviewCardTweetContent = this.updatePreviewCardTweetContent.bind(this)
    this.handlePremiumChange = this.handlePremiumChange.bind(this)
    this.handleCenterImagesChange = this.handleCenterImagesChange.bind(this)
    this.renderArticleMarkdownOrPreview = this.renderArticleMarkdownOrPreview.bind(this)
    this.hideArticlePreview = this.hideArticlePreview.bind(this)
    this.showArticlePreview = this.showArticlePreview.bind(this)
    this.updatePublishedAt = this.updatePublishedAt.bind(this)
    this.goToPreview = this.goToPreview.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.handlePreviewCardButtonTextChange = this.handlePreviewCardButtonTextChange.bind(this)
  }

  componentDidMount() {
    this.updatePreviewCardBasedOnType();
    if(this.props.action === 'new') {
      this.setState({ previewCardHasAlreadyBeenManuallyEdited: false });
    }
  }

  appropriatePlaceholderImage() {
    switch (this.state.preview_card_type) {
      case 'Large Image':
        return 'http://placehold.it/300x200'
      case 'Tiny Image':
        return 'http://placehold.it/300x90'
      case 'Medium Image':
      default:
        return 'http://placehold.it/300x138'
    }
  }

  hideArticlePreview() {
    this.setState({showArticlePreview: false})
  }

  showArticlePreview() {
    this.setState({showArticlePreview: true})
  }

  handleTitleChange(e) {
    const targetValue = e.target.value;
    let state = {title: targetValue};
    if(!this.state.previewCardHasAlreadyBeenManuallyEdited) {
      state['blogPostPreviewTitle'] = targetValue;
    }
    this.setState(state, () => {
      if(!this.state.previewCardHasAlreadyBeenManuallyEdited) {
        this.updatePreviewCardFromBlogPostPreview();
      }
    });
  }

  handleSubtitleChange(e) {
    const targetValue = e.target.value;
    let state = {subtitle: targetValue};
    if(!this.state.previewCardHasAlreadyBeenManuallyEdited) {
      state['blogPostPreviewDescription'] = targetValue;
    }
    this.setState(state, () => {
      if(!this.state.previewCardHasAlreadyBeenManuallyEdited) {
        this.updatePreviewCardFromBlogPostPreview();
      }
    });
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

  handleExternalLinkChange(e) {
    this.setState({externalLink: e.target.value})
  }

  handleAuthorChange(e) {
    this.setState({author_id: e.id}, this.updatePreviewCardFromBlogPostPreview)
  }

  handleCustomPreviewChange(e) {
    this.setState({
      preview_card_content: e.target.value,
      custom_preview_card_content: e.target.value,
      previewCardHasAlreadyBeenManuallyEdited: true
    })
    const container = document.getElementById('preview-markdown-content');
    container.rows = 4;
    const rows = Math.ceil((container.scrollHeight - 64) / 20.3);
    container.rows = 2 + rows;
  }

  handleSubmitClick(e, shouldPublish, unpublish = false, callback) {
    if(unpublish && window.prompt('To unpublish this post, please type UNPUBLISH.') !== 'UNPUBLISH') { e.preventDefault(); return; }
    e.preventDefault();
    let action
    let url = `${process.env.DEFAULT_URL}/cms/blog_posts/`
    if (this.props.action === 'new' && !unpublish) {
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
          preview_card_content: this.state.preview_card_content,
          draft: !shouldPublish,
          premium: this.state.premium,
          published_at: this.state.publishedAt ? moment(this.state.publishedAt).format() : null,
          external_link: this.state.externalLink,
          center_images: this.state.centerImages
        },
        authenticity_token: ReactOnRails.authenticityToken()
      }
    }, (error, httpStatus, body) => {
      const parsedBody = JSON.parse(body)
      if (httpStatus.statusCode === 200 && this.props.action === 'new') {
        alert('Post added successfully!');
        window.location.href = (`/cms/blog_posts/${parsedBody.id}/edit`)
      } else if (httpStatus.statusCode === 200) {
        this.setState({draft: parsedBody.draft})
        alert('Update successful!');
      } else {
        alert("😨 Rut roh. Something went wrong! (Don't worry, it's probably not your fault.)");
      }
      callback ? callback() : null
    })
  }

  renderSaveDraftButton() {
    if(this.props.action === 'new' || this.state.draft) {
      return <input type="submit" value="Save Draft" onClick={(e) => { this.handleSubmitClick(e, false) }} style={{background: 'white', color: '#00c2a2'}} />
    }
  }

  renderUnpublishButton() {
    if(this.props.action === 'edit' && !this.state.draft) {
      return <input type="submit" value="Unpublish & Save Draft" onClick={(e) => { this.handleSubmitClick(e, false, true) }} style={{background: 'white', color: '#00c2a2'}} />
    }
  }

  renderSaveAndPreviewButton() {
    if (this.props.action === 'edit') {
      return <input type="submit" value="Save and Preview" onClick={(e) => { this.handleSubmitClick(e, !this.state.draft, false, this.goToPreview) }} style={{background: 'white', color: '#00c2a2'}} />
    }
  }

  goToPreview() {
    const url = this.state.externalLink ? this.state.externalLink : `/teacher-center/${this.state.slug}`
    window.open(url, '_blank')
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
    this.setState({ preview_card_type: e }, this.updatePreviewCardBasedOnType)
  }

  onDrop(acceptedFiles) {
    acceptedFiles.forEach(file => {
      const data = new FormData()
      data.append('file', file)
      fetch(`${process.env.DEFAULT_URL}/cms/images`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': getAuthToken()
        },
        body: data
      })
      .then(response => response.json()) // if the response is a JSON object
      .then(response => this.setState({uploadedImageLink: response.url})); // Handle the success response object
    });
  }

  updatePreviewCardBasedOnType() {
    switch (this.state.preview_card_type) {
      case 'Tiny Image':
      case 'Medium Image':
      case 'Large Image':
        this.setState({blogPostPreviewImage: this.appropriatePlaceholderImage()}, this.updatePreviewCardFromBlogPostPreview)
        break;
      case 'Tweet':
        this.updatePreviewCardTweetContent();
        break;
      case 'YouTube Video':
        this.updatePreviewCardVideoContent();
        break;
      case 'Button':
        this.updatePreviewCardButtonContent();
        break;
      default:
        this.setState({ preview_card_content: this.state.custom_preview_card_content })
    }
  }

  handleBlogPostPreviewImageChange(e) {
    this.setState({
      blogPostPreviewImage: e.target.value,
      previewCardHasAlreadyBeenManuallyEdited: true
    }, this.updatePreviewCardFromBlogPostPreview)
  }

  handleBlogPostPreviewTitleChange(e) {
    this.setState({
      blogPostPreviewTitle: e.target.value,
      previewCardHasAlreadyBeenManuallyEdited: true
    }, this.updatePreviewCardFromBlogPostPreview)
  }

  handleBlogPostPreviewDescriptionChange(e) {
    this.setState({
      blogPostPreviewDescription: e.target.value,
      previewCardHasAlreadyBeenManuallyEdited: true
    }, this.updatePreviewCardFromBlogPostPreview)
  }

  handlePreviewCardButtonTextChange(e) {
    this.setState({
      previewCardButtonText: e.target.value,
      previewCardHasAlreadyBeenManuallyEdited: true
    }, this.updatePreviewCardFromBlogPostPreview)
  }

  updatePreviewCardFromBlogPostPreview() {
    const author = this.props.authors.find(a => a.id == this.state.author_id)
    const publishDate = this.state.publishedAt
    let footerContent, button
    if (author) {
      footerContent = `<p class='author'>by ${author.name}</p>`
    } else if (publishDate) {
      footerContent = `<p class='published'>${moment(publishDate).format('MMMM Do, YYYY')}</p>`
    } else {
      footerContent = `<span/>`
    }
    if (this.state.previewCardButtonText) {
      button = `<div class='button-container'><a class='article-cta-primary' href=${this.state.externalLink}>${this.state.previewCardButtonText}</a></div>`
    } else {
      button = '<span/>'
    }
    const previewCardContent = `<img class='preview-card-image' src='${this.state.blogPostPreviewImage}' />
    <div class='preview-card-body'>
       <h3>${this.state.blogPostPreviewTitle}</h3>
       <p>${this.state.blogPostPreviewDescription}</p>
       ${button}
    </div>
    <div class='preview-card-footer'>
      ${footerContent}
    </div>`;
    this.setState({ preview_card_content: previewCardContent })
  }

  updatePreviewCardVideoLink(e) {
    this.setState({videoLink: e.target.value}, this.updatePreviewCardVideoContent)
  }

  updatePreviewCardVideoDescription(e) {
    this.setState({videoDescription: e.target.value}, this.updatePreviewCardVideoContent)
  }

  updateTweetLink(e) {
    this.setState({ tweetLink: e.target.value }, this.updatePreviewCardTweetContent)
  }

  updateTweetImage(e) {
    this.setState({ tweetImage: e.target.value }, this.updatePreviewCardTweetContent)
  }

  updateTweetText(e) {
    this.setState({ tweetText: e.target.value }, this.updatePreviewCardTweetContent)
  }

  updateTweetAuthor(e) {
    this.setState({ tweetAuthor: e.target.value }, this.updatePreviewCardTweetContent)
  }

  updatePublishedAt(e) {
    this.setState({ publishedAt: e}, this.updatePreviewCardBasedOnType)
  }

  updatePreviewCardTweetContent() {
    const author = this.props.authors.find(a => a.id == this.state.author_id)
    const publishDate = this.state.publishedAt
    let footerContent
    if (author) {
      footerContent = `<p class='author'>by ${author.name}</p>`
    } else if (publishDate) {
      footerContent = `<p class='published'>${moment(publishDate).format('MMMM Do, YYYY')}</p>`
    } else {
      footerContent = `<span/>`
    }
    const previewCardContent = `<img class='preview-card-image' src='${this.state.tweetImage}' />
    <div class='preview-card-body'>
       <p>${this.state.tweetText}</p>
       <p class='author'>@${this.state.tweetAuthor}</p>
    </div>
    <div class='preview-card-footer'>
      ${footerContent}
    </div>`;
    this.setState({ preview_card_content: previewCardContent, previewCardHasAlreadyBeenManuallyEdited: true })
  }

  updatePreviewCardVideoContent() {
    const matchedQueryParameter = this.state.videoLink.match(/\?v=(.*)(\&)/) || this.state.videoLink.match(/\?v=(.*)$/)
    const embedUrl = `https://www.youtube-nocookie.com/embed/${matchedQueryParameter[1]}?rel=0&amp;controls=0&amp;showinfo=0&player=html5`
    const author = this.props.authors.find(a => a.id == this.state.author_id)
    const publishDate = this.state.publishedAt
    let footerContent
    if (author) {
      footerContent = `<p class='author'>by ${author.name}</p>`
    } else if (publishDate) {
      footerContent = `<p class='published'>${moment(publishDate).format('MMMM Do, YYYY')}</p>`
    } else {
      footerContent = `<span/>`
    }
    const previewCardContent = `<div class='video-holder'>
      <iframe src="${embedUrl}" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>
    </div>
    <div class='preview-card-body'>
       <p>${this.state.videoDescription}</p>
    </div>
    <div class='preview-card-footer'>
      ${footerContent}
    </div>`;
    this.setState({ preview_card_content: previewCardContent, previewCardHasAlreadyBeenManuallyEdited: true })
  }

  renderPreviewCardContentFields() {
    const preview_card_type = this.state.preview_card_type;
    let contentFields;
    if (['Tiny Image', 'Medium Image', 'Large Image'].includes(preview_card_type)) {
      contentFields = [
        <label>Link to an image with the dimensions in the preview:</label>,
        <input onChange={this.handleBlogPostPreviewImageChange} type='text' value={this.state.blogPostPreviewImage} />,
        <label>Title:</label>,
        <input onChange={this.handleBlogPostPreviewTitleChange} type='text' value={this.state.blogPostPreviewTitle} />,
        <label>Description:</label>,
        <input onChange={this.handleBlogPostPreviewDescriptionChange} type='text' value={this.state.blogPostPreviewDescription} />,
        <label>Button Text (button will link to whatever the external link is above):</label>,
        <input onChange={this.handlePreviewCardButtonTextChange} type='text' value={this.state.previewCardButtonText} />
      ]
    } else if (preview_card_type === 'Custom HTML') {
      contentFields = [
        <label>Custom HTML:</label>,
        <textarea rows={4} type="text" id="preview-markdown-content" value={this.state.custom_preview_card_content} onChange={this.handleCustomPreviewChange} />
      ]
    } else if(preview_card_type === 'Tweet') {
      contentFields = [
        <label>Link to Tweet:</label>,
        <input onChange={this.updateTweetLink} type='text' value={this.state.tweetLink} />,
        <label>Link to Image:</label>,
        <input onChange={this.updateTweetImage} type='text' value={this.state.tweetImage} />,
        <label>Text to Display:</label>,
        <input onChange={this.updateTweetText} type='text' value={this.state.tweetText} />,
        <label>Twitter Account:</label>,
        <input onChange={this.updateTweetAuthor} type='text' value={this.state.tweetAuthor} />,
      ]
    } else if(preview_card_type === 'YouTube Video') {
      contentFields = [
        <label>Link to YouTube Video:</label>,
        <input onChange={this.updatePreviewCardVideoLink} type='text' value={this.state.videoLink} />,
        <label>Video Description:</label>,
        <input onChange={this.updatePreviewCardVideoDescription} type='text' value={this.state.videoDescription} />
      ]
    }

    return (<div id='preview-card-content-fields'>{contentFields}</div>)
  }

  renderPreviewCardTypeDropdown() {
    return <div>
        <label>Preview Card Template:</label>
        <ItemDropdown
          items={['Tiny Image', 'Medium Image', 'Large Image', 'YouTube Video', 'Tweet', 'Custom HTML']}
          callback={this.handlePreviewCardTypeChange}
          selectedItem={this.state.preview_card_type}
        />
      </div>
  }

  renderDatepicker() {
    return <div>
        <label>Published At Date:</label>
        <DatePicker selected={ this.state.publishedAt ? moment(this.state.publishedAt) : null } onChange={this.updatePublishedAt}
        />
      </div>
  }

  renderArticleMarkdownOrPreview() {
    let content, toolbarLeft, mdLink, dateDisplayed
    if (this.state.publishedAt) {
      dateDisplayed = this.state.publishedAt
    } else if (this.props.postToEdit) {
      dateDisplayed = this.props.postToEdit.updated_at
    } else {
      dateDisplayed = moment()
    }
    if (this.state.showArticlePreview) {
      toolbarLeft = <div/>
      content = <div id="article-container">
        <article>
          <BlogPostContent
            body={this.state.body}
            title={this.state.title}
            updatedAt={dateDisplayed}
            author={this.props.authors.find(a => a.id == this.state.author_id)}
            displayPaywall={false}
            centerImages={this.state.centerImages}
          />
        </article>
        </div>
    } else {
        toolbarLeft = <div>
          <i onClick={() => this.insertMarkdown('# ')} className="fa">H1</i>
          <i onClick={() => this.insertMarkdown('## ')} className="fa">H2</i>
          <i onClick={() => this.insertMarkdown('### ')} className="fa">H3</i>
          <i onClick={() => this.insertMarkdown('**', '**')} className="fa fa-bold" />
          <i onClick={() => this.insertMarkdown('*', '*')} className="fa fa-italic" />
          <i onClick={() => this.insertMarkdown('* ')} className="fa fa-list-ul" />
          <i onClick={() => this.insertMarkdown('1. ')} className="fa fa-list-ol" />
          <i onClick={() => this.insertMarkdown('> ')} className="fa fa-quote-left" />
          <i onClick={() => this.insertMarkdown('[', '](http://samepicofdavecoulier.tumblr.com)')} className="fa fa-link" />
          <i onClick={() => this.insertMarkdown('![', '](http://cultofthepartyparrot.com/parrots/hd/parrot.gif)')} className="fa fa-file-image-o" />
          <i onClick={() => this.insertMarkdown("<a href='https://google.com' class='article-cta-primary'>\n", "\n</a>")} className="fa fa-square" />
          <i onClick={() => this.insertMarkdown("<a href='https://google.com' class='article-cta-secondary'>\n", "\n</a>")} className="fa fa-square-o" />
        </div>
        content = <textarea rows={20} type="text" id="markdown-content" value={this.state.body} onChange={this.handleBodyChange} />
        mdLink = <a target="_blank" href="http://commonmark.org/help/" className='markdown-cheatsheet'>Markdown Cheatsheet</a>
    }
    return <div>
      <label>Article Content</label>
      <div className="article-content-container">
        <div id="article-preview-bar">
          {toolbarLeft}
          <div>
            <span className={`article-tab ${this.state.showArticlePreview ? null : 'active'}`} onClick={this.hideArticlePreview}>Edit</span>
            <span className={`article-tab ${this.state.showArticlePreview ? 'active' : null}`} onClick={this.showArticlePreview}>Preview</span>
          </div>
        </div>
        {content}
      </div>
      {mdLink}
    </div>

  }

  handlePremiumChange() {
    this.setState({premium: !this.state.premium});
  }

  handleCenterImagesChange() {
    this.setState({centerImages: !this.state.centerImages});
  }

  render() {
    const nullAuthor = {id: null, name: 'None'}
    return (
      <div>
        <a className='all-blog-posts-back-button' href='/cms/blog_posts'><i className='fa fa-chevron-left'></i> All Blog Posts</a>
        <form>
          <label>Title:</label>
          <input type="text" value={this.state.title} onChange={this.handleTitleChange} />

          <label>SEO Meta Description:</label>
          <input type="text" value={this.state.subtitle} onChange={this.handleSubtitleChange} />

          <div className='short-fields'>
            <div>
              <label>Author:</label>
              <ItemDropdown items={[nullAuthor].concat(this.props.authors)} callback={this.handleAuthorChange} selectedItem={this.props.authors.find(a => a.id === this.state.author_id) || nullAuthor} />
              <a className="link" href="/cms/authors/new" target="_blank">Create New Author</a>
            </div>
            <div>
              <label>Topic:</label>
              <ItemDropdown items={this.props.topics} callback={this.handleTopicChange} selectedItem={this.props.topics.find(t => t === this.state.topic)} />
            </div>
          </div>

          <div className='short-fields'>
            {this.renderPreviewCardTypeDropdown()}
            {this.renderDatepicker()}
          </div>

          <div className='short-fields'>
            <div>
              <label>External Link: (Optional, use only if this card should point to another website)</label>
              <input onChange={this.handleExternalLinkChange} value={this.state.externalLink}/>
            </div>
          </div>

          <div>
            <label>Click the square below or drag an image into it to upload an image:</label>
            <Dropzone onDrop={this.onDrop}/>
            <label style={{marginTop: '10px'}}>Here is the link to your uploaded image:</label>
            <input style={{marginBottom: '0px'}} value={this.state.uploadedImageLink}/>
            <a className="link" style={{marginBottom: '10px'}} href="/cms/images" target="_blank">All Uploaded Images</a>
          </div>

          <div className="side-by-side">
            <div className="preview-card-container">
              <label>Preview Card Content:</label>
              {this.renderPreviewCardContentFields()}
            </div>

            <div>
              <label>Card Preview:</label>
              <PreviewCard content={this.state.preview_card_content} />
            </div>
          </div>

          <div>
            <label className="premium-label">Show Only to Premium Members:</label>
            <input className="premium-checkbox" type='checkbox' checked={this.state.premium} onClick={this.handlePremiumChange} />
          </div>

          <div>
            <label className="center-images-label">Center Images:</label>
            <input className="center-images-checkbox" type='checkbox' checked={this.state.centerImages} onClick={this.handleCenterImagesChange} />
          </div>

          {this.renderArticleMarkdownOrPreview()}

          <input type="submit" value="Publish" onClick={(e) => { this.handleSubmitClick(e, true) }} />

          {this.renderSaveDraftButton()}
          {this.renderUnpublishButton()}
          {this.renderSaveAndPreviewButton()}
        </form>
      </div>
    )
  }
}
