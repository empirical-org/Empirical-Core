export const ENGLISH = 'english';
export const CHINESE = 'chinese';
export const HINDI = 'hindi';
export const SPANISH = 'spanish';
export const FRENCH = 'french';
export const ARABIC = 'arabic';
export const RUSSIAN = 'russian';
export const PORTUGUESE = 'portuguese';
export const URDU = 'urdu';
export const GERMAN = 'german';
export const JAPANESE = 'japanese';
export const KOREAN = 'korean';
export const VIETNAMESE = 'vietnamese';
export const THAI = 'thai';
export const UKRAINIAN = 'ukrainian';
export const TAGALOG = 'tagalog';
export const DARI = 'dari';
export const languages = [ENGLISH, CHINESE, HINDI, SPANISH, FRENCH, ARABIC, RUSSIAN, PORTUGUESE, URDU, GERMAN, JAPANESE, KOREAN, VIETNAMESE, THAI, UKRAINIAN, TAGALOG, DARI];
export const rightToLeftLanguages = [ARABIC, URDU, DARI];

/*
    ELL Starter: -LyFRZvbHAmooTTIIVE2
    ELL Intermediate Diagnostic: 125c9458-beb7-4176-9ae0-02bec65624a2
    ELL Advanced Diagnostic: 4e848241-ca31-4eb5-90e2-0ecba6304521
*/

const ELL_STARTER_PRE = '-LyFRZvbHAmooTTIIVE2'
const ELL_INTERMEDIATE_PRE = '125c9458-beb7-4176-9ae0-02bec65624a2'
const ELL_ADVANCED_PRE = '4e848241-ca31-4eb5-90e2-0ecba6304521'
const ELL_STARTER_POST = '00ff60a6-66c0-486e-9710-43682deb0f4a'
const ELL_INTERMEDIATE_POST = 'a6af4777-faa4-4673-ab40-20732642ddc4'
const ELL_ADVANCED_POST = '319c308a-64d5-45a3-bef1-0be1e3e3fa07'

export const languageData = {
  [ENGLISH]: {
    flag: 'https://assets.quill.org/images/flags/usa.png',
    label: 'English',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Quill Placement Activity',
        firstLine: 'You’re about to answer 22 questions on writing sentences.',
        secondLine: 'Some of the questions might be about things you haven’t learned yet—that’s okay! Just answer them as best as you can. Don’t forget to read the instructions carefully for each question!',
        thirdLine: 'Once you’re finished, Quill will create a learning plan just for you.',
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Quill Placement Activity',
        firstLine: 'You’re about to answer 23 questions on writing sentences.',
        secondLine: 'Some of the questions might be about things you haven’t learned yet—that’s okay! Just answer them as best as you can. Don’t forget to read the instructions carefully for each question!',
        thirdLine: 'Once you’re finished, Quill will create a learning plan just for you.'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Quill Placement Activity',
        firstLine: 'You’re about to answer 23 questions on writing sentences.',
        secondLine: 'Some of the questions might be about things you haven’t learned yet—that’s okay! Just answer them as best as you can. Don’t forget to read the instructions carefully for each question!',
        thirdLine: 'Once you’re finished, Quill will create a learning plan just for you.'
      },
      [ELL_STARTER_POST]: {
        header: 'Quill Placement Activity',
        firstLine: 'You’re about to answer 22 questions on writing sentences.',
        secondLine: 'Some of the questions might be about things you haven’t learned yet—that’s okay! Just answer them as best as you can. Don’t forget to read the instructions carefully for each question!',
        thirdLine: 'Once you’re finished, Quill will create a learning plan just for you.',
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Quill Placement Activity',
        firstLine: 'You’re about to answer 23 questions on writing sentences.',
        secondLine: 'Some of the questions might be about things you haven’t learned yet—that’s okay! Just answer them as best as you can. Don’t forget to read the instructions carefully for each question!',
        thirdLine: 'Once you’re finished, Quill will create a learning plan just for you.'
      },
      [ELL_ADVANCED_POST]: {
        header: 'Quill Placement Activity',
        firstLine: 'You’re about to answer 23 questions on writing sentences.',
        secondLine: 'Some of the questions might be about things you haven’t learned yet—that’s okay! Just answer them as best as you can. Don’t forget to read the instructions carefully for each question!',
        thirdLine: 'Once you’re finished, Quill will create a learning plan just for you.'
      }
    }
  },
  [CHINESE]: {
    flag: 'https://assets.quill.org/images/flags/china.png',
    label: '中文',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Quill安置活动',
        firstLine: '你将要回答22个关于编写句子的问题',
        secondLine: '有些问题可能与你还没学过的东西有关——没关系！尽你所能地回答他们。不要忘记仔细阅读每个问题的说明！',
        thirdLine: '在你完成后，Quill会为你制定一份学习计划。',
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Quill安置活动',
        firstLine: '你将要回答23个关于编写句子的问题。',
        secondLine: '有些问题可能与你还没学过的东西有关——没关系！尽你所能地回答他们。不要忘记仔细阅读每个问题的说明！',
        thirdLine: '在你完成后，Quill会为你制定一份学习计划。',
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Quill安置活动',
        firstLine: '你将要回答23个关于编写句子的问题。',
        secondLine: '有些问题可能与你还没学过的东西有关——没关系！尽你所能地回答他们。不要忘记仔细阅读每个问题的说明！',
        thirdLine: '在你完成后，Quill会为你制定一份学习计划。',
      },
      [ELL_STARTER_POST]: {
        header: 'Quill安置活动',
        firstLine: '你将要回答22个关于编写句子的问题',
        secondLine: '有些问题可能与你还没学过的东西有关——没关系！尽你所能地回答他们。不要忘记仔细阅读每个问题的说明！',
        thirdLine: '在你完成后，Quill会为你制定一份学习计划。',
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Quill安置活动',
        firstLine: '你将要回答23个关于编写句子的问题。',
        secondLine: '有些问题可能与你还没学过的东西有关——没关系！尽你所能地回答他们。不要忘记仔细阅读每个问题的说明！',
        thirdLine: '在你完成后，Quill会为你制定一份学习计划。',
      },
      [ELL_ADVANCED_POST]: {
        header: 'Quill安置活动',
        firstLine: '你将要回答23个关于编写句子的问题。',
        secondLine: '有些问题可能与你还没学过的东西有关——没关系！尽你所能地回答他们。不要忘记仔细阅读每个问题的说明！',
        thirdLine: '在你完成后，Quill会为你制定一份学习计划。',
      }
    }
  },
  [HINDI]: {
    flag: 'https://assets.quill.org/images/flags/india.png',
    label: 'हिंदी',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Quill स्थापन गतिविधि',
        firstLine: 'आप वाक्य लिखने से संबंधित 22 प्रश्नों के उत्तर देने जा रहे हैं।',
        secondLine: 'कुछ प्रश्न उन चीजों के बारे में हो सकते हैं जिन्हें आपने अभी तक नहीं सीखा है—ठीक है! बस अपनी समझ के अनुसार उनका सर्वश्रेष्ठ उत्तर दें। प्रत्येक प्रश्न के लिए निर्देशों को ध्यान से पढ़ना न भूलें!',
        thirdLine: 'निर्देश पढ़ लेने के बाद, Quill आपके लिए एक सीखने की योजना बनाएगा।',
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Quill स्थापन गतिविधि',
        firstLine: 'आप वाक्य लिखने से संबंधित 23 प्रश्नों के उत्तर देने जा रहे हैं।',
        secondLine: 'कुछ प्रश्न उन चीजों के बारे में हो सकते हैं जिन्हें आपने अभी तक नहीं सीखा है—ठीक है! बस अपनी समझ के अनुसार उनका सर्वश्रेष्ठ उत्तर दें। प्रत्येक प्रश्न के लिए निर्देशों को ध्यान से पढ़ना न भूलें!',
        thirdLine: 'निर्देश पढ़ लेने के बाद, Quill आपके लिए एक सीखने की योजना बनाएगा।',
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Quill स्थापन गतिविधि',
        firstLine: 'आप वाक्य लिखने से संबंधित 23 प्रश्नों के उत्तर देने जा रहे हैं।',
        secondLine: 'कुछ प्रश्न उन चीजों के बारे में हो सकते हैं जिन्हें आपने अभी तक नहीं सीखा है—ठीक है! बस अपनी समझ के अनुसार उनका सर्वश्रेष्ठ उत्तर दें। प्रत्येक प्रश्न के लिए निर्देशों को ध्यान से पढ़ना न भूलें!',
        thirdLine: 'निर्देश पढ़ लेने के बाद, Quill आपके लिए एक सीखने की योजना बनाएगा।',
      },
      [ELL_STARTER_POST]: {
        header: 'Quill स्थापन गतिविधि',
        firstLine: 'आप वाक्य लिखने से संबंधित 22 प्रश्नों के उत्तर देने जा रहे हैं।',
        secondLine: 'कुछ प्रश्न उन चीजों के बारे में हो सकते हैं जिन्हें आपने अभी तक नहीं सीखा है—ठीक है! बस अपनी समझ के अनुसार उनका सर्वश्रेष्ठ उत्तर दें। प्रत्येक प्रश्न के लिए निर्देशों को ध्यान से पढ़ना न भूलें!',
        thirdLine: 'निर्देश पढ़ लेने के बाद, Quill आपके लिए एक सीखने की योजना बनाएगा।',
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Quill स्थापन गतिविधि',
        firstLine: 'आप वाक्य लिखने से संबंधित 23 प्रश्नों के उत्तर देने जा रहे हैं।',
        secondLine: 'कुछ प्रश्न उन चीजों के बारे में हो सकते हैं जिन्हें आपने अभी तक नहीं सीखा है—ठीक है! बस अपनी समझ के अनुसार उनका सर्वश्रेष्ठ उत्तर दें। प्रत्येक प्रश्न के लिए निर्देशों को ध्यान से पढ़ना न भूलें!',
        thirdLine: 'निर्देश पढ़ लेने के बाद, Quill आपके लिए एक सीखने की योजना बनाएगा।',
      },
      [ELL_ADVANCED_POST]: {
        header: 'Quill स्थापन गतिविधि',
        firstLine: 'आप वाक्य लिखने से संबंधित 23 प्रश्नों के उत्तर देने जा रहे हैं।',
        secondLine: 'कुछ प्रश्न उन चीजों के बारे में हो सकते हैं जिन्हें आपने अभी तक नहीं सीखा है—ठीक है! बस अपनी समझ के अनुसार उनका सर्वश्रेष्ठ उत्तर दें। प्रत्येक प्रश्न के लिए निर्देशों को ध्यान से पढ़ना न भूलें!',
        thirdLine: 'निर्देश पढ़ लेने के बाद, Quill आपके लिए एक सीखने की योजना बनाएगा।',
      }
    }
  },
  [SPANISH]: {
    flag: 'https://assets.quill.org/images/flags/spain.png',
    label: 'Español',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Actividad de emplazamiento de Quill',
        firstLine: 'Vas a responder 22 preguntas sobre cómo escribir oraciones.',
        secondLine: 'Algunas de las preguntas podrían ser sobre cosas que aún no has aprendido, ¡pero no pasa nada! Solo respóndelas lo mejor que puedas. ¡No olvides leer las instrucciones con cuidado para cada pregunta!',
        thirdLine: 'Cuando hayas terminado, Quill creará un plan de aprendizaje solo para ti.',
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Actividad de emplazamiento de Quill',
        firstLine: 'Vas a responder 23 preguntas sobre cómo escribir oraciones.',
        secondLine: 'Algunas de las preguntas podrían ser sobre cosas que aún no has aprendido, ¡pero no pasa nada! Solo respóndelas lo mejor que puedas. ¡No olvides leer las instrucciones con cuidado para cada pregunta!',
        thirdLine: 'Cuando hayas terminado, Quill creará un plan de aprendizaje solo para ti.',
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Actividad de emplazamiento de Quill',
        firstLine: 'Vas a responder 23 preguntas sobre cómo escribir oraciones.',
        secondLine: 'Algunas de las preguntas podrían ser sobre cosas que aún no has aprendido, ¡pero no pasa nada! Solo respóndelas lo mejor que puedas. ¡No olvides leer las instrucciones con cuidado para cada pregunta!',
        thirdLine: 'Cuando hayas terminado, Quill creará un plan de aprendizaje solo para ti.',
      },
      [ELL_STARTER_POST]: {
        header: 'Actividad de emplazamiento de Quill',
        firstLine: 'Vas a responder 22 preguntas sobre cómo escribir oraciones.',
        secondLine: 'Algunas de las preguntas podrían ser sobre cosas que aún no has aprendido, ¡pero no pasa nada! Solo respóndelas lo mejor que puedas. ¡No olvides leer las instrucciones con cuidado para cada pregunta!',
        thirdLine: 'Cuando hayas terminado, Quill creará un plan de aprendizaje solo para ti.',
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Actividad de emplazamiento de Quill',
        firstLine: 'Vas a responder 23 preguntas sobre cómo escribir oraciones.',
        secondLine: 'Algunas de las preguntas podrían ser sobre cosas que aún no has aprendido, ¡pero no pasa nada! Solo respóndelas lo mejor que puedas. ¡No olvides leer las instrucciones con cuidado para cada pregunta!',
        thirdLine: 'Cuando hayas terminado, Quill creará un plan de aprendizaje solo para ti.',
      },
      [ELL_ADVANCED_POST]: {
        header: 'Actividad de emplazamiento de Quill',
        firstLine: 'Vas a responder 23 preguntas sobre cómo escribir oraciones.',
        secondLine: 'Algunas de las preguntas podrían ser sobre cosas que aún no has aprendido, ¡pero no pasa nada! Solo respóndelas lo mejor que puedas. ¡No olvides leer las instrucciones con cuidado para cada pregunta!',
        thirdLine: 'Cuando hayas terminado, Quill creará un plan de aprendizaje solo para ti.',
      },
    }
  },
  [FRENCH]: {
    flag: 'https://assets.quill.org/images/flags/france.png',
    label: 'Français',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Activité de placement Quill',
        firstLine: 'Vous allez répondre à 22 questions sur l’écriture des phrases.',
        secondLine: 'Certaines de ces questions peuvent concerner des choses que vous n’avez pas encore apprises. Ce n’est pas grave ! Répondez-y simplement le mieux possible. N’oubliez pas de lire attentivement les instructions pour chaque question !',
        thirdLine: 'Lorsque vous aurez terminé, Quill créera un programme d’apprentissage spécialement pour vous.',
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Activité de placement Quill',
        firstLine: 'Vous allez répondre à 23 questions sur l’écriture des phrases.',
        secondLine: 'Certaines de ces questions peuvent concerner des choses que vous n’avez pas encore apprises. Ce n’est pas grave ! Répondez-y simplement le mieux possible. N’oubliez pas de lire attentivement les instructions pour chaque question !',
        thirdLine: 'Lorsque vous aurez terminé, Quill créera un programme d’apprentissage spécialement pour vous.',
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Activité de placement Quill',
        firstLine: 'Vous allez répondre à 23 questions sur l’écriture des phrases.',
        secondLine: 'Certaines de ces questions peuvent concerner des choses que vous n’avez pas encore apprises. Ce n’est pas grave ! Répondez-y simplement le mieux possible. N’oubliez pas de lire attentivement les instructions pour chaque question !',
        thirdLine: 'Lorsque vous aurez terminé, Quill créera un programme d’apprentissage spécialement pour vous.',
      },
      [ELL_STARTER_POST]: {
        header: 'Activité de placement Quill',
        firstLine: 'Vous allez répondre à 22 questions sur l’écriture des phrases.',
        secondLine: 'Certaines de ces questions peuvent concerner des choses que vous n’avez pas encore apprises. Ce n’est pas grave ! Répondez-y simplement le mieux possible. N’oubliez pas de lire attentivement les instructions pour chaque question !',
        thirdLine: 'Lorsque vous aurez terminé, Quill créera un programme d’apprentissage spécialement pour vous.',
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Activité de placement Quill',
        firstLine: 'Vous allez répondre à 23 questions sur l’écriture des phrases.',
        secondLine: 'Certaines de ces questions peuvent concerner des choses que vous n’avez pas encore apprises. Ce n’est pas grave ! Répondez-y simplement le mieux possible. N’oubliez pas de lire attentivement les instructions pour chaque question !',
        thirdLine: 'Lorsque vous aurez terminé, Quill créera un programme d’apprentissage spécialement pour vous.',
      },
      [ELL_ADVANCED_POST]: {
        header: 'Activité de placement Quill',
        firstLine: 'Vous allez répondre à 23 questions sur l’écriture des phrases.',
        secondLine: 'Certaines de ces questions peuvent concerner des choses que vous n’avez pas encore apprises. Ce n’est pas grave ! Répondez-y simplement le mieux possible. N’oubliez pas de lire attentivement les instructions pour chaque question !',
        thirdLine: 'Lorsque vous aurez terminé, Quill créera un programme d’apprentissage spécialement pour vous.',
      },
    }
  },
  [ARABIC]: {
    flag: 'https://assets.quill.org/images/flags/egypt.png',
    label: 'العربية',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'نشاط تحديد المستوى في Quill',
        firstLine: 'أنت على وشك الإجابة على 22 سؤالًا حول كتابة جمل. قد تكون بعض الأسئلة حول أشياء لم تتعلمها بعد – لا بأس! فقط أجب بأفضل طريقة ممكنة. لا تنس قراءة التعليمات بعناية لكل سؤال! بمجرد الانتهاء، ستقوم Quill بإنشاء خطة تعليمية لك فقط.',
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'نشاط تحديد المستوى في Quill',
        firstLine: 'أنت على وشك الإجابة على 23 سؤالًا حول كتابة جمل. قد تكون بعض الأسئلة حول أشياء لم تتعلمها بعد – لا بأس! فقط أجب بأفضل طريقة ممكنة. لا تنس قراءة التعليمات بعناية لكل سؤال! بمجرد الانتهاء، ستقوم Quill بإنشاء خطة تعليمية لك فقط.'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'نشاط تحديد المستوى في Quill',
        firstLine: 'أنت على وشك الإجابة على 23 سؤالًا حول كتابة جمل. قد تكون بعض الأسئلة حول أشياء لم تتعلمها بعد – لا بأس! فقط أجب بأفضل طريقة ممكنة. لا تنس قراءة التعليمات بعناية لكل سؤال! بمجرد الانتهاء، ستقوم Quill بإنشاء خطة تعليمية لك فقط.'
      },
      [ELL_STARTER_POST]: {
        header: 'نشاط تحديد المستوى في Quill',
        firstLine: 'أنت على وشك الإجابة على 22 سؤالًا حول كتابة جمل. قد تكون بعض الأسئلة حول أشياء لم تتعلمها بعد – لا بأس! فقط أجب بأفضل طريقة ممكنة. لا تنس قراءة التعليمات بعناية لكل سؤال! بمجرد الانتهاء، ستقوم Quill بإنشاء خطة تعليمية لك فقط.',
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'نشاط تحديد المستوى في Quill',
        firstLine: 'أنت على وشك الإجابة على 23 سؤالًا حول كتابة جمل. قد تكون بعض الأسئلة حول أشياء لم تتعلمها بعد – لا بأس! فقط أجب بأفضل طريقة ممكنة. لا تنس قراءة التعليمات بعناية لكل سؤال! بمجرد الانتهاء، ستقوم Quill بإنشاء خطة تعليمية لك فقط.'
      },
      [ELL_ADVANCED_POST]: {
        header: 'نشاط تحديد المستوى في Quill',
        firstLine: 'أنت على وشك الإجابة على 23 سؤالًا حول كتابة جمل. قد تكون بعض الأسئلة حول أشياء لم تتعلمها بعد – لا بأس! فقط أجب بأفضل طريقة ممكنة. لا تنس قراءة التعليمات بعناية لكل سؤال! بمجرد الانتهاء، ستقوم Quill بإنشاء خطة تعليمية لك فقط.'
      },
    }
  },
  [RUSSIAN]: {
    flag: 'https://assets.quill.org/images/flags/russia.png',
    label: 'Русский',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Задание по размещению Quill',
        firstLine: 'Вам потребуется ответить на 22 вопроса о написании предложений.',
        secondLine: 'Некоторые из вопросов могут быть о вещах, которые вы еще не изучили, и это нормально! Просто отвечайте на них как можно лучше. Не забудьте внимательно прочитать инструкцию к каждому вопросу!',
        thirdLine: 'Как только вы закончите, Quill создаст для вас особый план обучения.'
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Задание по размещению Quill',
        firstLine: 'Вам потребуется ответить на 23 вопроса о написании предложений.',
        secondLine: 'Некоторые из вопросов могут быть о вещах, которые вы еще не изучили, и это нормально! Просто отвечайте на них как можно лучше. Не забудьте внимательно прочитать инструкцию к каждому вопросу!',
        thirdLine: 'Как только вы закончите, Quill создаст для вас особый план обучения.'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Задание по размещению Quill',
        firstLine: 'Вам потребуется ответить на 23 вопроса о написании предложений.',
        secondLine: 'Некоторые из вопросов могут быть о вещах, которые вы еще не изучили, и это нормально! Просто отвечайте на них как можно лучше. Не забудьте внимательно прочитать инструкцию к каждому вопросу!',
        thirdLine: 'Как только вы закончите, Quill создаст для вас особый план обучения.'
      },
      [ELL_STARTER_POST]: {
        header: 'Задание по размещению Quill',
        firstLine: 'Вам потребуется ответить на 22 вопроса о написании предложений.',
        secondLine: 'Некоторые из вопросов могут быть о вещах, которые вы еще не изучили, и это нормально! Просто отвечайте на них как можно лучше. Не забудьте внимательно прочитать инструкцию к каждому вопросу!',
        thirdLine: 'Как только вы закончите, Quill создаст для вас особый план обучения.'
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Задание по размещению Quill',
        firstLine: 'Вам потребуется ответить на 23 вопроса о написании предложений.',
        secondLine: 'Некоторые из вопросов могут быть о вещах, которые вы еще не изучили, и это нормально! Просто отвечайте на них как можно лучше. Не забудьте внимательно прочитать инструкцию к каждому вопросу!',
        thirdLine: 'Как только вы закончите, Quill создаст для вас особый план обучения.'
      },
      [ELL_ADVANCED_POST]: {
        header: 'Задание по размещению Quill',
        firstLine: 'Вам потребуется ответить на 23 вопроса о написании предложений.',
        secondLine: 'Некоторые из вопросов могут быть о вещах, которые вы еще не изучили, и это нормально! Просто отвечайте на них как можно лучше. Не забудьте внимательно прочитать инструкцию к каждому вопросу!',
        thirdLine: 'Как только вы закончите, Quill создаст для вас особый план обучения.'
      },
    }
  },
  [PORTUGUESE]: {
    flag: 'https://assets.quill.org/images/flags/brazil.png',
    label: 'Português',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Atividade de Colocação da Quill',
        firstLine: 'Você agora deverá responder 22 perguntas sobre como escrever frases.',
        secondLine: 'Algumas das perguntas podem ser sobre coisas que você ainda não aprendeu - tudo bem! Você só precisa responder da melhor maneira que puder. Não se esqueça de ler cuidadosamente as instruções para cada pergunta!',
        thirdLine: 'Quando terminar, a Quill criará um plano de aprendizagem só para você.'
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Atividade de Colocação da Quill',
        firstLine: 'Você agora deverá responder 23 perguntas sobre como escrever frases.',
        secondLine: 'Algumas das perguntas podem ser sobre coisas que você ainda não aprendeu - tudo bem! Você só precisa responder da melhor maneira que puder. Não se esqueça de ler cuidadosamente as instruções para cada pergunta!',
        thirdLine: 'Quando terminar, a Quill criará um plano de aprendizagem só para você.'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Atividade de Colocação da Quill',
        firstLine: 'Você agora deverá responder 23 perguntas sobre como escrever frases.',
        secondLine: 'Algumas das perguntas podem ser sobre coisas que você ainda não aprendeu - tudo bem! Você só precisa responder da melhor maneira que puder. Não se esqueça de ler cuidadosamente as instruções para cada pergunta!',
        thirdLine: 'Quando terminar, a Quill criará um plano de aprendizagem só para você.'
      },
      [ELL_STARTER_POST]: {
        header: 'Atividade de Colocação da Quill',
        firstLine: 'Você agora deverá responder 22 perguntas sobre como escrever frases.',
        secondLine: 'Algumas das perguntas podem ser sobre coisas que você ainda não aprendeu - tudo bem! Você só precisa responder da melhor maneira que puder. Não se esqueça de ler cuidadosamente as instruções para cada pergunta!',
        thirdLine: 'Quando terminar, a Quill criará um plano de aprendizagem só para você.'
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Atividade de Colocação da Quill',
        firstLine: 'Você agora deverá responder 23 perguntas sobre como escrever frases.',
        secondLine: 'Algumas das perguntas podem ser sobre coisas que você ainda não aprendeu - tudo bem! Você só precisa responder da melhor maneira que puder. Não se esqueça de ler cuidadosamente as instruções para cada pergunta!',
        thirdLine: 'Quando terminar, a Quill criará um plano de aprendizagem só para você.'
      },
      [ELL_ADVANCED_POST]: {
        header: 'Atividade de Colocação da Quill',
        firstLine: 'Você agora deverá responder 23 perguntas sobre como escrever frases.',
        secondLine: 'Algumas das perguntas podem ser sobre coisas que você ainda não aprendeu - tudo bem! Você só precisa responder da melhor maneira que puder. Não se esqueça de ler cuidadosamente as instruções para cada pergunta!',
        thirdLine: 'Quando terminar, a Quill criará um plano de aprendizagem só para você.'
      },
    }
  },
  [URDU]: {
    flag: 'https://assets.quill.org/images/flags/pakistan.png',
    label: 'اردو',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'پلیسمنٹ کی سرگرمی Quill',
        firstLine: 'آپ جملے لکھنے کے متعلق 22 سوالوں کے جواب دینے ہی والے ہیں۔ کچھ سوالات ان چیزوں کے بارے میں ہوسکتے ہیں جن کے بارے میں آپ نے ابھی تک نہیں سیکھا ہے - یہ ٹھیک ہے! جتنا ہو سکے ان کا جواب دیں۔ ہر سوال کے لئے ہدایات احتیاط سے پڑھنا نہ بھولیں! ایک بار جب آپ فارغ ہوجائیں تو ، کوئل آپ کے لئے سیکھنے کا منصوبہ بنائے گی۔',
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'پلیسمنٹ کی سرگرمی Quill',
        firstLine: 'آپ جملے لکھنے کے متعلق 23 سوالوں کے جواب دینے ہی والے ہیں۔ کچھ سوالات ان چیزوں کے بارے میں ہوسکتے ہیں جن کے بارے میں آپ نے ابھی تک نہیں سیکھا ہے - یہ ٹھیک ہے! جتنا ہو سکے ان کا جواب دیں۔ ہر سوال کے لئے ہدایات احتیاط سے پڑھنا نہ بھولیں! ایک بار جب آپ فارغ ہوجائیں تو ، کوئل آپ کے لئے سیکھنے کا منصوبہ بنائے گی۔'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'پلیسمنٹ کی سرگرمی Quill',
        firstLine: 'آپ جملے لکھنے کے متعلق 23 سوالوں کے جواب دینے ہی والے ہیں۔ کچھ سوالات ان چیزوں کے بارے میں ہوسکتے ہیں جن کے بارے میں آپ نے ابھی تک نہیں سیکھا ہے - یہ ٹھیک ہے! جتنا ہو سکے ان کا جواب دیں۔ ہر سوال کے لئے ہدایات احتیاط سے پڑھنا نہ بھولیں! ایک بار جب آپ فارغ ہوجائیں تو ، کوئل آپ کے لئے سیکھنے کا منصوبہ بنائے گی۔'
      },
      [ELL_STARTER_POST]: {
        header: 'پلیسمنٹ کی سرگرمی Quill',
        firstLine: 'آپ جملے لکھنے کے متعلق 22 سوالوں کے جواب دینے ہی والے ہیں۔ کچھ سوالات ان چیزوں کے بارے میں ہوسکتے ہیں جن کے بارے میں آپ نے ابھی تک نہیں سیکھا ہے - یہ ٹھیک ہے! جتنا ہو سکے ان کا جواب دیں۔ ہر سوال کے لئے ہدایات احتیاط سے پڑھنا نہ بھولیں! ایک بار جب آپ فارغ ہوجائیں تو ، کوئل آپ کے لئے سیکھنے کا منصوبہ بنائے گی۔',
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'پلیسمنٹ کی سرگرمی Quill',
        firstLine: 'آپ جملے لکھنے کے متعلق 23 سوالوں کے جواب دینے ہی والے ہیں۔ کچھ سوالات ان چیزوں کے بارے میں ہوسکتے ہیں جن کے بارے میں آپ نے ابھی تک نہیں سیکھا ہے - یہ ٹھیک ہے! جتنا ہو سکے ان کا جواب دیں۔ ہر سوال کے لئے ہدایات احتیاط سے پڑھنا نہ بھولیں! ایک بار جب آپ فارغ ہوجائیں تو ، کوئل آپ کے لئے سیکھنے کا منصوبہ بنائے گی۔'
      },
      [ELL_ADVANCED_POST]: {
        header: 'پلیسمنٹ کی سرگرمی Quill',
        firstLine: 'آپ جملے لکھنے کے متعلق 23 سوالوں کے جواب دینے ہی والے ہیں۔ کچھ سوالات ان چیزوں کے بارے میں ہوسکتے ہیں جن کے بارے میں آپ نے ابھی تک نہیں سیکھا ہے - یہ ٹھیک ہے! جتنا ہو سکے ان کا جواب دیں۔ ہر سوال کے لئے ہدایات احتیاط سے پڑھنا نہ بھولیں! ایک بار جب آپ فارغ ہوجائیں تو ، کوئل آپ کے لئے سیکھنے کا منصوبہ بنائے گی۔'
      },
    }
  },
  [GERMAN]: {
    flag: 'https://assets.quill.org/images/flags/germany.png',
    label: 'Deutsch',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Quill Platzdeckchen-Methode (Placemat)',
        firstLine: 'Du stehst kurz davor, 22 Fragen über das Schreiben von Sätzen zu beantworten.',
        secondLine: 'Einige der Fragen könnten sich auf Dinge beziehen, die du noch nicht gelernt hast – das ist in Ordnung! Beantworte sie einfach, so gut du kannst. Vergiss nicht, die Anweisungen für jede Frage sorgfältig zu lesen!',
        thirdLine: 'Sobald du fertig bist, wird Quill einen Lernplan für dich erstellen.'
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Quill Platzdeckchen-Methode (Placemat)',
        firstLine: 'Du stehst kurz davor, 23 Fragen über das Schreiben von Sätzen zu beantworten.',
        secondLine: 'Einige der Fragen könnten sich auf Dinge beziehen, die du noch nicht gelernt hast – das ist in Ordnung! Beantworte sie einfach, so gut du kannst. Vergiss nicht, die Anweisungen für jede Frage sorgfältig zu lesen!',
        thirdLine: 'Sobald du fertig bist, wird Quill einen Lernplan für dich erstellen.'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Quill Platzdeckchen-Methode (Placemat)',
        firstLine: 'Du stehst kurz davor, 23 Fragen über das Schreiben von Sätzen zu beantworten.',
        secondLine: 'Einige der Fragen könnten sich auf Dinge beziehen, die du noch nicht gelernt hast – das ist in Ordnung! Beantworte sie einfach, so gut du kannst. Vergiss nicht, die Anweisungen für jede Frage sorgfältig zu lesen!',
        thirdLine: 'Sobald du fertig bist, wird Quill einen Lernplan für dich erstellen.'
      },
      [ELL_STARTER_POST]: {
        header: 'Quill Platzdeckchen-Methode (Placemat)',
        firstLine: 'Du stehst kurz davor, 22 Fragen über das Schreiben von Sätzen zu beantworten.',
        secondLine: 'Einige der Fragen könnten sich auf Dinge beziehen, die du noch nicht gelernt hast – das ist in Ordnung! Beantworte sie einfach, so gut du kannst. Vergiss nicht, die Anweisungen für jede Frage sorgfältig zu lesen!',
        thirdLine: 'Sobald du fertig bist, wird Quill einen Lernplan für dich erstellen.'
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Quill Platzdeckchen-Methode (Placemat)',
        firstLine: 'Du stehst kurz davor, 23 Fragen über das Schreiben von Sätzen zu beantworten.',
        secondLine: 'Einige der Fragen könnten sich auf Dinge beziehen, die du noch nicht gelernt hast – das ist in Ordnung! Beantworte sie einfach, so gut du kannst. Vergiss nicht, die Anweisungen für jede Frage sorgfältig zu lesen!',
        thirdLine: 'Sobald du fertig bist, wird Quill einen Lernplan für dich erstellen.'
      },
      [ELL_ADVANCED_POST]: {
        header: 'Quill Platzdeckchen-Methode (Placemat)',
        firstLine: 'Du stehst kurz davor, 23 Fragen über das Schreiben von Sätzen zu beantworten.',
        secondLine: 'Einige der Fragen könnten sich auf Dinge beziehen, die du noch nicht gelernt hast – das ist in Ordnung! Beantworte sie einfach, so gut du kannst. Vergiss nicht, die Anweisungen für jede Frage sorgfältig zu lesen!',
        thirdLine: 'Sobald du fertig bist, wird Quill einen Lernplan für dich erstellen.'
      },
    }
  },
  [JAPANESE]: {
    flag: 'https://assets.quill.org/images/flags/japan.png',
    label: '日本語',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Quillクラス分けアクティビティ',
        firstLine: '作文についての22問の質問に答えます。',
        secondLine: '質問には、学習していない事柄についてのものもありますが、心配は不要です！単にベストを尽くして回答すれば結構です！必ず各質問の説明を注意深く読んでください',
        thirdLine: '回答を終えたら、Quillであなたに最適な学習プランが作成されます。'
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Quillクラス分けアクティビティ',
        firstLine: '作文についての23問の質問に答えます。',
        secondLine: '質問には、学習していない事柄についてのものもありますが、心配は不要です！単にベストを尽くして回答すれば結構です！必ず各質問の説明を注意深く読んでください',
        thirdLine: '回答を終えたら、Quillであなたに最適な学習プランが作成されます。'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Quillクラス分けアクティビティ',
        firstLine: '作文についての23問の質問に答えます。',
        secondLine: '質問には、学習していない事柄についてのものもありますが、心配は不要です！単にベストを尽くして回答すれば結構です！必ず各質問の説明を注意深く読んでください',
        thirdLine: '回答を終えたら、Quillであなたに最適な学習プランが作成されます。'
      },
      [ELL_STARTER_POST]: {
        header: 'Quillクラス分けアクティビティ',
        firstLine: '作文についての22問の質問に答えます。',
        secondLine: '質問には、学習していない事柄についてのものもありますが、心配は不要です！単にベストを尽くして回答すれば結構です！必ず各質問の説明を注意深く読んでください',
        thirdLine: '回答を終えたら、Quillであなたに最適な学習プランが作成されます。'
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Quillクラス分けアクティビティ',
        firstLine: '作文についての23問の質問に答えます。',
        secondLine: '質問には、学習していない事柄についてのものもありますが、心配は不要です！単にベストを尽くして回答すれば結構です！必ず各質問の説明を注意深く読んでください',
        thirdLine: '回答を終えたら、Quillであなたに最適な学習プランが作成されます。'
      },
      [ELL_ADVANCED_POST]: {
        header: 'Quillクラス分けアクティビティ',
        firstLine: '作文についての23問の質問に答えます。',
        secondLine: '質問には、学習していない事柄についてのものもありますが、心配は不要です！単にベストを尽くして回答すれば結構です！必ず各質問の説明を注意深く読んでください',
        thirdLine: '回答を終えたら、Quillであなたに最適な学習プランが作成されます。'
      },
    }
  },
  [KOREAN]: {
    flag: 'https://assets.quill.org/images/flags/south_korea.png',
    label: '한국어',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Quill 배치 활동',
        firstLine: '이제부터 문장 작성에 관한 22 가지 문항에 답해야 합니다.',
        secondLine: '어떤 질문은 아직 배운 내용이 아닐 수도 있습니다. 하지만, 괜찮습니다! 최선을 다해 답하면 됩니다. 각 문제마다 질문을 반드시 주의 깊게 읽어 주세요!',
        thirdLine: '모든 문항을 완료하면, Quill이 여러분을 위한 학습 계획을 작성해 드립니다.'
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Quill 배치 활동',
        firstLine: '이제부터 문장 작성에 관한 23 가지 문항에 답해야 합니다. ',
        secondLine: '어떤 질문은 아직 배운 내용이 아닐 수도 있습니다. 하지만, 괜찮습니다! 최선을 다해 답하면 됩니다. 각 문제마다 질문을 반드시 주의 깊게 읽어 주세요!',
        thirdLine: '모든 문항을 완료하면, Quill이 여러분을 위한 학습 계획을 작성해 드립니다.'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Quill 배치 활동',
        firstLine: '이제부터 문장 작성에 관한 23 가지 문항에 답해야 합니다. ',
        secondLine: '어떤 질문은 아직 배운 내용이 아닐 수도 있습니다. 하지만, 괜찮습니다! 최선을 다해 답하면 됩니다. 각 문제마다 질문을 반드시 주의 깊게 읽어 주세요!',
        thirdLine: '모든 문항을 완료하면, Quill이 여러분을 위한 학습 계획을 작성해 드립니다.'
      },
      [ELL_STARTER_POST]: {
        header: 'Quill 배치 활동',
        firstLine: '이제부터 문장 작성에 관한 22 가지 문항에 답해야 합니다.',
        secondLine: '어떤 질문은 아직 배운 내용이 아닐 수도 있습니다. 하지만, 괜찮습니다! 최선을 다해 답하면 됩니다. 각 문제마다 질문을 반드시 주의 깊게 읽어 주세요!',
        thirdLine: '모든 문항을 완료하면, Quill이 여러분을 위한 학습 계획을 작성해 드립니다.'
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Quill 배치 활동',
        firstLine: '이제부터 문장 작성에 관한 23 가지 문항에 답해야 합니다. ',
        secondLine: '어떤 질문은 아직 배운 내용이 아닐 수도 있습니다. 하지만, 괜찮습니다! 최선을 다해 답하면 됩니다. 각 문제마다 질문을 반드시 주의 깊게 읽어 주세요!',
        thirdLine: '모든 문항을 완료하면, Quill이 여러분을 위한 학습 계획을 작성해 드립니다.'
      },
      [ELL_ADVANCED_POST]: {
        header: 'Quill 배치 활동',
        firstLine: '이제부터 문장 작성에 관한 23 가지 문항에 답해야 합니다. ',
        secondLine: '어떤 질문은 아직 배운 내용이 아닐 수도 있습니다. 하지만, 괜찮습니다! 최선을 다해 답하면 됩니다. 각 문제마다 질문을 반드시 주의 깊게 읽어 주세요!',
        thirdLine: '모든 문항을 완료하면, Quill이 여러분을 위한 학습 계획을 작성해 드립니다.'
      },
    }
  },
  [VIETNAMESE]: {
    flag: 'https://assets.quill.org/images/flags/vietnam.png',
    label: 'Tiếng Việt',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Hoạt động Sắp xếp Quill',
        firstLine: 'Bạn sắp trả lời 22 câu hỏi về việc viết câu.',
        secondLine: 'Một số câu hỏi có thể là về những điều bạn chưa được học—không sao cả. Bạn chỉ cần trả lời tốt nhất có thể. Đừng quên đọc hướng dẫn cẩn thận cho mỗi câu hỏi nhé!',
        thirdLine: 'Khi bạn đã hoàn thành, Quill sẽ tạo một kế hoạch học tập dành riêng cho bạn.'
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Hoạt động Sắp xếp Quill',
        firstLine: 'Bạn sắp trả lời 23 câu hỏi về việc viết câu.',
        secondLine: 'Một số câu hỏi có thể là về những điều bạn chưa được học—không sao cả. Bạn chỉ cần trả lời tốt nhất có thể. Đừng quên đọc hướng dẫn cẩn thận cho mỗi câu hỏi nhé!',
        thirdLine: 'Khi bạn đã hoàn thành, Quill sẽ tạo một kế hoạch học tập dành riêng cho bạn.'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Hoạt động Sắp xếp Quill',
        firstLine: 'Bạn sắp trả lời 23 câu hỏi về việc viết câu. ',
        secondLine: 'Một số câu hỏi có thể là về những điều bạn chưa được học—không sao cả. Bạn chỉ cần trả lời tốt nhất có thể. Đừng quên đọc hướng dẫn cẩn thận cho mỗi câu hỏi nhé!',
        thirdLine: 'Khi bạn đã hoàn thành, Quill sẽ tạo một kế hoạch học tập dành riêng cho bạn.'
      },
      [ELL_STARTER_POST]: {
        header: 'Hoạt động Sắp xếp Quill',
        firstLine: 'Bạn sắp trả lời 22 câu hỏi về việc viết câu.',
        secondLine: 'Một số câu hỏi có thể là về những điều bạn chưa được học—không sao cả. Bạn chỉ cần trả lời tốt nhất có thể. Đừng quên đọc hướng dẫn cẩn thận cho mỗi câu hỏi nhé!',
        thirdLine: 'Khi bạn đã hoàn thành, Quill sẽ tạo một kế hoạch học tập dành riêng cho bạn.'
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Hoạt động Sắp xếp Quill',
        firstLine: 'Bạn sắp trả lời 23 câu hỏi về việc viết câu.',
        secondLine: 'Một số câu hỏi có thể là về những điều bạn chưa được học—không sao cả. Bạn chỉ cần trả lời tốt nhất có thể. Đừng quên đọc hướng dẫn cẩn thận cho mỗi câu hỏi nhé!',
        thirdLine: 'Khi bạn đã hoàn thành, Quill sẽ tạo một kế hoạch học tập dành riêng cho bạn.'
      },
      [ELL_ADVANCED_POST]: {
        header: 'Hoạt động Sắp xếp Quill',
        firstLine: 'Bạn sắp trả lời 23 câu hỏi về việc viết câu. ',
        secondLine: 'Một số câu hỏi có thể là về những điều bạn chưa được học—không sao cả. Bạn chỉ cần trả lời tốt nhất có thể. Đừng quên đọc hướng dẫn cẩn thận cho mỗi câu hỏi nhé!',
        thirdLine: 'Khi bạn đã hoàn thành, Quill sẽ tạo một kế hoạch học tập dành riêng cho bạn.'
      },
    }
  },
  [THAI]: {
    flag: 'https://assets.quill.org/images/flags/thailand.png',
    label: 'ไทย',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'กิจกรรมการทดสอบวัดระดับภาษาของ Quill',
        firstLine: 'คุณกำลังจะตอบคำถาม 22 ข้อเกี่ยวกับการเขียนประโยค',
        secondLine: 'คำถามบางข้ออาจจะเกี่ยวกับสิ่งที่คุณยังไม่ได้เรียน- ซึ่งไม่เป็นไร! เพียงแค่ตอบคำถามที่คุณสามารถตอบได้อย่างดีที่สุด อย่าลืมอ่านคำสั่งอย่างละเอียดสำหรับคำถามแต่ละข้อ! ',
        thirdLine: 'Quill จะสร้างแผนการเรียนสำหรับคุณโดยเฉพาะเมื่อคุณตอบคำถามเสร็จแล้ว'
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'กิจกรรมการทดสอบวัดระดับภาษาของ Quill',
        firstLine: 'คุณกำลังจะตอบคำถาม 23 ข้อเกี่ยวกับการเขียนประโยค',
        secondLine: 'คำถามบางข้ออาจจะเกี่ยวกับสิ่งที่คุณยังไม่ได้เรียน- ซึ่งไม่เป็นไร! เพียงแค่ตอบคำถามที่คุณสามารถตอบได้อย่างดีที่สุด อย่าลืมอ่านคำสั่งอย่างละเอียดสำหรับคำถามแต่ละข้อ!',
        thirdLine: 'Quill จะสร้างแผนการเรียนสำหรับคุณโดยเฉพาะเมื่อคุณตอบคำถามเสร็จแล้ว'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'กิจกรรมการทดสอบวัดระดับภาษาของ Quill',
        firstLine: 'คุณกำลังจะตอบคำถาม 23 ข้อเกี่ยวกับการเขียนประโยค ',
        secondLine: 'คำถามบางข้ออาจจะเกี่ยวกับสิ่งที่คุณยังไม่ได้เรียน- ซึ่งไม่เป็นไร! เพียงแค่ตอบคำถามที่คุณสามารถตอบได้อย่างดีที่สุด อย่าลืมอ่านคำสั่งอย่างละเอียดสำหรับคำถามแต่ละข้อ! ',
        thirdLine: 'Quill จะสร้างแผนการเรียนสำหรับคุณโดยเฉพาะเมื่อคุณตอบคำถามเสร็จแล้ว'
      },
      [ELL_STARTER_POST]: {
        header: 'กิจกรรมการทดสอบวัดระดับภาษาของ Quill',
        firstLine: 'คุณกำลังจะตอบคำถาม 22 ข้อเกี่ยวกับการเขียนประโยค',
        secondLine: 'คำถามบางข้ออาจจะเกี่ยวกับสิ่งที่คุณยังไม่ได้เรียน- ซึ่งไม่เป็นไร! เพียงแค่ตอบคำถามที่คุณสามารถตอบได้อย่างดีที่สุด อย่าลืมอ่านคำสั่งอย่างละเอียดสำหรับคำถามแต่ละข้อ! ',
        thirdLine: 'Quill จะสร้างแผนการเรียนสำหรับคุณโดยเฉพาะเมื่อคุณตอบคำถามเสร็จแล้ว'
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'กิจกรรมการทดสอบวัดระดับภาษาของ Quill',
        firstLine: 'คุณกำลังจะตอบคำถาม 23 ข้อเกี่ยวกับการเขียนประโยค',
        secondLine: 'คำถามบางข้ออาจจะเกี่ยวกับสิ่งที่คุณยังไม่ได้เรียน- ซึ่งไม่เป็นไร! เพียงแค่ตอบคำถามที่คุณสามารถตอบได้อย่างดีที่สุด อย่าลืมอ่านคำสั่งอย่างละเอียดสำหรับคำถามแต่ละข้อ!',
        thirdLine: 'Quill จะสร้างแผนการเรียนสำหรับคุณโดยเฉพาะเมื่อคุณตอบคำถามเสร็จแล้ว'
      },
      [ELL_ADVANCED_POST]: {
        header: 'กิจกรรมการทดสอบวัดระดับภาษาของ Quill',
        firstLine: 'คุณกำลังจะตอบคำถาม 23 ข้อเกี่ยวกับการเขียนประโยค ',
        secondLine: 'คำถามบางข้ออาจจะเกี่ยวกับสิ่งที่คุณยังไม่ได้เรียน- ซึ่งไม่เป็นไร! เพียงแค่ตอบคำถามที่คุณสามารถตอบได้อย่างดีที่สุด อย่าลืมอ่านคำสั่งอย่างละเอียดสำหรับคำถามแต่ละข้อ! ',
        thirdLine: 'Quill จะสร้างแผนการเรียนสำหรับคุณโดยเฉพาะเมื่อคุณตอบคำถามเสร็จแล้ว'
      },
    }
  },
  [UKRAINIAN]: {
    flag: 'https://assets.quill.org/images/flags/ukraine.png',
    label: 'Українська',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Розподільний тест Quill',
        firstLine: 'Вам потрібно буде відповісти на 22 письмових запитання.',
        secondLine: 'Деякі запитання можуть стосуватися речей, яких ви ще не вчили – це нормально! Просто відповідайте на них якнайкраще. Не забудьте уважно прочитати інструкції до кожного запитання!',
        thirdLine: 'Коли ви закінчите, Quill створить ваш індивідуальний навчальний план.'
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Розподільний тест Quill',
        firstLine: 'Вам потрібно буде відповісти на 23 письмових запитання. ',
        secondLine: 'Деякі запитання можуть стосуватися речей, яких ви ще не вчили – це нормально! Просто відповідайте на них якнайкраще. Не забудьте уважно прочитати інструкції до кожного запитання!',
        thirdLine: 'Коли ви закінчите, Quill створить ваш індивідуальний навчальний план.'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Розподільний тест Quill',
        firstLine: 'Вам потрібно буде відповісти на 23 письмових запитання. ',
        secondLine: 'Деякі запитання можуть стосуватися речей, яких ви ще не вчили – це нормально! Просто відповідайте на них якнайкраще. Не забудьте уважно прочитати інструкції до кожного запитання! ',
        thirdLine: 'Коли ви закінчите, Quill створить ваш індивідуальний навчальний план.'
      },
      [ELL_STARTER_POST]: {
        header: 'Розподільний тест Quill',
        firstLine: 'Вам потрібно буде відповісти на 22 письмових запитання.',
        secondLine: 'Деякі запитання можуть стосуватися речей, яких ви ще не вчили – це нормально! Просто відповідайте на них якнайкраще. Не забудьте уважно прочитати інструкції до кожного запитання!',
        thirdLine: 'Коли ви закінчите, Quill створить ваш індивідуальний навчальний план.'
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Розподільний тест Quill',
        firstLine: 'Вам потрібно буде відповісти на 23 письмових запитання. ',
        secondLine: 'Деякі запитання можуть стосуватися речей, яких ви ще не вчили – це нормально! Просто відповідайте на них якнайкраще. Не забудьте уважно прочитати інструкції до кожного запитання!',
        thirdLine: 'Коли ви закінчите, Quill створить ваш індивідуальний навчальний план.'
      },
      [ELL_ADVANCED_POST]: {
        header: 'Розподільний тест Quill',
        firstLine: 'Вам потрібно буде відповісти на 23 письмових запитання. ',
        secondLine: 'Деякі запитання можуть стосуватися речей, яких ви ще не вчили – це нормально! Просто відповідайте на них якнайкраще. Не забудьте уважно прочитати інструкції до кожного запитання! ',
        thirdLine: 'Коли ви закінчите, Quill створить ваш індивідуальний навчальний план.'
      },
    }
  },
  [TAGALOG]: {
    flag: 'https://assets.quill.org/images/flags/philippines.png',
    label: 'Tagalog',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'Placement Activity ng Quill',
        firstLine: 'May sasagutin ka ngayon na 22 tanong sa pagsusulat ng pangungusap.',
        secondLine:  'Ang ilan sa mga tanong ay maaaring tungkol sa mga bagay na hindi mo pa alam—pero okay lang iyon! Sagutan lang ang mga iyon sa abot ng kaya mo. Huwag kalimutang basahin ang mga tagubilin para sa bawat tanong!',
        thirdLine: 'Kapag tapos ka na, gagawa ang Quill ng isang learning plan para lang sa iyo.'
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'Placement Activity ng Quill',
        firstLine: 'May sasagutin ka ngayon na 23 tanong sa pagsusulat ng pangungusap.',
        secondLine:  'Ang ilan sa mga tanong ay maaaring tungkol sa mga bagay na hindi mo pa alam—pero okay lang iyon! Sagutan lang ang mga iyon sa abot ng kaya mo. Huwag kalimutang basahin ang mga tagubilin para sa bawat tanong!',
        thirdLine: 'Kapag tapos ka na, gagawa ang Quill ng isang learning plan para lang sa iyo.'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'Placement Activity ng Quill',
        firstLine: 'May sasagutin ka ngayon na 23 tanong sa pagsusulat ng pangungusap.',
        secondLine:  'Ang ilan sa mga tanong ay maaaring tungkol sa mga bagay na hindi mo pa alam—pero okay lang iyon! Sagutan lang ang mga iyon sa abot ng kaya mo. Huwag kalimutang basahin ang mga tagubilin para sa bawat tanong!',
        thirdLine: 'Kapag tapos ka na, gagawa ang Quill ng isang learning plan para lang sa iyo.'
      },
      [ELL_STARTER_POST]: {
        header: 'Placement Activity ng Quill',
        firstLine: 'May sasagutin ka ngayon na 22 tanong sa pagsusulat ng pangungusap.',
        secondLine:  'Ang ilan sa mga tanong ay maaaring tungkol sa mga bagay na hindi mo pa alam—pero okay lang iyon! Sagutan lang ang mga iyon sa abot ng kaya mo. Huwag kalimutang basahin ang mga tagubilin para sa bawat tanong!',
        thirdLine: 'Kapag tapos ka na, gagawa ang Quill ng isang learning plan para lang sa iyo.'
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'Placement Activity ng Quill',
        firstLine: 'May sasagutin ka ngayon na 23 tanong sa pagsusulat ng pangungusap.',
        secondLine:  'Ang ilan sa mga tanong ay maaaring tungkol sa mga bagay na hindi mo pa alam—pero okay lang iyon! Sagutan lang ang mga iyon sa abot ng kaya mo. Huwag kalimutang basahin ang mga tagubilin para sa bawat tanong!',
        thirdLine: 'Kapag tapos ka na, gagawa ang Quill ng isang learning plan para lang sa iyo.'
      },
      [ELL_ADVANCED_POST]: {
        header: 'Placement Activity ng Quill',
        firstLine: 'May sasagutin ka ngayon na 23 tanong sa pagsusulat ng pangungusap.',
        secondLine:  'Ang ilan sa mga tanong ay maaaring tungkol sa mga bagay na hindi mo pa alam—pero okay lang iyon! Sagutan lang ang mga iyon sa abot ng kaya mo. Huwag kalimutang basahin ang mga tagubilin para sa bawat tanong!',
        thirdLine: 'Kapag tapos ka na, gagawa ang Quill ng isang learning plan para lang sa iyo.'
      },
    }
  },
  [DARI]: {
    flag: 'https://assets.quill.org/images/flags/afghanistan.png',
    label: 'درى',
    intro: {
      [ELL_STARTER_PRE]: {
        header: 'فعالیت قرارگیری درکویل Quill',
        firstLine: 'شمادارین 22 سوال راجواب بدهید با نوشتن جملات. بعضی جملات درباره چیزهای است که شاید شما تا هنوزیادنداشته باشید-درست است! تامیتوانید جواب درست بدهید. ازیادتان نرود که هدایت هرسوال رادرست بخوانید!که خلاص شد,کویل به شما پلان یادگرفتن ایجاد میکند.',
      },
      [ELL_INTERMEDIATE_PRE]:  {
        header: 'فعالیت قرارگیری درکویل Quill',
        firstLine: 'شمادارین 23 سوال راجواب بدهید با نوشتن جملات. بعضی جملات درباره چیزهای است که شاید شما تا هنوزیادنداشته باشید-درست است! تامیتوانید جواب درست بدهید. ازیادتان نرود که هدایت هرسوال رادرست بخوانید!که خلاص شد,کویل به شما پلان یادگرفتن ایجاد میکند.'
      },
      [ELL_ADVANCED_PRE]: {
        header: 'فعالیت قرارگیری درکویل Quill',
        firstLine: 'شمادارین 23 سوال راجواب بدهید با نوشتن جملات. بعضی جملات درباره چیزهای است که شاید شما تا هنوزیادنداشته باشید-درست است! تامیتوانید جواب درست بدهید. ازیادتان نرود که هدایت هرسوال رادرست بخوانید!که خلاص شد,کویل به شما پلان یادگرفتن ایجاد میکند.'
      },
      [ELL_STARTER_POST]: {
        header: 'فعالیت قرارگیری درکویل Quill',
        firstLine: 'شمادارین 22 سوال راجواب بدهید با نوشتن جملات. بعضی جملات درباره چیزهای است که شاید شما تا هنوزیادنداشته باشید-درست است! تامیتوانید جواب درست بدهید. ازیادتان نرود که هدایت هرسوال رادرست بخوانید!که خلاص شد,کویل به شما پلان یادگرفتن ایجاد میکند.',
      },
      [ELL_INTERMEDIATE_POST]:  {
        header: 'فعالیت قرارگیری درکویل Quill',
        firstLine: 'شمادارین 23 سوال راجواب بدهید با نوشتن جملات. بعضی جملات درباره چیزهای است که شاید شما تا هنوزیادنداشته باشید-درست است! تامیتوانید جواب درست بدهید. ازیادتان نرود که هدایت هرسوال رادرست بخوانید!که خلاص شد,کویل به شما پلان یادگرفتن ایجاد میکند.'
      },
      [ELL_ADVANCED_POST]: {
        header: 'فعالیت قرارگیری درکویل Quill',
        firstLine: 'شمادارین 23 سوال راجواب بدهید با نوشتن جملات. بعضی جملات درباره چیزهای است که شاید شما تا هنوزیادنداشته باشید-درست است! تامیتوانید جواب درست بدهید. ازیادتان نرود که هدایت هرسوال رادرست بخوانید!که خلاص شد,کویل به شما پلان یادگرفتن ایجاد میکند.'
      },
    }
  },
}
