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
  <div key={activity_id} className="card article-card">
    <div className="card-header">
      <h2>{title}</h2>
    </div>
    <div className="card-body">
      <p className={fontSizeToClass(fontSize)} onSelect={(e) => console.log(e)} dangerouslySetInnerHTML={{__html: article}}></p>
    </div>
    <div className="card-footer d-fl-r jc-sb">
      <div className="m-r-1 d-fl-r ai-c">When you have finished reading the passage, click done.</div>
      <button className="btn btn-primary" onClick={markAsRead}>Done</button>
    </div>
  </div>
);

export default Article;