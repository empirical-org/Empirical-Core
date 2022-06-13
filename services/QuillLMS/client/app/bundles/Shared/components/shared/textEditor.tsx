import * as React from 'react';
import * as Draft from 'draft-js';
import Editor from '@draft-js-plugins/editor'
import { convertFromHTML, convertToHTML } from 'draft-convert'
import * as Immutable from 'immutable'
import {
  RichUtils,
  EditorState,
} from 'draft-js'

import { richButtonsPlugin, } from '../../index'
import addLinkPluginPlugin from "../draftJSCustomPlugins/addLinkPlugin";

const HIGHLIGHT = 'highlight'
const HIGHLIGHTABLE = 'HIGHLIGHTABLE'
const LINK = 'LINK'
const MUTABLE = 'MUTABLE'

// interface TextEditorProps {
//   text: string;
//   boilerplate: string;
//   handleTextChange: Function;
// }
//
// interface TextEditorState {
//   text: any;
// }
//
const customRenderMap = Draft.DefaultDraftBlockRenderMap.merge(
  Immutable.Map({
    unstyled: {
      element: 'div',
      // will be used in convertFromHTMLtoContentBlocks
      aliasedElements: ['p'],
    },
  })
)

class TextEditor extends React.Component <any, any> {
  constructor(props: any) {
    super(props)
    const addLinkPlugin = addLinkPluginPlugin

    this.state = {
      text: props.EditorState.createWithContent(this.contentState(props.text || '')),
      richButtonsPlugin: richButtonsPlugin(),
      addLinkPlugin: addLinkPlugin,
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const { boilerplate, EditorState, handleTextChange, ContentState, } = this.props
    if (nextProps.boilerplate !== boilerplate) {
      this.setState({text: EditorState.createWithContent(ContentState.createFromBlockArray(this.contentState(nextProps.boilerplate)))},
        () => {
          handleTextChange(this.html())
        }
      )
    }
  }

  html = () => {
    const { text, } = this.state
    return convertToHTML({
      styleToHTML: (style) => {
        if (style === HIGHLIGHTABLE) {
          return <mark />;
        }
      },
      entityToHTML: (entity, originalText) => {
        if (entity.type === LINK) {
          return <a href={entity.data.url}>{originalText}</a>;
        }
        return originalText;
      }
    })(text.getCurrentContent());
  }

  contentState = (html) => {
    return convertFromHTML({
      htmlToStyle: (nodeName, node, currentStyle) => {
        if (nodeName === 'mark') {
          return currentStyle.add(HIGHLIGHTABLE);
        } else {
          return currentStyle;
        }
      },
      htmlToEntity: (nodeName, node, createEntity) => {
        if (nodeName === 'a') {
          return createEntity(
            LINK,
            MUTABLE,
            {url: node.href}
          )
        }
      },
    })(html);
  }

  handleTextChange = (e: Event) => {
    const { handleTextChange, } = this.props
    this.setState({text: e}, () => {
      handleTextChange(this.html().replace(/<p><\/p>/g, '<br/>').replace(/&nbsp;/g, '<br/>'))
    });
  }

  keyBindingFn = (event) => {
    if (Draft.KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 72) { return HIGHLIGHT; }
    return Draft.getDefaultKeyBinding(event);
  }

  // command: string returned from this.keyBidingFn(event)
  // if this function returns 'handled' string, all ends here.
  // if it return 'not-handled', handling of :command will be delegated to Editor's default handling.
  onKeyCommand = (command) => {
    const { text, } = this.state
    let newState;
    if (command === HIGHLIGHT) {
      newState = Draft.RichUtils.toggleInlineStyle(text, HIGHLIGHTABLE);
    }

    if (newState) {
      this.setState({ text: newState });
      return 'handled';
    }
    return 'not-handled';
  }

  // this code was pasted from the tutorial here:
  // https://medium.com/@siobhanpmahoney/building-a-rich-text-editor-with-react-and-draft-js-part-2-2-embedding-links-d71b57d187a7
  handleAddLink = () => {
    const { text } = this.state
    const editorState = text;
    const selection = editorState.getSelection();
    const link = window.prompt('Paste the link -')
    if (!link) {
      this.handleTextChange(RichUtils.toggleLink(editorState, selection, null));
      return 'handled';
    }
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity(LINK, MUTABLE, { url: link });
    const newEditorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    this.handleTextChange(RichUtils.toggleLink(newEditorState, selection, entityKey))
  }

  render() {
    const { shouldCheckSpelling } = this.props;
    const { richButtonsPlugin, text, addLinkPlugin } = this.state
    const {
      // inline buttons
      ItalicButton, BoldButton, UnderlineButton, createStyleButton,
      // block buttons
      BlockquoteButton, ULButton, H3Button,
    } = richButtonsPlugin;

    const HighlightButton = createStyleButton({ style: HIGHLIGHTABLE, label: 'Highlight', });

    const styleMap = {
      HIGHLIGHTABLE: {
        'background-color': '#FFFF00',
      },
    };

    return (
      <div className="text-editor card is-fullwidth">
        <header className="card-header">
          <div className="myToolbar" style={{margin: '1em'}}>
            <H3Button />
            <BoldButton />
            <ItalicButton />
            <UnderlineButton />
            <BlockquoteButton />
            <ULButton />
            <HighlightButton />
            <button className="interactive-wrapper add-link" id="link-url" onClick={this.handleAddLink} type="button">
              <span>Link</span>
            </button>
          </div>
        </header>
        <div className="card-content">
          <div className="content landing-page-html-editor">
            <Editor
              blockRenderMap={customRenderMap}
              customStyleMap={styleMap}
              editorState={text}
              handleKeyCommand={this.onKeyCommand}
              keyBindingFn={this.keyBindingFn}
              onChange={this.handleTextChange}
              plugins={[richButtonsPlugin, addLinkPlugin]}
              spellCheck={!!shouldCheckSpelling}
            />
          </div>
        </div>
      </div>
    )
  }

}

export { TextEditor }
