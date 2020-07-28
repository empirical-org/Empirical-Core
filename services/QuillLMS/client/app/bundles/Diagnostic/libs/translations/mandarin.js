const buttonText = {
  'submit button text': '提交',
  'resume button text': '恢复',
  'begin button text': '开始',
  'continue button text': '继续',
  'sentence fragment complete button': '完整句子',
  'sentence fragment incomplete button': '不完整的句子',
};

const titleCards = {
  'titlecard-ell-fill-in-multiple-blanks': '<h1>用A、An、The填空</h1><p>在这部分中，每个句子将有两个或三个空。</p><p>你将用列表中的一个单词填空，或者如果不需要填写任何单词，可以不填。</p>',
  'titlecard-ell-fill-in-single-blank': '<h1>填空</h1><p>你已完成一半了！在这部分中，你将选择最佳单词来完成一个句子。你将用列表中的一个单词来填空。</p>',
  'titlecard-ell-complete-sentences': '<h1>完整的句子</h1><p>在本节中，您将添加一组单词以形成一个完整的句子。添加尽可能少的单词。</p><p>开始吧！</p>',
  'titlecard-ell-past-present-and-future-tense': '<h1>过去、现在和将来时态</h1><p>在这部分中，你通过将动词放入恰当的时态，使其与句子的其余部分相符，改正句子。目前你的表现非常棒！</p>',
  'titlecard-ell-sentence-combining': '<h1>组句</h1><p>在这部分中，你将多个句子合并成一个句子。</p><p>有时你将有一些连词可供选择，有时你必须选择自己的方式组句。</p><p>只要在需要时才可以添加或更改单词，尽量保持句子的意思不变。</p><p>你成功了！</p>',
  'diagnostic intro text': '<h1>Quill分班活动</h1><p>你将回答与写句子有关的21个问题。别担心，这不是测验。只是为了弄清楚你知道什么</p><p>一些问题可能与你还没有学过的内容有关 - 没关系！尽力回答就可以。</p><p>完成后，Quill将为你创建一个学习计划！</p>',
  'completion page': '<h1>你已完成Quill分班活动！</h1><p>正在保存你的成绩。保存完成后，系统将自动重新导向。</p>',
};

const instructions = {
  'sentence-fragment-complete-vs-incomplete-button-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-completion-instructions': '添加一组单词组成一个完整的句子。添加尽可能少的单词。',
  'fill-in-the-blank-multiple-instructions': '用以上一个单词填空。如果不需要填写任何单词，可以不填。',
  'fill-in-the-blank-single-instructions': '用以上一个单词填空。',
  'tense-question-instructions': '改写句子。改正粗体的动词，使时态恰当，与句子的其余部分相符。',
  'combine-sentences-instructions': '将多个句子合并成一个句子。',
  'combine-sentences-with-joining-words-instructions': '将多个句子合并成一个句子。使用其中的一个连词。',
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
