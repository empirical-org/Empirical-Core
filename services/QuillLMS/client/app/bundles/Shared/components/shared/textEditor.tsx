import * as React from 'react';
import * as Draft from 'draft-js';
import Editor from '@draft-js-plugins/editor'
import { convertFromHTML, convertToHTML } from 'draft-convert'
import * as Immutable from 'immutable'

import { richButtonsPlugin, } from '../../index'

const HIGHLIGHT = 'highlight'
const HIGHLIGHTABLE = 'HIGHLIGHTABLE'

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

    this.state = {
      text: props.EditorState.createWithContent(this.contentState(props.text || '')),
      richButtonsPlugin: richButtonsPlugin()
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

  render() {
    const { richButtonsPlugin, text, } = this.state
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
      <div className="card is-fullwidth">
        <header className="card-header">
          <div className="myToolbar" style={{margin: '1em'}}>
            <H3Button />
            <BoldButton />
            <ItalicButton />
            <UnderlineButton />
            <BlockquoteButton />
            <ULButton />
            <HighlightButton />
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
              plugins={[richButtonsPlugin]}
            />
          </div>
        </div>
      </div>
    )
  }

}

export { TextEditor }
