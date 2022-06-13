import * as React from 'react'

const ErrorPage: React.SFC<{text: string}> = (props) => {
  if (props.text === 'missing classroom activity') {
    const style = {width: '650px', margin: '30 auto', lineHeight: '2', textAlign: 'center'}
    return (
      <div style={style}>
        <p><strong>We could not find your classroom’s session.</strong></p>
        <p>For Quill Lessons, each classroom is provided with a unique session key in our database.</p>
        <p><strong>Please try performing a hard refresh on your page.</strong> On a Mac, press "Command + Shift + R" if using Chrome. On Windows, press "Control + F5" if using Chrome. Other browsers may have different key commands.</p>
        <p>If this does not solve the problem and you are a student, please ask your teacher to re-assign the lesson from the Quill activity dashboard.</p>
        <p>If this continues to happen, please contact us at hello@quill.org or by calling us at 646-442-1095</p>
      </div>
    )
  }
  return (
    <div>
      {props.text}
    </div>
  )
}

export default ErrorPage
