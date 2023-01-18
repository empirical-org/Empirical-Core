import * as React from 'react';

const IMG_URLS = [
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/HeroEvidenceWidget_1.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/HeroEvidenceWidget_2.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/HeroEvidenceWidget_3.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/HeroEvidenceWidget_4.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/HeroEvidenceWidget_5.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/HeroEvidenceWidget_6.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/HeroEvidenceWidget_7.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/HeroEvidenceWidget_8.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/HeroEvidenceWidget_9.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/HeroEvidenceWidget_10.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/HeroEvidenceWidget_11.png",
  "https://assets.quill.org/images/evidence/home_page/widget_images/2x/HeroEvidenceWidget_12.png"
]
const INACTIVE = 'inactive';

export const EvidenceWidget = () => {
  let imageUrlIndex = 0;
  const [evidenceImageUrl, setEvidenceImageUrl] = React.useState<any>(IMG_URLS[0]);
  const reversedUrls = [...IMG_URLS].reverse();

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
    <div className="image-container">
      {reversedUrls.map(url => (
        <img alt="Example Evidence Activity" className={`evidence-image lazyload ${evidenceImageUrl === url ? '' : INACTIVE}`} data-src={url} />
      ))}
    </div>
  )
}

export default EvidenceWidget;
