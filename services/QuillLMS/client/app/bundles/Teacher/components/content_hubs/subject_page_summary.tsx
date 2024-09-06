import * as React from 'react';

import { EXTRA_LARGE_ICON_BASE_SRC, } from '../../../Shared/index'

const closeReadingSrc = `${EXTRA_LARGE_ICON_BASE_SRC}/search-document.svg`
const constructingClaimsSrc = `${EXTRA_LARGE_ICON_BASE_SRC}/research-books.svg`
const sentenceFundamentalsSrc = `${EXTRA_LARGE_ICON_BASE_SRC}/comment-document.svg`

const SubjectPageSummary = ({ paragraphCopy, }) => (
  <section className="summary-section">
    <div className="container">
      <h2>Build Content Knowledge & Writing Skills With Reading for Evidence</h2>
      <p>{paragraphCopy}</p>
      <div className="summary-items">
        <div className="summary-item">
          <img alt="" src={closeReadingSrc} />
          <h3>Close reading</h3>
          <p>Every activity begins with a structured highlighting task as an entry point to the text. Then, students read and reread up to ten times in the process of developing their responses.</p>
        </div>
        <div className="summary-item">
          <img alt="" src={constructingClaimsSrc} />
          <h3>Constructing evidence-based claims</h3>
          <p>Students receive custom feedback developed by real teachers to help them use what they have read to craft strong sentences.</p>
        </div>
        <div className="summary-item">
          <img alt="" src={sentenceFundamentalsSrc} />
          <h3>Sentence fundamentals</h3>
          <p>Practice with conjunctions like because, but, and so provides students with a framework to combine sentences and express complex ideas effectively. Once they’ve clearly captured these ideas in their response, students receive grammar and spelling guidance too.</p>
        </div>
      </div>
    </div>
  </section>
)

export default SubjectPageSummary
