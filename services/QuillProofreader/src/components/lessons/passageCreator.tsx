import { Editor } from 'slate-react'
import Html from 'slate-html-serializer'
import * as React from 'react'

const BLOCK_TAGS: {[key: string]: string} = {
  p: "paragraph"
}
​​
const rules = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()]
      if (type) {
        return {
          object: type === 'span' ? 'inline' : 'block',
          type,
          data: {
            className: el.getAttribute('class'),
            dataOriginalIndex: el.getAttribute('data-original-index')
          },
          nodes: next(el.childNodes),
        }
      }
    },
    serialize(obj, children) {
      if (obj.object === 'block' || obj.object === 'inline') {
        switch (obj.type) {
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>
        }
      }
    },
  },
]

const html = new Html({ rules })

class PassageCreator extends React.Component {
  constructor(props) {
    super(props)

    const text = props.originalPassage ? props.originalPassage : '<p></p>'

    this.state = {
      value: html.deserialize(text)
    }
  }

  onChange = ({ value }) => {
    this.setState({ value }, this.props.onChange(html.serialize(value)))
  }

  renderNode = (args) => {
    switch (args.node.type) {
      case 'paragraph':
        return (
          <p {...args.attributes} className={args.node.data.get('className')}>
            {args.children}
          </p>
        )
    }
  }

  render() {
    return (
      <div>
        <Editor
          value={this.state.value}
          onChange={this.onChange}
          style={{minHeight: '100px', border: '1px solid black', padding: '10px'}}
          renderNode={this.renderNode}
        />
      </div>
    )
  }
}

export default PassageCreator
