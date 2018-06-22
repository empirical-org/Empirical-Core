import * as React from 'react' 

function fontSizeToClass(fontSize:number):string  {
  switch (fontSize) {
    case 1: 
      return 'fs-sm'
    case 2: 
      return 'fs-md'
    case 3:
      return 'fs-lg'
    default:
      return 'fs-md'
  }
}

const Article = ({activity_id, article, title, markAsRead, fontSize}): JSX.Element => (
  <div key={activity_id} className="card question-wrapper
  ">
    <div className="card-header">
      <h3 className="card-title">Read The Following Passage Carefully</h3>
    </div>
    <div className="card-body article-body">
      <h2 className="mb3">{title}</h2>  
      <p className={fontSizeToClass(fontSize)} onSelect={(e) => console.log(e)} dangerouslySetInnerHTML={{__html: article}}></p>
    </div>
    <div className="card-footer d-fl-r jc-sb">
      <div className="m-r-1 d-fl-r ai-c">When you have finished reading the passage, click done.</div>
      <button className="btn btn-primary" onClick={markAsRead}>Done</button>
    </div>
  </div>
);

export default Article;