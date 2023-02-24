import * as React from 'react';
import Dropzone from 'react-dropzone'
import moment from 'moment'
import { EditorState, ContentState } from 'draft-js';
import "react-dates/initialize";
import { SingleDatePicker } from 'react-dates'

import ItemDropdown from '../../general_components/dropdown_selectors/item_dropdown.jsx'
import PreviewCard from '../../shared/preview_card.jsx';
import BlogPostContent from '../../blog_posts/blog_post_content'
import getAuthToken from '../../modules/get_auth_token'
import { requestPost, requestPut, } from '../../../../../modules/request/index'
import { BLOG_POST_TO_COLOR, } from '../../blog_posts/blog_post_constants'
import { smallWhiteCheckIcon, } from '../../../../Shared/index'

const defaultPreviewCardContent = `<div class='preview-card-body'>
   <h3>Party Parrot Parade</h3>
   <p>There exist many excellent party parrots.</p>
</div>
<div class='preview-card-footer'>
  <p class='author'>by Quill Staff</p>
</div>`;

export const EDIT = 'edit'
export const NEW = 'new'
const STANDARD = 'Standard'
const CUSTOM_HTML = 'Custom HTML'

export default class CreateOrEditBlogPost extends React.Component {
  constructor(props) {
    super(props);

    const { postToEdit, action } = props
    const {
      id,
      title,
      subtitle,
      image_link,
      body,
      author_id,
      topic,
      draft,
      slug,
      preview_card_content,
      premium,
      press_name,
      published_at,
      external_link,
      center_images,
    } = postToEdit
    // set state to empty values or those of the postToEdit

    this.state = {
      previewCardHasAlreadyBeenManuallyEdited: action !== NEW,
      id,
      title,
      subtitle,
      imageLink: image_link,
      body,
      author_id,
      topic,
      draft,
      slug,
      preview_card_content,
      custom_preview_card_content: preview_card_content,
      preview_card_type: action === NEW ? STANDARD : CUSTOM_HTML,
      blogPostPreviewImage: 'http://placehold.it/300x135',
      blogPostPreviewTitle: title,
      blogPostPreviewDescription: 'Write your description here, but be careful not to make it too long!',
      videoLink: 'https://www.youtube.com/watch?v=oVXZTmi2ruI',
      videoDescription: "I'll write it myself, and we'll do it live!",
      tweetLink: 'https://twitter.com/EdSurge/status/956861254982873088',
      tweetImage: 'http://placehold.it/300x135/00998a/fff',
      tweetText: '"Climbing up Ben Bloom’s learning hierarchy won’t be easy, but it is necessary if we want to build education technology capable of helping learners move beyond basic remembering and understanding."',
      tweetAuthor: 'EdSurge',
      premium,
      pressName: press_name,
      publishedAt: published_at,
      externalLink: external_link,
      centerImages: center_images,
      focused: false
    };
  }

  componentDidMount = () => {
    this.updatePreviewCardBasedOnType();
  }

  changeAuthor = (e) => {
    this.setState({author_id: e.id}, this.updatePreviewCardFromBlogPostPreview)
  }

  changePreviewCardType = (e) => {
    this.setState({ preview_card_type: e }, this.updatePreviewCardBasedOnType)
  }

  changeTopic = (e) => {
    this.setState({topic: e})
  }

  goToPreview = () => {
    const { studentTopics, } = this.props
    const { slug, externalLink, topic, } = this.state
    let url
    if (externalLink) {
      url = externalLink
    } else if (studentTopics.includes(topic)) {
      url = `/student-center/${slug}`
    } else {
      url = `/teacher-center/${slug}`
    }
    window.open(url, '_blank')
  }

  handleBlogPostPreviewDescriptionChange = (e) => {
    this.setState({
      blogPostPreviewDescription: e.target.value,
      previewCardHasAlreadyBeenManuallyEdited: true
    }, this.updatePreviewCardFromBlogPostPreview)
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

  handleBodyChange = (e) => {
    this.setState({body: e.target.value})
    const container = document.getElementById('markdown-content');
    container.rows = 4;
    const rows = Math.ceil((container.scrollHeight - 64) / 20.3);
    container.rows = 2 + rows;
  }

  handleCenterImagesChange = () => {
    this.setState(prevState => ({centerImages: !prevState.centerImages}));
  }

  handleClickEdit = () => {
    this.setState({showArticlePreview: false})
  }

  handleClickPreview = () => {
    this.setState({showArticlePreview: true})
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

  handleDrop = (acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const data = new FormData()
      data.append('file', file)
      fetch(`${import.meta.env.VITE_DEFAULT_URL}/cms/images`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': getAuthToken()
        },
        body: data
      })
        .then(response => response.json()) // if the response is a JSON object
        .then(response => this.setState({uploadedMediaLink: response.url})); // Handle the success response object
    });
  }

  handleExternalLinkChange = (e) => {
    this.setState({externalLink: e.target.value})
  }

  handleImageLinkChange = (e) => {
    const { value, } = e.target;
    const { previewCardHasAlreadyBeenManuallyEdited, } = this.state
    let state = { imageLink: value };
    if(!previewCardHasAlreadyBeenManuallyEdited) {
      state['blogPostPreviewImage'] = targetValue;
    }
    this.setState(state, () => {
      if(!previewCardHasAlreadyBeenManuallyEdited) {
        this.updatePreviewCardFromBlogPostPreview();
      }
    });
  }

  handleInsertBold = () => this.insertMarkdown('**', '**')

  handleInsertFileImage = () => this.insertMarkdown('![', '](http://cultofthepartyparrot.com/parrots/hd/parrot.gif)')

  handleInsertIFrame = () => this.insertMarkdown('<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>')

  handleInsertH1 = () => this.insertMarkdown('# ')

  handleInsertH2 = () => this.insertMarkdown('## ')

  handleInsertH3 = () => this.insertMarkdown('### ')

  handleInsertItalic = () => this.insertMarkdown('*', '*')

  handleInsertLink = () => this.insertMarkdown('[', '](http://samepicofdavecoulier.tumblr.com)')

  handleInsertOrderedList = () => this.insertMarkdown('1. ')

  handleInsertPrimaryButton = () => this.insertMarkdown("<a target='_blank' href='https://google.com' class='article-cta-primary'>\n", "\n</a>")

  handleInsertQuote = () => this.insertMarkdown('> ')

  handleInsertSecondaryButton = () => this.insertMarkdown("<a target='_blank' href='https://google.com' class='article-cta-secondary'>\n", "\n</a>")

  handleInsertUnorderedList = () => this.insertMarkdown('* ')

  handlePremiumChange = () => {
    this.setState(prevState => ({premium: !prevState.premium}));
  }

  handlePressNameChange = (e) => {
    this.setState({ pressName: e.target.value })
  }

  handlePreviewCardVideoDescriptionChange = (e) => {
    this.setState({videoDescription: e.target.value}, this.updatePreviewCardVideoContent)
  }

  handlePreviewCardVideoLinkChange = (e) => {
    this.setState({videoLink: e.target.value}, this.updatePreviewCardVideoContent)
  }

  handlePublishClick = (e) => this.handleSubmitClick(e, true)

  handlePublishedAtChange = (e) => {
    this.setState({ publishedAt: e}, this.updatePreviewCardBasedOnType)
  }

  handleSaveAndPreviewClick = (e) => {
    const { draft, } = this.state
    this.handleSubmitClick(e, !draft, false, this.goToPreview)
  }

  handleSaveDraftClick = (e) => { this.handleSubmitClick(e, false) }

  handleSubmitClick = (e, shouldPublish, unpublish = false, callback) => {
    const { action, postToEdit, } = this.props
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
    let requestAction
    let url = `${import.meta.env.VITE_DEFAULT_URL}/cms/blog_posts/`

    const blogPost = {
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
        published_at: publishedAt ? new Date(publishedAt) : null,
        external_link: externalLink,
        center_images: centerImages,
        press_name: pressName
      }
    }

    if (action === NEW && !unpublish) {
      requestPost(
        url,
        blogPost,
        (body) => {
          alert('Post added successfully!');
          window.location.href = (`/cms/blog_posts/${body.id}/edit`)
          callback ? callback() : null
        },
        (body) => {
          alert("😨 Rut roh. Something went wrong! (Don't worry, it's probably not your fault.)");
          callback ? callback() : null
        }
      )
    } else {
      url += postToEdit.id
      requestPut(
        url,
        blogPost,
        (body) => {
          this.setState({draft: body.draft})
          alert('Update successful!');
          callback ? callback() : null
        },
        (body) => {
          alert("😨 Rut roh. Something went wrong! (Don't worry, it's probably not your fault.)");
          callback ? callback() : null
        }
      )
    }
  }

  handleSubtitleChange = (e) => {
    const { value, } = e.target;
    const { previewCardHasAlreadyBeenManuallyEdited, } = this.state
    let state = {subtitle: value};
    if(!previewCardHasAlreadyBeenManuallyEdited) {
      state['blogPostPreviewDescription'] = value;
    }
    this.setState(state, () => {
      if(!previewCardHasAlreadyBeenManuallyEdited) {
        this.updatePreviewCardFromBlogPostPreview();
      }
    });
  }

  handleTitleChange = (e) => {
    const { value, } = e.target;
    const { previewCardHasAlreadyBeenManuallyEdited, } = this.state
    let state = { title: value };
    if(!previewCardHasAlreadyBeenManuallyEdited) {
      state['blogPostPreviewTitle'] = value;
    }
    this.setState(state, () => {
      if(!previewCardHasAlreadyBeenManuallyEdited) {
        this.updatePreviewCardFromBlogPostPreview();
      }
    });
  }

  handleTweetAuthorChange = (e) => {
    this.setState({ tweetAuthor: e.target.value }, this.updatePreviewCardTweetContent)
  }

  handleTweetImageChange = (e) => {
    this.setState({ tweetImage: e.target.value }, this.updatePreviewCardTweetContent)
  }

  handleTweetLinkChange = (e) => {
    this.setState({ tweetLink: e.target.value }, this.updatePreviewCardTweetContent)
  }

  handleTweetTextChange = (e) => {
    this.setState({ tweetText: e.target.value }, this.updatePreviewCardTweetContent)
  }

  handleUnpublishClick = (e) => { this.handleSubmitClick(e, false, true) }

  insertMarkdown = (startChar, endChar = null) => {
    /*
      TODO:
        - Special behaviors:
          - startChars should automatically be placed at the front of the line
          - if multiple lines are highlighted, we should insert startChar at beginning of each line
        - Extract this and the buttons into a separate component
    */
    const { body, } = this.state
    const container = document.getElementById('markdown-content');
    let newValue = body;
    if (container.selectionStart || container.selectionStart === 0) {
      let startPos = container.selectionStart;
      let endPos = container.selectionEnd;
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

  updatePreviewCardBasedOnType = () => {
    const { preview_card_type, custom_preview_card_content, } = this.state
    switch (preview_card_type) {
      case STANDARD:
        this.updatePreviewCardFromBlogPostPreview()
        break;
      default:
        this.setState({ preview_card_content: custom_preview_card_content })
    }
  }

  updatePreviewCardFromBlogPostPreview = () => {
    const { authors, } = this.props
    const {
      publishedAt,
      externalLink,
      blogPostPreviewImage,
      blogPostPreviewTitle,
      blogPostPreviewDescription,
      author_id,
    } = this.state
    const author = authors.find(a => a.id == author_id)
    let footerContent, button
    if (author) {
      footerContent = `<p class='author'>by ${author.name}</p>`
    } else if (publishedAt) {
      footerContent = `<p class='published'>${this.formatDate(new Date(publishedAt))}</p>`
    } else {
      footerContent = `<span/>`
    }
    const previewCardContent = `<img class='preview-card-image' src='${blogPostPreviewImage}' />
    <div class='preview-card-body'>
       <h3>${blogPostPreviewTitle}</h3>
       <p>${blogPostPreviewDescription}</p>
    </div>
    <div class='preview-card-footer'>
      ${footerContent}
    </div>`;
    this.setState({ preview_card_content: previewCardContent })
  }

  updatePreviewCardTweetContent = () => {
    const { authors, } = this.props
    const { publishedAt, tweetImage, tweetText, tweetAuthor, author_id, } = this.state
    const author = authors.find(a => a.id == author_id)
    let footerContent
    if (author) {
      footerContent = `<p class='author'>by ${author.name}</p>`
    } else if (publishedAt) {
      footerContent = `<p class='published'>${this.formatDate(new Date(publishedAt))}</p>`
    } else {
      footerContent = `<span/>`
    }
    const previewCardContent = `<img class='preview-card-image' src='${tweetImage}' />
    <div class='preview-card-body'>
       <p>${tweetText}</p>
       <p class='author'>@${tweetAuthor}</p>
    </div>
    <div class='preview-card-footer'>
      ${footerContent}
    </div>`;
    this.setState({ preview_card_content: previewCardContent, previewCardHasAlreadyBeenManuallyEdited: true })
  }

  updatePreviewCardVideoContent = () => {
    const { videoLink, author_id, publishedAt, videoDescription, } = this.state
    const { authors, } = this.props
    const matchedQueryParameter = videoLink.match(/\?v=(.*)(\&)/) || videoLink.match(/\?v=(.*)$/)
    const embedUrl = `https://www.youtube-nocookie.com/embed/${matchedQueryParameter[1]}?rel=0&amp;controls=0&amp;showinfo=0&player=html5`
    const author = authors.find(a => a.id == author_id)
    let footerContent
    if (author) {
      footerContent = `<p class='author'>by ${author.name}</p>`
    } else if (publishedAt) {
      footerContent = `<p class='published'>${this.formatDate(new Date(publishedAt))}</p>`
    } else {
      footerContent = `<span/>`
    }
    const previewCardContent = `<div class='video-holder'>
      <iframe src="${embedUrl}" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>
    </div>
    <div class='preview-card-body'>
       <p>${videoDescription}</p>
    </div>
    <div class='preview-card-footer'>
      ${footerContent}
    </div>`;
    this.setState({ preview_card_content: previewCardContent, previewCardHasAlreadyBeenManuallyEdited: true })
  }

  formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
    return dateTimeFormat.format(date)
  }

  renderArticleMarkdownOrPreview = () => {
    const { publishedAt, showArticlePreview, body, centerImages, author_id, title, } = this.state
    const { postToEdit, authors, } = this.props
    let content, toolbarLeft, mdLink, dateDisplayed
    if (publishedAt) {
      dateDisplayed = publishedAt
    } else if (postToEdit) {
      dateDisplayed = postToEdit.updated_at
    } else {
      dateDisplayed = new Date()
    }
    if (showArticlePreview) {
      toolbarLeft = <div />
      content = (<div id="article-container">
        <article>
          <BlogPostContent
            author={authors.find(a => a.id == author_id)}
            body={body}
            centerImages={centerImages}
            displayPaywall={false}
            title={title}
            updatedAt={dateDisplayed}
          />
        </article>
      </div>)
    } else {
      toolbarLeft = (<div className="toolbar-left">
        <button className="interactive-wrapper" onClick={this.handleInsertH1} type="button">H1</button>
        <button className="interactive-wrapper" onClick={this.handleInsertH2} type="button">H2</button>
        <button className="interactive-wrapper" onClick={this.handleInsertH3} type="button">H3</button>
        <i className="fas fa-bold" onClick={this.handleInsertBold} />
        <i className="fas fa-italic" onClick={this.handleInsertItalic} />
        <i className="fas fa-list-ul" onClick={this.handleInsertUnorderedList} />
        <i className="fas fa-list-ol" onClick={this.handleInsertOrderedList} />
        <i className="fas fa-quote-left" onClick={this.handleInsertQuote} />
        <i className="fas fa-link" onClick={this.handleInsertLink} />
        <i className="fas fa-file-image" onClick={this.handleInsertFileImage} />
        <i className="fas fa-video" onClick={this.handleInsertIFrame} />
        <i className="fas fa-square" onClick={this.handleInsertPrimaryButton} />
        <i className="far fa-square" onClick={this.handleInsertSecondaryButton} />
      </div>)
      content = <textarea id="markdown-content" onChange={this.handleBodyChange} rows={20} type="text" value={body} />
      mdLink = <a className='quill-button fun outlined secondary focus-on-light' href="http://commonmark.org/help/" rel="noopener noreferrer" target="_blank">Markdown Cheatsheet</a>
    }
    return (
      <div>
        <div className="article-content-container">
          <div id="article-preview-bar">
            {toolbarLeft}
            <div>
              <span className={`article-tab ${showArticlePreview ? null : 'active'}`} onClick={this.handleClickEdit}>Edit</span>
              <span className={`article-tab ${showArticlePreview ? 'active' : null}`} onClick={this.handleClickPreview}>Preview</span>
            </div>
          </div>
          {content}
        </div>
        {mdLink}
      </div>
    )

  }

  renderDatepicker = () => {
    const { focused, publishedAt, } = this.state
    const dropdownIconStyle = focused ? { transform: 'rotate(180deg)', } : null;
    return (
      <div>
        <label>Published At Date:</label>
        <SingleDatePicker
          customInputIcon={<img alt="dropdown indicator" src="https://assets.quill.org/images/icons/dropdown.svg" style={dropdownIconStyle} />}
          date={publishedAt ? moment(publishedAt) : null}
          focused={focused}
          id="date-picker"
          inputIconPosition="after"
          navNext="›"
          navPrev="‹"
          numberOfMonths={1}
          onDateChange={this.handlePublishedAtChange}
          onFocusChange={({ focused }) => this.setState({ focused })}
        />
      </div>
    )
  }

  renderPreviewCardContentFields = () => {
    const {
      preview_card_type,
      blogPostPreviewImage,
      blogPostPreviewTitle,
      blogPostPreviewDescription,
      custom_preview_card_content,
      tweetLink,
      tweetImage,
      tweetText,
      tweetAuthor,
      videoLink,
      videoDescription
    } = this.state
    let contentFields;
    if ([STANDARD].includes(preview_card_type)) {
      contentFields = [
        <label key="title-label">Title:</label>,
        <input key="title" onChange={this.handleBlogPostPreviewTitleChange} type='text' value={blogPostPreviewTitle} />,
        <label key="description-label">Description: <i>(Please, choose the juiciest quote from the article that makes you want to read it and you should aim for 200 characters for the card description., for example: &#34;I put jazz on and my kids work on Quill.&#34;)</i></label>,
        <input key="description" onChange={this.handleBlogPostPreviewDescriptionChange} type='text' value={blogPostPreviewDescription} />,
      ]
    } else if (preview_card_type === CUSTOM_HTML) {
      contentFields = [
        <label key="custom-html-label">Custom HTML:</label>,
        <textarea id="preview-markdown-content" key="custom-html" onChange={this.handleCustomPreviewChange} rows={4} type="text" value={custom_preview_card_content} />,
        <i key="info">If no author is supposed to show, please delete &#34;&lt;p class=author&gt;&#34; through the next &#34;&lt;/p&gt;&#34;.</i>
      ]
    }

    return (<div id='preview-card-content-fields'>{contentFields}</div>)
  }

  renderPreviewCardTypeDropdown = () => {
    const { preview_card_type, } = this.state
    return (
      <div className="preview-card-container">
        <label>Preview Card Template:</label>
        <ItemDropdown
          callback={this.changePreviewCardType}
          className="blog-dropdown"
          items={[STANDARD, CUSTOM_HTML]}
          selectedItem={preview_card_type}
        />
      </div>
    )
  }

  renderSaveAndPreviewButton = () => {
    const { action, } = this.props

    if (action === EDIT) {
      return <input className="quill-button large outlined secondary focus-on-light" onClick={this.handleSaveAndPreviewClick} type="button" value="Save and Preview" />
    }
  }

  renderSaveDraftButton = () => {
    const { action, } = this.props
    const { draft, } = this.state
    if (action === NEW || draft) {
      return <input className="quill-button large outlined secondary focus-on-light" onClick={this.handleSaveDraftClick} type="button" value="Save Draft" />
    }
  }

  renderUnpublishButton = () => {
    const { action, } = this.props
    const { draft, } = this.state
    if (action === EDIT && !draft) {
      return <input className="quill-button large outlined secondary focus-on-light" onClick={this.handleUnpublishClick} type="button" value="Unpublish & Save Draft" />
    }
  }

  renderPremiumCheckbox = () => {
    const { premium, } = this.state

    let checkbox = <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" onClick={this.handlePremiumChange} type="button" />

    if (premium) {
      checkbox = (<button className="quill-checkbox selected" onClick={this.handlePremiumChange} type="button">
        <img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} />
      </button>)
    }

    return (
      <div className="checkbox-wrapper">
        {checkbox}
        <label className="premium-label">Show only to Premium Members</label>
      </div>
    )
  }

  renderCenterImagesCheckbox = () => {
    const { centerImages, } = this.state
    let checkbox = <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" onClick={this.handleCenterImagesChange} type="button" />

    if (centerImages) {
      checkbox = (<button className="quill-checkbox selected" onClick={this.handleCenterImagesChange} type="button">
        <img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} />
      </button>)
    }

    return (
      <div className="checkbox-wrapper">
        {checkbox}
        <label className="premium-label">Center Images</label>
      </div>
    )
  }

  render = () => {
    const { topics, studentTopics, authors, } = this.props
    const {
      title,
      subtitle,
      imageLink,
      pressName,
      author_id,
      topic,
      externalLink,
      uploadedMediaLink,
      preview_card_content,
      premium,
      centerImages,
    } = this.state
    const nullAuthor = {id: null, name: 'None'}
    const allTopics = topics.concat(studentTopics)
    return (
      <div>
        <a className='quill-button fun outlined secondary focus-on-light' href='/cms/blog_posts'><i className='fas fa-chevron-left' />&nbsp;Back to All Blog Posts</a>
        <form>
          <div className="left-column">
            <label>Title:</label>
            <input onChange={this.handleTitleChange} type="text" value={title} />

            <label>SEO Meta Description:</label>
            <input onChange={this.handleSubtitleChange} type="text" value={subtitle} />

            <label>SEO Meta Image:</label>
            <input onChange={this.handleImageLinkChange} type="text" value={imageLink} />

            <label>Press Name (optional):</label>
            <input onChange={this.handlePressNameChange} type="text" value={pressName} />

            <div className='short-fields'>
              <div>
                <label>Author:</label>
                <ItemDropdown callback={this.changeAuthor} className="blog-dropdown" items={[nullAuthor].concat(authors)} selectedItem={authors.find(a => a.id === author_id) || nullAuthor} />
                <a className="quill-button fun outlined secondary focus-on-light" href="/cms/authors/new" target="_blank">Create New Author</a>
              </div>
              <div>
                <label>Topic:</label>
                <ItemDropdown callback={this.changeTopic} className="blog-dropdown" items={allTopics} selectedItem={topics.find(t => t === topic)} />
              </div>
            </div>

            <div className='short-fields'>
              {this.renderPreviewCardTypeDropdown()}
              {this.renderDatepicker()}
            </div>

            <div>
              <label>External Link: (Optional, use only if this card should point to another website)</label>
              <input onChange={this.handleExternalLinkChange} value={externalLink} />
            </div>

            <div className="media-upload-container">
              <label>Click the square below or drag an image into it to upload an image or video:</label>
              <div className="dropzone-container"><Dropzone onDrop={this.handleDrop} /></div>
              <label style={{marginTop: '10px'}}>Here is the link to your uploaded image or video:</label>
              <input value={uploadedMediaLink} />
              <a className="quill-button fun secondary outlined focus-on-light" href="/cms/images" target="_blank">All Uploaded Media</a>
            </div>

            {this.renderCenterImagesCheckbox()}

            {this.renderPremiumCheckbox()}

            {this.renderArticleMarkdownOrPreview()}

            <div className="save-buttons">
              {this.renderSaveDraftButton()}
              {this.renderUnpublishButton()}
              {this.renderSaveAndPreviewButton()}

              <input className="quill-button contained large primary focus-on-light" onClick={this.handlePublishClick} type="button" value="Publish" />
            </div>
          </div>

          <div className="right-column">
            <div>
              <label>Card Preview:</label>
              <PreviewCard color={BLOG_POST_TO_COLOR[topic]} content={preview_card_content} />
            </div>

            <div className="preview-card-container">
              <label>Preview Card Content:</label>
              {this.renderPreviewCardContentFields()}
            </div>
          </div>

        </form>
      </div>
    )
  }
}

CreateOrEditBlogPost.defaultProps = {
  postToEdit: {
    id: null,
    subtitle: '',
    image_link: '',
    body: '',
    author_id: 11 /* Quill Staff */,
    topic: 'Webinars',
    draft: true,
    slug: true,
    preview_card_content: defaultPreviewCardContent,
    title: 'Write Your Title Here',
    premium: false,
    press_name: null,
    published_at: null,
    external_link: null,
    center_images: false
  }
}
