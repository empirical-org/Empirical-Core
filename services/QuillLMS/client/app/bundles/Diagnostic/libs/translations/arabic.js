const buttonText = {
  'submit button text': 'أرسل ',
  'resume button text': 'استئنف',
  'begin button text': 'إبدأ',
  'continue button text': 'إستمر',
  'sentence fragment complete button': 'جمله كامله',
  'sentence fragment incomplete button': 'جمله ناقصه',
};

const titleCards = {
  'titlecard-ell-fill-in-multiple-blanks': '<h1>A, An, The:املئ الفراغات</h1> <p>.في هذا الجزء من النشاط سيكون لكل جملة فراغين أو ثلاثة فراغات</p><p>.عليك استخدام واحدة من الكلمات في القائمة لملئ الفراغ أو ترك الفراغ اذا كنت تعتقد بان الفراغ لا يحتاج الى اي كلمه</p>',
  'titlecard-ell-fill-in-single-blank': '<h1>املئ الفراغات</h1><p>.انت على وشك الانتهاء من هذا النشاط! في هذا الجزء من النشاط، عليك ملئ الفراغات باختيار أفضل كلمة لإكمال الجملة</p>',
  'titlecard-ell-complete-sentences': '<h1>جمل كاملة</h1><p>.في هذا الجزء من النشاط سوف تقوم بالاضافه إلى مجموعة من الكلمات لجعل الجملة كاملة. قم باضافه اقل عدد ممكن من الكلمات</p><p>!لنبدا النشاط</p>',
  'titlecard-ell-past-present-and-future-tense': '<h1>افعال في الماضي والحاضر والمستقبل</h1> <p>.في هذا الجزء من النشاط ستقوم بتصحيح الجمل بوضع الفعل في الزمن الصحيح ليتناسب مع بقية الجملة</p><p>!بالتوفيق</p>',
  'titlecard-ell-sentence-combining': '<h1>ربط الجمل </h1><p>.في هذا الجزء من النشاط، عليك ربط الجمل لتكوين جمله واحده</p><p>.قم بربط الجمل باختيار كلمه من مجموعه الكلمات او باستخدام طريقتك الخاصة</p><p>.قم بإضافة أو تغيير الكلمات فقط عند الحاجه وحاول الحفاظ على معنى الجمله</p><p>!حظا سعيدا</p>',
  'diagnostic intro text': '<h1>نشاط كويل لتحديد المستوى</h1><p>.في هذا النشاط سوف تقوم بالإجابة على ٢٢ سؤالا عن كتابة الجمل الكامله. لا تقلق هذا النشاط ليس اختبارا انه فقط لمعرفة ما تعرفه و مستواك في اللغه الانجليزيه</p><p>.لا تقلق اذا كنت لا تعرف الاجابه عن بعض الأسئلة فقط اجب عليها على قدر ما تستطيع</p><p>.عند الانتهاء من النشاط سنقوم باعطاءك برنامج تعليمي و نشاطات اخرى جديده لتقويتك</p>',
  'completion page': '<h1>!لقد أكملت نشاط تحديد المستوى</h1><p>.جاري حفظ نتائجك الان. سنقوم باعادتك الى صفحتك الرئيسيه عند الانتهاء من الحفظ</p>',
};

const instructions = {
  'sentence-fragment-complete-vs-incomplete-button-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-choice-instructions': '',
  'sentence-fragment-complete-vs-incomplete-completion-instructions': '.أضف اقل عدد ممكن من الكلمات إلى مجموعة الكلمات اعلاه لجعلها جملة كاملة',
  'fill-in-the-blank-multiple-instructions': '.املأ الفراغ بواحده من الكلمات اعلاه، إذا لم تكن هناك حاجة إلى كلمه، قم بترك الفراغ',
  'fill-in-the-blank-single-instructions': '.املئ الفراغات بواحدة من الكلمات اعلاه',
  'tense-question-instructions': '.قم بإعادة كتابة الجملة وتصحيح الفعل بالخط العريض ليكون في الزمن المناسب للجمله',
  'combine-sentences-instructions': '.قم بربط الجملتين لتكوين جمله واحده',
  'combine-sentences-with-joining-words-instructions': '.قم بربط الجمل لتكوين جمله واحده استخدم واحدة من الكلمات لربط الجمل',
};

const scaffolds = {
  'joining word cues single': 'كلمه ربط',
  'joining word cues multiple': 'كلمات ربط',
  'add word bank cue': 'اضف الكلمات'
};

const exampleTranslation = {
  ...instructions,
  ...titleCards,
  ...buttonText,
  ...scaffolds,
};

export default exampleTranslation;
