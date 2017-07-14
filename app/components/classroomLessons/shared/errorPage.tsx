import * as React from 'react'

const ErrorPage: React.SFC<{text: string}> = (props) => {
 return <div>
     {props.text}
   </div>
}

export default ErrorPage
