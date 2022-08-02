import * as React from 'react';

const IMGS = [
  <img alt="A screenshot of an example Reading for Evidence prompt" id="image" key="image1" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_1.png" />,
  <img alt="A screenshot of an example Reading for Evidence prompt" id="image" key="image2" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_2.png" />,
  <img alt="A screenshot of an example Reading for Evidence prompt" id="image" key="image3" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_3.png" />,
  <img alt="A screenshot of an example Reading for Evidence prompt" id="image" key="image4" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_4.png" />,
  <img alt="A screenshot of an example Reading for Evidence prompt" id="image" key="image5" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_5.png" />,
  <img alt="A screenshot of an example Reading for Evidence prompt" id="image" key="image6" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_6.png" />,
  <img alt="A screenshot of an example Reading for Evidence prompt" id="image" key="image7" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_7.png" />,
  <img alt="A screenshot of an example Reading for Evidence prompt" id="image" key="image8" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_8.png" />,
  <img alt="A screenshot of an example Reading for Evidence prompt" id="image" key="image9" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_9.png" />,
  <img alt="A screenshot of an example Reading for Evidence prompt" id="image" key="image10" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_10.png" />,
  <img alt="A screenshot of an example Reading for Evidence prompt" id="image" key="image11" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_11.png" />,
  <img alt="A screenshot of an example Reading for Evidence prompt" id="image" key="image12" src="https://assets.quill.org/images/evidence/home_page/widget_images/2x/Hero_Evidence_Widget_12.png" />
]

export const EvidenceHomeSection = () => {
  let imageIndex = 0;
  const [evidenceImage, setEvidenceImage] = React.useState<any>(IMGS[0])

  React.useEffect(() => {
    setInterval(() => {
      handleSetImage();
    }, 8000);
  }, [])

  function handleSetImage() {
    if(imageIndex === IMGS.length - 1) {
      imageIndex = 0;
      setEvidenceImage(IMGS[imageIndex])
    } else {
      imageIndex += 1;
      setEvidenceImage(IMGS[imageIndex])
    }
  }
  return(
    <section className="bg-quillteal tool-hero evidence-explanation-section">
      <section className="inner-section">
        <div className="left-side-container">
          <div className="header-and-icon-container">
            <img className="tool-page-icon lazyload" data-src="https://assets.quill.org/images/icons/tool-evidence-white.svg" />
            <h1 className="q-h1">Quill Reading for Evidence</h1>
            <p className="new-tag">NEW</p>
          </div>
          <p className="description">Provide your students with nonfiction texts paired with AI-powered writing prompts, instead of multiple-choice questions, to enable deeper thinking.</p>
          <div className="divider-tab"/>
          <p className="description">Students read a nonfiction text and build their comprehension through writing prompts, supporting a series of claims with evidence sourced from the text. Quill challenges students to write responses that are precise, logical, and based on textual evidence, with Quill coaching the student through custom, targeted feedback on each revision so that students strengthen their reading comprehension and hone their writing skills.</p>
          <a className="q-button bg-white text-quillteal" href={`${process.env.DEFAULT_URL}/tools/evidence`} rel="noopener noreferrer" target="_blank">Learn more about Quill Reading for Evidence</a>
        </div>
        <div className="image-container">
          {evidenceImage}
        </div>
      </section>
    </section>
  )
}

export default EvidenceHomeSection;
