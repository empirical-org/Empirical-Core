import * as React from "react";
import { Card } from '../../../Shared/index'

const Cards = () => {
  return (
    <div id="cards">
      <h2 className="style-guide-h2">Cards</h2>
      <div className="element-container">
        <p>Note that there are no max widths set on these cards. For the purposes of this display, they are set to 546px and 167px respectively.</p>
        <h3 className="style-guide-h2">Card with image</h3>
        <div className="card-with-img-container element-row">
          <div className="extra-big-element">
            <pre>
              {`<Card
  onClick={() => {}}
  imgSrc={\`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/onboarding/business-building.svg\`}
  imgAlt="office building"
  header="Other"
  text="Tip: many non-traditional educators and learners begin by assigning our featured activity packs."
/>`}
            </pre>
            <Card
              header="Other"
              imgAlt="office building"
              imgSrc={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/onboarding/business-building.svg`}
              onClick={() => {}}
              text="Tip: many non-traditional educators and learners begin by assigning our featured activity packs."
            />
          </div>
        </div>
        <h3 className="style-guide-h2">Card without image</h3>
        <div className="card-without-img-container element-row">
          <div className="extra-big-element">
            <pre>
              {`<Card
  onClick={() => {}}
  header="Headline text"
  text="Secondary text"
/>`}
            </pre>
            <Card
              header="Headline text"
              onClick={() => {}}
              text="Secondary text"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cards
