import * as React from 'react';

const IMG_URLS = [
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_1.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_2.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_3.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_4.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_5.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_6.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_7.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_8.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_9.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_10.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_11.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_12.png"
]
const INACTIVE = 'inactive';

export const EvidenceHomeSection = () => {
  let imageUrlIndex = 0;
  const [evidenceImageUrl, setEvidenceImageUrl] = React.useState<any>(IMG_URLS[0])

  React.useEffect(() => {
    setInterval(() => {
      handleSetImageUrl();
    }, 1000);
  }, [])

  function handleSetImageUrl() {
    if(imageUrlIndex === IMG_URLS.length - 1) {
      setTimeout(() => {
        imageUrlIndex = 0;
        setEvidenceImageUrl(IMG_URLS[0])
      }, 900);
    } else {
      imageUrlIndex += 1;
      setEvidenceImageUrl(IMG_URLS[imageUrlIndex])
    }
  }

  return(
    <section className="bg-quillteal tool-hero evidence-explanation-section">
      <section className="inner-section">
        <div className="left-side-container">
          <div className="header-and-icon-container">
            <img alt="Reading for Evidence icon" className="tool-page-icon lazyload" data-src="https://assets.quill.org/images/icons/tool-evidence-white.svg" />
            <h1 className="q-h1">Quill Reading for Evidence</h1>
            <p className="new-tag">NEW</p>
          </div>
          <p className="description">Provide your students with nonfiction texts paired with AI-powered writing prompts, instead of multiple-choice questions, to enable deeper thinking.</p>
          <div className="divider-tab" />
          <p className="description">Students read a nonfiction text and build their comprehension through writing prompts, supporting a series of claims with evidence sourced from the text. Quill challenges students to write responses that are precise, logical, and based on textual evidence, with Quill coaching the student through custom, targeted feedback on each revision so that students strengthen their reading comprehension and hone their writing skills.</p>
          <a className="q-button bg-white text-quillteal" href={`${process.env.DEFAULT_URL}/tools/evidence`} rel="noopener noreferrer" target="_blank">Learn more about Quill Reading for Evidence</a>
        </div>
        <div className="image-container">
          <img alt="A screenshot of an example Reading for Evidence prompt" className={`evidence-image ${evidenceImageUrl === IMG_URLS[11] ? '' : INACTIVE}`} src={IMG_URLS[11]} />
          <img alt="A screenshot of an example Reading for Evidence prompt" className={`evidence-image ${evidenceImageUrl === IMG_URLS[10] ? '' : INACTIVE}`} src={IMG_URLS[10]} />
          <img alt="A screenshot of an example Reading for Evidence prompt" className={`evidence-image ${evidenceImageUrl === IMG_URLS[9] ? '' : INACTIVE}`} src={IMG_URLS[9]} />
          <img alt="A screenshot of an example Reading for Evidence prompt" className={`evidence-image ${evidenceImageUrl === IMG_URLS[8] ? '' : INACTIVE}`} src={IMG_URLS[8]} />
          <img alt="A screenshot of an example Reading for Evidence prompt" className={`evidence-image ${evidenceImageUrl === IMG_URLS[7] ? '' : INACTIVE}`} src={IMG_URLS[7]} />
          <img alt="A screenshot of an example Reading for Evidence prompt" className={`evidence-image ${evidenceImageUrl === IMG_URLS[6] ? '' : INACTIVE}`} src={IMG_URLS[6]} />
          <img alt="A screenshot of an example Reading for Evidence prompt" className={`evidence-image ${evidenceImageUrl === IMG_URLS[5] ? '' : INACTIVE}`} src={IMG_URLS[5]} />
          <img alt="A screenshot of an example Reading for Evidence prompt" className={`evidence-image ${evidenceImageUrl === IMG_URLS[4] ? '' : INACTIVE}`} src={IMG_URLS[4]} />
          <img alt="A screenshot of an example Reading for Evidence prompt" className={`evidence-image ${evidenceImageUrl === IMG_URLS[3] ? '' : INACTIVE}`} src={IMG_URLS[3]} />
          <img alt="A screenshot of an example Reading for Evidence prompt" className={`evidence-image ${evidenceImageUrl === IMG_URLS[2] ? '' : INACTIVE}`} src={IMG_URLS[2]} />
          <img alt="A screenshot of an example Reading for Evidence prompt" className={`evidence-image ${evidenceImageUrl === IMG_URLS[1] ? '' : INACTIVE}`} src={IMG_URLS[1]} />
          <img alt="A screenshot of an example Reading for Evidence prompt" className={`evidence-image ${evidenceImageUrl === IMG_URLS[0] ? '' : INACTIVE}`} src={IMG_URLS[0]} />
        </div>
      </section>
    </section>
  )
}

export default EvidenceHomeSection;
