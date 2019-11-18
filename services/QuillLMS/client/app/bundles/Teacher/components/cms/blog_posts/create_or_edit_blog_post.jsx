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
      imageLink: p ? p.image_link : '',
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
      pressName: p ? p.press_name : null,
      publishedAt: p ? p.published_at : null,
      externalLink: p ? p.external_link : null,
      centerImages: p ? p.center_images : false
    };
  }

  componentDidMount = () => {
    this.updatePreviewCardBasedOnType();
    if(this.props.action === 'new') {
      this.setState({ previewCardHasAlreadyBeenManuallyEdited: false });
    } else {
      this.setState({ previewCardHasAlreadyBeenManuallyEdited: true })
    }
  }

  appropriatePlaceholderImage = () => {
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

  hideArticlePreview = () => {
    this.setState({showArticlePreview: false})
  }

  showArticlePreview = () => {
    this.setState({showArticlePreview: true})
  }

  handleTitleChange = (e) => {
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

  handleSubtitleChange = (e) => {
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

  handlePressNameChange = (e) => {
    this.setState({ pressName: e.target.value })
  }

  handleImageLinkChange = (e) => {
    const targetValue = e.target.value;
    let state = { imageLink: targetValue };
    if(!this.state.previewCardHasAlreadyBeenManuallyEdited) {
      state['blogPostPreviewImage'] = targetValue;
    }
    this.setState(state, () => {
      if(!this.state.previewCardHasAlreadyBeenManuallyEdited) {
        this.updatePreviewCardFromBlogPostPreview();
      }
    });
  }

  handleBodyChange = (e) => {
    this.setState({body: e.target.value})
    const container = document.getElementById('markdown-content');
    container.rows = 4;
    const rows = Math.ceil((container.scrollHeight - 64) / 20.3);
    container.rows = 2 + rows;
  }

  handleTopicChange = (e) => {
    this.setState({topic: e})
  }

  handleExternalLinkChange = (e) => {
    this.setState({externalLink: e.target.value})
  }

  handleAuthorChange = (e) => {
    this.setState({author_id: e.id}, this.updatePreviewCardFromBlogPostPreview)
  }

  handleCustomPreviewChange = (e) => {
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

  handleSubmitClick = (e, shouldPublish, unpublish = false, callback) => {
    const {
      title,
      subtitle,
      imageLink,
      body,
      topic,
      author_id,
      preview_card_content,
      premium,
      publishedAt,
      externalLink,
      centerImages,
      pressName,
    } = this.state

    e.preventDefault()

    if (unpublish && window.prompt('To unpublish this post, please type UNPUBLISH.') !== 'UNPUBLISH') { return }
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
          title: title,
          subtitle: subtitle,
          image_link: imageLink,
          body: body,
          topic: topic,
          author_id: author_id,
          preview_card_content: preview_card_content,
          draft: !shouldPublish,
          premium: premium,
          published_at: publishedAt ? moment(publishedAt).format() : null,
          external_link: externalLink,
          center_images: centerImages,
          press_name: pressName
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

  renderSaveDraftButton = () => {
    if(this.props.action === 'new' || this.state.draft) {
      return <input onClick={(e) => { this.handleSubmitClick(e, false) }} style={{background: 'white', color: '#00c2a2'}} type="submit" value="Save Draft" />
    }
  }

  renderUnpublishButton = () => {
    if(this.props.action === 'edit' && !this.state.draft) {
      return <input onClick={(e) => { this.handleSubmitClick(e, false, true) }} style={{background: 'white', color: '#00c2a2'}} type="submit" value="Unpublish & Save Draft" />
    }
  }

  renderSaveAndPreviewButton = () => {
    if (this.props.action === 'edit') {
      return <input onClick={(e) => { this.handleSubmitClick(e, !this.state.draft, false, this.goToPreview) }} style={{background: 'white', color: '#00c2a2'}} type="submit" value="Save and Preview" />
    }
  }

  goToPreview = () => {
    let url
    if (this.state.externalLink) {
      url = this.state.externalLink
    } else if (this.props.studentTopics.includes(this.state.topic)) {
      url = `/student-center/${this.state.slug}`
    } else {
      url = `/teacher-center/${this.state.slug}`
    }
    window.open(url, '_blank')
  }

  insertMarkdown = (startChar, endChar = null) => {
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

  handlePreviewCardTypeChange = (e) => {
    this.setState({ preview_card_type: e }, this.updatePreviewCardBasedOnType)
  }

  onDrop = (acceptedFiles) => {
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

  updatePreviewCardBasedOnType = () => {
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

  handleBlogPostPreviewImageChange = (e) => {
    this.setState({
      blogPostPreviewImage: e.target.value,
      previewCardHasAlreadyBeenManuallyEdited: true
    }, this.updatePreviewCardFromBlogPostPreview)
  }

  handleBlogPostPreviewTitleChange = (e) => {
    this.setState({
      blogPostPreviewTitle: e.target.value,
      previewCardHasAlreadyBeenManuallyEdited: true
    }, this.updatePreviewCardFromBlogPostPreview)
  }

  handleBlogPostPreviewDescriptionChange = (e) => {
    this.setState({
      blogPostPreviewDescription: e.target.value,
      previewCardHasAlreadyBeenManuallyEdited: true
    }, this.updatePreviewCardFromBlogPostPreview)
  }

  handlePreviewCardButtonTextChange = (e) => {
    this.setState({
      previewCardButtonText: e.target.value,
      previewCardHasAlreadyBeenManuallyEdited: true
    }, this.updatePreviewCardFromBlogPostPreview)
  }

  updatePreviewCardFromBlogPostPreview = () => {
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
      button = `<div class='button-container'><a target='_blank' class='article-cta-primary' href=${this.state.externalLink}>${this.state.previewCardButtonText}</a></div>`
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

  updatePreviewCardVideoLink = (e) => {
    this.setState({videoLink: e.target.value}, this.updatePreviewCardVideoContent)
  }

  updatePreviewCardVideoDescription = (e) => {
    this.setState({videoDescription: e.target.value}, this.updatePreviewCardVideoContent)
  }

  updateTweetLink = (e) => {
    this.setState({ tweetLink: e.target.value }, this.updatePreviewCardTweetContent)
  }

  updateTweetImage = (e) => {
    this.setState({ tweetImage: e.target.value }, this.updatePreviewCardTweetContent)
  }

  updateTweetText = (e) => {
    this.setState({ tweetText: e.target.value }, this.updatePreviewCardTweetContent)
  }

  updateTweetAuthor = (e) => {
    this.setState({ tweetAuthor: e.target.value }, this.updatePreviewCardTweetContent)
  }

  updatePublishedAt = (e) => {
    this.setState({ publishedAt: e}, this.updatePreviewCardBasedOnType)
  }

  updatePreviewCardTweetContent = () => {
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

  updatePreviewCardVideoContent = () => {
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

  renderPreviewCardContentFields = () => {
    const preview_card_type = this.state.preview_card_type;
    let contentFields;
    if (['Tiny Image', 'Medium Image', 'Large Image'].includes(preview_card_type)) {
      contentFields = [
        <label>Link to an image with the dimensions in the preview:</label>,
        <input onChange={this.handleBlogPostPreviewImageChange} type='text' value={this.state.blogPostPreviewImage} />,
        <label>Title:</label>,
        <input onChange={this.handleBlogPostPreviewTitleChange} type='text' value={this.state.blogPostPreviewTitle} />,
        <label>Description: <i>(Please, choose the juiciest quote from the article that makes you want to read it and you should aim for 200 characters for the card description., for example: "I put jazz on and my kids work on Quill.")</i></label>,
        <input onChange={this.handleBlogPostPreviewDescriptionChange} type='text' value={this.state.blogPostPreviewDescription} />,
        <label>Button Text (button will link to whatever the external link is above, but the external link must be there prior to adding text here):</label>,
        <input onChange={this.handlePreviewCardButtonTextChange} type='text' value={this.state.previewCardButtonText} />
      ]
    } else if (preview_card_type === 'Custom HTML') {
      contentFields = [
        <label>Custom HTML:</label>,
        <textarea id="preview-markdown-content" onChange={this.handleCustomPreviewChange} rows={4} type="text" value={this.state.custom_preview_card_content} />,
        <i>If no author is supposed to show, please delete "&lt;p class=author>" through the next "&lt;/p>".</i>
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

  renderPreviewCardTypeDropdown = () => {
    return (<div>
      <label>Preview Card Template:</label>
      <ItemDropdown
        callback={this.handlePreviewCardTypeChange}
        items={['Tiny Image', 'Medium Image', 'Large Image', 'YouTube Video', 'Tweet', 'Custom HTML']}
        selectedItem={this.state.preview_card_type}
      />
    </div>)
  }

  renderDatepicker = () => {
    return (<div>
      <label>Published At Date:</label>
      <DatePicker onChange={this.updatePublishedAt} selected={this.state.publishedAt ? moment(this.state.publishedAt) : null} />
    </div>)
  }

  renderArticleMarkdownOrPreview = () => {
    let content, toolbarLeft, mdLink, dateDisplayed
    if (this.state.publishedAt) {
      dateDisplayed = this.state.publishedAt
    } else if (this.props.postToEdit) {
      dateDisplayed = this.props.postToEdit.updated_at
    } else {
      dateDisplayed = moment()
    }
    if (this.state.showArticlePreview) {
      toolbarLeft = <div />
      content = (<div id="article-container">
        <article>
          <BlogPostContent
            author={this.props.authors.find(a => a.id == this.state.author_id)}
            body={this.state.body}
            centerImages={this.state.centerImages}
            displayPaywall={false}
            title={this.state.title}
            updatedAt={dateDisplayed}
          />
        </article>
      </div>)
    } else {
        toolbarLeft = (<div className="toolbar-left">
          <p onClick={() => this.insertMarkdown('# ')}>H1</p>
          <p onClick={() => this.insertMarkdown('## ')}>H2</p>
          <p onClick={() => this.insertMarkdown('### ')}>H3</p>
          <i className="fas fa-bold" onClick={() => this.insertMarkdown('**', '**')} />
          <i className="fas fa-italic" onClick={() => this.insertMarkdown('*', '*')} />
          <i className="fas fa-list-ul" onClick={() => this.insertMarkdown('* ')} />
          <i className="fas fa-list-ol" onClick={() => this.insertMarkdown('1. ')} />
          <i className="fas fa-quote-left" onClick={() => this.insertMarkdown('> ')} />
          <i className="fas fa-link" onClick={() => this.insertMarkdown('[', '](http://samepicofdavecoulier.tumblr.com)')} />
          <i className="fas fa-file-image" onClick={() => this.insertMarkdown('![', '](http://cultofthepartyparrot.com/parrots/hd/parrot.gif)')} />
          <i className="fas fa-square" onClick={() => this.insertMarkdown("<a target='_blank' href='https://google.com' class='article-cta-primary'>\n", "\n</a>")} />
          <i className="far fa-square" onClick={() => this.insertMarkdown("<a target='_blank' href='https://google.com' class='article-cta-secondary'>\n", "\n</a>")} />
        </div>)
        content = <textarea id="markdown-content" onChange={this.handleBodyChange} rows={20} type="text" value={this.state.body} />
        mdLink = <a className='markdown-cheatsheet' href="http://commonmark.org/help/" target="_blank">Markdown Cheatsheet</a>
    }
    return (<div>
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
    </div>)

  }

  handlePremiumChange = () => {
    this.setState({premium: !this.state.premium});
  }

  handleCenterImagesChange = () => {
    this.setState({centerImages: !this.state.centerImages});
  }

  render = () => {
    const nullAuthor = {id: null, name: 'None'}
    const allTopics = this.props.topics.concat(this.props.studentTopics)
    return (
      <div>
        <a className='all-blog-posts-back-button' href='/cms/blog_posts'><i className='fas fa-chevron-left' /> All Blog Posts</a>
        <form>
          <label>Title:</label>
          <input onChange={this.handleTitleChange} type="text" value={this.state.title} />

          <label>SEO Meta Description:</label>
          <input onChange={this.handleSubtitleChange} type="text" value={this.state.subtitle} />

          <label>SEO Meta Image:</label>
          <input onChange={this.handleImageLinkChange} type="text" value={this.state.imageLink} />

          <label>Press Name (optional):</label>
          <input onChange={this.handlePressNameChange} type="text" value={this.state.pressName} />

          <div className='short-fields'>
            <div>
              <label>Author:</label>
              <ItemDropdown callback={this.handleAuthorChange} items={[nullAuthor].concat(this.props.authors)} selectedItem={this.props.authors.find(a => a.id === this.state.author_id) || nullAuthor} />
              <a className="link" href="/cms/authors/new" target="_blank">Create New Author</a>
            </div>
            <div>
              <label>Topic:</label>
              <ItemDropdown callback={this.handleTopicChange} items={allTopics} selectedItem={this.props.topics.find(t => t === this.state.topic)} />
            </div>
          </div>

          <div className='short-fields'>
            {this.renderPreviewCardTypeDropdown()}
            {this.renderDatepicker()}
          </div>

          <div className='short-fields'>
            <div>
              <label>External Link: (Optional, use only if this card should point to another website)</label>
              <input onChange={this.handleExternalLinkChange} value={this.state.externalLink} />
            </div>
          </div>

          <div>
            <label>Click the square below or drag an image into it to upload an image:</label>
            <Dropzone onDrop={this.onDrop} />
            <label style={{marginTop: '10px'}}>Here is the link to your uploaded image:</label>
            <input style={{marginBottom: '0px'}} value={this.state.uploadedImageLink} />
            <a className="link" href="/cms/images" style={{marginBottom: '10px'}} target="_blank">All Uploaded Images</a>
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
            <input checked={this.state.premium} className="premium-checkbox" onClick={this.handlePremiumChange} type='checkbox' />
          </div>

          <div>
            <label className="center-images-label">Center Images:</label>
            <input checked={this.state.centerImages} className="center-images-checkbox" onClick={this.handleCenterImagesChange} type='checkbox' />
          </div>

          {this.renderArticleMarkdownOrPreview()}

          <input onClick={(e) => { this.handleSubmitClick(e, true) }} type="submit" value="Publish" />

          {this.renderSaveDraftButton()}
          {this.renderUnpublishButton()}
          {this.renderSaveAndPreviewButton()}
        </form>
      </div>
    )
  }
}
