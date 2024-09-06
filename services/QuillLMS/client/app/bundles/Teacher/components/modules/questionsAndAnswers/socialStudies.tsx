import * as React from 'react'

const socialStudies = () => [
  {
    question: 'How does Quill Reading for Evidence build reading, writing, and critical thinking skills?',
    answer: (
      <div>
        <p>Quill Reading for Evidence is our newest learning tool—and our first tool that supports students in building both language and reading skills. Each Reading for Evidence activity provides a high-interest, nonfiction text for students to read, and then engages them in expressing their understanding of that text through open-ended writing prompts.</p>
        <p>Students are asked to write about a key idea from the text using the connectives <i>because</i>, <i>but</i>, and <i>so</i>. As students write and revise, Quill&apos;s artificial intelligence (AI) Feedback Bot coaches them to improve the accuracy and specificity of their evidence, refine their logic and syntax, and correct any grammatical errors. Like in Quill Connect, students can make up to 4 revisions for each prompt. Designed for students in grades 8-12, these activities take about 15-20 minutes for students to complete.</p>
      </div>
    )
  },
  {
    question: 'What distinguishes Quill Reading for Evidence from other online reading tools?',
    answer: (
      <div>
        <p>Over the last few years, we&apos;ve watched as more and more digital tools enter classrooms that intend to improve students&apos; reading and writing. We&apos;ve been struck by the fact that virtually all of them assess student learning the same way: through multiple-choice questions. Many members of the Quill team are former teachers; we&apos;ve seen firsthand what many students do with multiple-choice questions: they scan the text for the “right answer,” and move on as soon as they find it, or worse, they copy the answers from a friend or a quick Google search. We wanted to create a digital reading tool that would go <i>beyond</i> multiple-choice—to provide a rich learning experience, and not only an assessment of learning.</p>
        <p>We began with a writing strategy in which students are asked to use the connectives <i>because</i>, <i>but</i>, and <i>so</i> to expand a provided sentence stem. In the paper-based version of this activity, a social studies teacher, for example, might give students the stem: “The British government wanted to vaccinate the public against smallpox…” A strong set of sentences in response might be:</p>
        <ul>
          <li>The British government wanted to vaccinate the public against smallpox <strong>because</strong> <i>smallpox was responsible for the deaths of thousands of people in England every year</i>.</li>
          <li>The British government wanted to vaccinate the public against smallpox, <strong>but</strong> <i>some citizens believed that it was a violation of their medical freedom</i>.</li>
          <li>The British government wanted to vaccinate the public against smallpox, <strong>so</strong> <i>the British government made these laws mandatory</i>.</li>
        </ul>
        <p>This activity accomplishes so much simultaneously. Students have to read—and have to <i>understand</i> what they read—to complete the stems. Instead of selecting A, B, C, or D, they have to think through complex logical relationships: cause-effect and claim-counterclaim.</p>
        <p>What&apos;s more, even with the wide variety of sentences they might write, students will get precise, targeted feedback. Quill&apos;s AI Feedback Bot can show students where to reread, suggest information to include in their response, or show them an exemplar to follow. Each activity&apos;s feedback is highly specific to the activity&apos;s text. In the end, each student completing a Reading for Evidence activity gets their own private coach.</p>
        <p>How is this possible? Quill&apos;s curriculum developers write custom feedback for each Reading for Evidence text and writing prompt, so when a student submits a response, Quill&apos;s AI Feedback Bot compares the student&apos;s response to categories the team has created. The Bot  determines which category the response falls into, and serves the appropriate feedback. Creating these activities is time- and labor-intensive, but being able to provide this rich reading and writing experience for students makes it well worth the effort.</p>
      </div>
    ),
  },
  {
    question: 'What do students need to know about Quill Reading for Evidence?',
    answer: (
      <div>
        <p>You may want to share the following with students before they complete a Reading for Evidence activity:</p>
        <ul>
          <li><strong>What kind of writing will Quill&apos;s AI Feedback Bot encourage and discourage?</strong></li>
          <ul>
            <li>These activities are all about specificity and accuracy. This means the Bot may ask for more detail if your response is accurate, but short.</li>
            <li>If you write a response that is accurate but not based on evidence from the text, the Bot will ask you to revise using evidence from the text. Likewise, you will be discouraged from using direct quotations—the Bot will prompt you to put ideas into your own words.</li>
            <li>The Bot will also discourage you from drawing your own conclusions, sharing an opinion, or giving a recommendation. (Of course, your teacher may want you to do this outside of these activities! But in Reading for Evidence, it's all about what's in the text.)</li>
          </ul>
          <li><strong>Sometimes Quill&apos;s AI Feedback Bot will give the wrong feedback.</strong> Try your best to use the feedback you&apos;ve been given, and let Quill know when you&apos;ve received unhelpful feedback (just click the “Report a Problem” button under that piece of feedback). You can also share general feedback on the tool through the optional emoji survey at the end of every activity. </li>
        </ul>
        <p>For more on introducing Reading for Evidence to students, check out <a href="https://www.quill.org/teacher-center/using-quill-evidence-with-students-best-practices" rel="noopener noreferrer" target="_blank">this article</a>.</p>
      </div>
    ),
  },
  {
    question: 'What are some best practices for introducing Quill Reading for Evidence to my students and integrating it into my instruction?',
    answer: (
      <div>
        <p>The following are our recommendations for teachers using Reading for Evidence with students:</p>
        <ol>
          <li><strong>Introduce students to Quill and the Reading for Evidence tool.</strong> Frame the work they are about to do. Explaining the function of the connectives <i>because</i>, <i>but</i>, and <i>so</i> and providing examples can be particularly helpful.</li>
          <li><strong>Walk students through the student onboarding section of a Reading for Evidence activity.</strong> These pages emphasize three takeaways: all writers revise; feedback may not always be correct; their teacher can see their responses and score.</li>
          <li><strong>Model application of Reading for Evidence&apos;s feedback.</strong> This helps students develop the skill of applying feedback. This is also a great place to explain what Reading for Evidence is looking for.</li>
          <li><strong>Align Reading for Evidence activities to your curriculum.</strong> Whenever possible, help students connect the content in Reading for Evidence activities to content they&#39;ve studied in your class.</li>
          <li><strong>Invite students to reflect on their thinking, writing, and learning in the tool.</strong> Have students use <i>because</i>, <i>but</i>, and <i>so</i> to extend their responses about content in class. </li>
        </ol>
        <p>Read more about <a href="https://www.quill.org/teacher-center/using-quill-evidence-with-students-best-practices" rel="noopener noreferrer" target="_blank">getting started using Reading for Evidence with your students in this article</a>.</p>
      </div>
    ),
  },
  {
    question: 'For whom are these activities most appropriate? How does the tool support students who may need more scaffolding, like multilingual learners and students with IEPs?',
    answer: (
      <div>
        <p>This first iteration of the Reading for Evidence tool is most appropriate for general education students in grades 8-12. However, the tool can provide valuable practice for students who don&apos;t fall into this category. Here are some ways you can support students who may need additional scaffolds:</p>
        <ul>
          <li><strong>Introduce the main idea of the text and front-load vocabulary.</strong> For example, images/illustrations, videos, magazine/newspaper articles, realia, etc. can be used to help students access an activity text and activate relevant schema. </li>
          <li><strong>Use browser extensions to provide read aloud and language support.</strong> Over the next several months and years, we will embed more scaffolds within the tool. For example, students will be able to hover over challenging vocabulary to see a student-friendly definition, etc. However, in the meantime, Reading for Evidence integrates with a variety of extensions that can provide important support. </li>
          <li><strong>Model how to find evidence and how to incorporate feedback.</strong> There is so much metacognition at work when completing these activities. Pulling back the curtain on that for students can be powerful— and empowering!</li>
        </ul>
        <p><a href="https://www.quill.org/teacher-center/how-to-support-english-language-learners-using-quill-reading-for-evidence" rel="noopener noreferrer" target="_blank">This Teacher Center article expands on the tips above and links to extensions that integrate with Reading for Evidence.</a></p>
      </div>
    )
  },
]

export default socialStudies
