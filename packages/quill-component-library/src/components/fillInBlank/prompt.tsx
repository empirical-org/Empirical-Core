import React from 'react'

interface PromptProps {
  style: any;
  elements: object;
}

const Prompt = (props: PromptProps) => (
    <div style={props.style} >
      {props.elements}
    </div>
)

export { Prompt }
