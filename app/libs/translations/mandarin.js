const buttonText = {
  'submit button text': '递交',
  'resume button text': '恢复',
  'begin button text': '开始',
  'continue button text': '继续',
  'sentence fragment complete button': '完整句子',
  'sentence fragment incomplete button': '不完整的句子',
};

const titleCards = {
  'fill in multiple blanks title card': '<h1>填写空白：A, An, The</h1><p>在本节中，每个句子将有两个或三个空格。</p><p>您将重写句子，用列表中的一个单词填充空白，或选择空白中不需要任何单词。</p>',
  'fill in single blanks title card': '<h1>填空</h1><p>你在那里的一半在本节中，您将选择最好的单词来完成一个句子。您将重写一个句子，用列表中的一个单词填写空白。</p>',
  'sentence fragments title card': '<h1>完整的句子</h1><p>在本节中，您将添加一组单词以形成一个完整的句子。添加尽可能少的单词。</p><p>开始吧！</p>',
  'tense title card': '<h1>过去，现在和未来时态</h1><p>在本节中，您将通过将动词放入正确的时间来匹配句子的其余部分来更正句子。你到目前为然！</p>',
  'sentence combining title card': '<h1>句子组合</h1><p>在本节中，您将句子合并成一个句子。</p><p>有时你会被加入一些话来选择，有时你必须选择自己的方式来组合句子。</p><p>只需要添加或更改单词，并尝试保持句子的意思相同。</p><p>你有这个！</p>',
  'diagnostic intro text': '<h1>Quill安置活动</h1><p>你即将回答22个关于写作句子的问题。别担心，这不是一个考验。只是弄清楚你知道什么</p><p>一些问题可能是你还没学到的东西 - 没关系！只要尽可能地回答他们。</p><p>完成后，Quill将为您创建一个学习计划！</p>',
  'completion page': '<h1>您完成了Quill Placement活动！</h1><p>您的结果现在已被保存。一旦保存，您将自动重定向。</p>',
};

const instructions = {
  'sentence-fragment-complete-vs-incomplete-button-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-completion-instructions': '添加到一组单词来做一个完整的句子。添加尽可能少的单词。',
  'fill-in-the-blank-multiple-instructions': '用这些文章之一填写空白：a，an，the。如果不需要文章，请删除空白。',
  'fill-in-the-blank-single-instructions': '重写句子。用这些单词填写空白：on，in，at，to',
  'tense-question-instructions': '重写句子。用粗体更正动词，使其符合句子的其余部分。',
  'combine-sentences-instructions': '将句子合并成一个句子。',
  'combine-sentences-with-joining-words-instructions': '将句子合并成一个句子。使用其中一个加入的单词。',
};

const scaffolds = {
  'joining word cues single': '加入词',
  'joining word cues multiple': '加入词',
  'add word bank cue': '添加单词'
};

const exampleTranslation = {
  ...instructions,
  ...titleCards,
  ...buttonText,
  ...scaffolds,
};

export default exampleTranslation;
