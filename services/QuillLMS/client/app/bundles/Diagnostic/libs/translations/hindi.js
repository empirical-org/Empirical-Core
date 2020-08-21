const buttonText = {
  'submit button text': 'जमा करें',
  'resume button text': 'दुबारा आरम्भ करना',
  'begin button text': 'शुरू',
  'continue button text': 'जारी रहना',
  'sentence fragment complete button': 'पुरा वाक्य',
  'sentence fragment incomplete button': 'अपूर्ण वाक्य',
};

const titleCards = {
  'titlecard-ell-fill-in-multiple-blanks': '<h1>रिक्त भरें: A, An, The</h1><p>इस अनुभाग में, प्रत्येक वाक्य में दो या तीन रिक्त स्थान होंगे।</p><p>दी गई सूची से शब्द का उपयोग करके वाक्य को फिर से लिखना या रिक्त स्थान के लिए "कोई शब्द की आवश्यकता नहीं है" विकल्प चुनें</p>',
  'titlecard-ell-fill-in-single-blank': '<h1>रिक्त स्थान भरें</h1><p>इस अनुभाग में, आप एक वाक्य को पूरा करने के लिए सबसे अच्छा शब्द चुन लेंगे। आप एक वाक्य को दोबारा लिखेंगे, एक सूची से शब्दों में से एक के साथ रिक्त भरने के लिए।</p>',
  'titlecard-ell-complete-sentences': '<h1>पूर्ण वाक्य</h1><p>इस अनुभाग में, आप एक पूर्ण वाक्य बनाने के लिए शब्दों के एक समूह में जोड़ देंगे। संभव के रूप में कुछ शब्द जोड़ें</p>',
  'titlecard-ell-past-present-and-future-tense': '<h1>अतीत, वर्तमान, और भविष्य में तनाव</h1><p>इस अनुभाग में, आप वाक्य को शेष वाक्य के मुकाबले सही क्रिया में डालकर वाक्यों को ठीक कर देंगे।</p> ',
  'titlecard-ell-sentence-combining': '<h1>वाक्यों  संयोजन</h1><p>इस अनुभाग में आप वाक्यों को एक वाक्य में जोड़ सकते हैं।</p><p>कभी-कभी आपको चुनने के लिए शब्दों में शामिल होने दिया जाएगा, और कभी-कभी आपको वाक्यों के संयोजन के अपने स्वयं के तरीके को चुनना होगा।</p><p>केवल शब्दों को जोड़ने या बदलने के लिए जब आप की आवश्यकता होती है, और वाक्यों का अर्थ समान रूप से रखने का प्रयास करें।</p>',
  'diagnostic intro text': '<h1>क्विल प्लेसमेंट गतिविधि</h1><p>वाक्यों लिखने पर आप 21 सवालों का जवाब दे रहे हैं यह एक परीक्षण नहीं है यह पता लगाने के लिए बस आप क्या जानते हैं</p><p>कुछ प्रश्न उन चीजों के बारे में हो सकते हैं जिन्हें आपने अभी तक नहीं सीखा है - ठीक है बस उन्हें उतना अच्छा उत्तर दें जितना कि आप कर सकते हैं।</p><p>एक बार जब आप समाप्त कर लेंगे Quill सिर्फ आपके लिए सीखने की योजना बनायेगा</p>',
  'completion page': '<h1>आपने क्विल प्लेसमेंट गतिविधि पूरी कर ली है</h1><p>आपके परिणाम अब सहेजे जा रहे हैं सहेजे जाने के बाद आपको स्वचालित रूप से पुनः निर्देशित किया जाएगा</p>',
};

const instructions = {
  'sentence-fragment-complete-vs-incomplete-button-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-completion-instructions': 'एक पूर्ण वाक्य बनाने के लिए शब्दों के समूह में जोड़ें। संभव के रूप में कुछ शब्द जोड़ें वाक्य को पूरा करने के लिए उतना ही कम शब्दों को रखें ',
  'fill-in-the-blank-multiple-instructions': 'इन लेखों में से किसी एक के साथ रिक्त भरें: a, an, the। यदि कोई आलेख की आवश्यकता नहीं है रिक्त को हटा दें',
  'fill-in-the-blank-single-instructions': 'वाक्य को फिर से लिखना इन शब्दों में से किसी एक के साथ रिक्त भरें: on, in, at, to',
  'tense-question-instructions': 'वाक्य को फिर से लिखना बोल्ड में क्रिया को सही करें ताकि यह शेष वाक्य के साथ मिलान करने के लिए सही तनाव में हो।',
  'combine-sentences-instructions': 'वाक्यों को एक वाक्य में मिलाएं।',
  'combine-sentences-with-joining-words-instructions': 'वाक्यों को एक वाक्य में मिलाएं। जुड़ने वाले शब्दों में से किसी एक का उपयोग करें',
};

const scaffolds = {
  'joining word cues single': 'शब्द में शामिल होना',
  'joining word cues multiple': 'शब्दों में शामिल होने',
  'add word bank cue': 'शब्दों को जोड़ें'
};

const exampleTranslation = {
  ...instructions,
  ...titleCards,
  ...buttonText,
  ...scaffolds,
};

export default exampleTranslation;
