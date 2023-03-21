# frozen_string_literal: true

module PublicPagesHelper
  STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID = 99
  INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID = 100
  ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID = 126
  ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID = 154
  ELL_INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID = 299
  ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID = 300
  PRE_AP_WRITINGS_SKILLS_1_UNIT_TEMPLATE_ID = 194
  PRE_AP_WRITINGS_SKILLS_2_UNIT_TEMPLATE_ID = 195
  AP_WRITINGS_SKILLS_UNIT_TEMPLATE_ID = 193
  SPRING_BOARD_SKILLS_UNIT_TEMPLATE_ID = 253

  def featured_activity_url(activity_id)
    "#{ENV['DEFAULT_URL']}/activities/packs/#{activity_id}"
  end

  def ap_questions_and_answers
    [
      {
        question: 'What is Quill.org?',
        answer: "<p>Quill is a writing tool that provides over 700 writing, grammar, and proofreading activities designed to engage students in the writing process. Quill provides practice in many areas of sentence writing, from comma placement and subject-verb agreement to the use of conjunctions to convey complex relationships between ideas. In the Quill Connect tool, students practice writing different types of sentences using the evidence-based strategy of sentence combining. Students receive specific, targeted feedback on their writing that they can use to revise their work. Through these activities, students practice writing a variety of sophisticated sentences and practice conveying complex ideas in clear, succinct, and grammatically strong ways. Most activities are designed to be completed in 10-15 minutes so that you have the freedom to use them in the way that works best for your classroom.</p>".html_safe
      },
      {
        question: 'What is the AP Writing Skills Survey?',
        answer: "<p>The AP Writing Skills Survey is a survey with 17 questions on a range of writing skills. The questions ask students to combine sentences, sometimes with a direction to use a specific strategy, and sometimes without any direction (other than to combine).</p>".html_safe
      },
      {
        question: 'For which AP courses is this practice most relevant?',
        answer: "<p>Students in any AP course can benefit from the practice recommended by Quill&apos;s AP Writing Skills Survey, but the practice is probably of greatest interest to teachers of AP English Language and Composition and AP English Literature and Composition.</p>".html_safe
      },
      {
        question: 'Is a writing skills survey different than a diagnostic?',
        answer: "<p>Quill&apos;s writing skills surveys can be used in lieu of Quill&apos;s general diagnostics. For example, an AP teacher would likely assign the AP Writing Skills Survey in lieu of the Advanced Diagnostic. Keep in mind, however, that teachers may want ELL students in AP courses to begin with one of the ELL Diagnostics instead of a writing skills survey. <a href='https://support.quill.org/en/articles/2554430-what-are-the-differences-between-the-various-diagnostic-assessments' rel='noopener noreferrer' target='_blank'>This article explains the differences between Quill&apos;s various diagnostics and surveys in more depth.</a></p>".html_safe
      },
      {
        question: 'How long does the Survey take?',
        answer: "<p>The Survey contains 17 questions and is designed to take about 30 minutes for students to complete.</p>".html_safe
      },
      {
        question: 'What happens after I assign the Survey and my students complete it?',
        answer: "<p>After you have assigned the Survey and your students have completed it, Quill will show you how your students performed and provide recommendations of personalized practice activities you can digitally assign to students who need further skill development. <a href='https://support.quill.org/en/articles/1589522-how-do-i-assign-diagnostic-recommendations'>This article</a> explains how to find and assign those recommendations.</p>".html_safe
      },
      {
        question: 'What kind of activities will be recommended to my students after they take the AP Writing Skills Survey?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>Depending on their performance, students will be recommended some or all of the following AP Writing Practice packs. The packs provide practice through <a href='https://www.quill.org/tools/connect'>Quill Connect</a>, <a href='https://www.quill.org/teacher-center/-3'>Quill&apos;s sentence combining tool</a>. With the exception of the <a href='https://www.quill.org/activities/packs/142'>AP Writing - Advanced Sentence Combining pack</a>, the activities in each pack are scaffolded to build in complexity. Here are descriptions of the packs:</p>
            <p class='college-board-sub-header'>AP Writing Practice - <a href='https://www.quill.org/activities/packs/139' rel='noopener noreferrer' target='_blank'>Complex Sentences</a></p>
            <p class='college-board-q-and-a-text'>Students practice constructing complex sentences using subordinating conjunctions, such as even though, after, while, and because. Students also practice identifying time order, opposition, and cause/effect relationships.</p>
            <p class='college-board-sub-header'>AP Writing Practice - <a href='https://www.quill.org/activities/packs/140' rel='noopener noreferrer' target='_blank'>Relative Clauses</a></p>
            <p class='college-board-q-and-a-text'>Students begin by using a provided relative pronoun, then progress to choosing between who, that, or which.</p>
            <p class='college-board-sub-header'>AP Writing Practice - <a href='https://www.quill.org/activities/packs/143' rel='noopener noreferrer' target='_blank'>Appositive Phrases</a></p>
            <p class='college-board-q-and-a-text'>Students practice describing nouns using appositive phrases at the beginning, middle, and end of sentences.</p>
            <p class='college-board-sub-header'>AP Writing Practice - <a href='https://www.quill.org/activities/packs/144' rel='noopener noreferrer' target='_blank'>Participial Phrases</a></p>
            <p class='college-board-q-and-a-text'>Students practice constructing sentences with -ing and -ed participial phrases at the beginning, middle, or end.</p>
            <p class='college-board-sub-header'>AP Writing Practice - <a href='https://www.quill.org/activities/packs/192' rel='noopener noreferrer' target='_blank'>Parallel Structure</a></p>
            <p class='college-board-q-and-a-text'>Students practice constructing sentences in parallel structure with correlative conjunctions like either/or, neither/nor, and both/and, and with subordinating conjunctions like although, because, and when. Students also practice constructing sentences with parallel clauses.</p>
            <p class='college-board-sub-header'>AP Writing Practice - <a href='https://www.quill.org/activities/packs/141' rel='noopener noreferrer' target='_blank'>Compound-Complex Sentences</a></p>
            <p class='college-board-q-and-a-text'>Students practice constructing compound sentences with and, or, but, and so. Students also practice constructing complex sentences with subordinating conjunctions such as even though, after, while, and because. Finally, students practice constructing compound-complex sentences with coordinating and subordinating conjunctions. Students also practice identifying time order, opposition, and cause/effect relationships.</p>
            <p class='college-board-sub-header'>AP Writing Practice - <a href='https://www.quill.org/activities/packs/142' rel='noopener noreferrer' target='_blank'>Advanced Combining</a></p>
            <p class='college-board-q-and-a-text'>Students apply their knowledge of multiple sentence structures to combine the sentences in the strongest way possible. Students practice constructing compound and complex sentences, using modifying phrases and clauses, and combining predicates.</p>
          </div>".html_safe
      },
      {
        question: 'Can students complete the AP Writing Practice packs independently?',
        answer: "<p>Yes! From anywhere and at any time! Again though, please note that recommendations of the AP Writing Packs are generated after students complete the AP Writing Skills Survey. Please also note that students&apos; performance on the AP Writing Practice packs will only be recorded if they are assigned to them by their teacher.</p>".html_safe
      },
      {
        question: 'How many activities are in each AP Writing Practice pack?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>Each AP recommended pack* contains between 4 and 7 activities, each of which are designed to take between 10 and 15 minutes each.</p>
            <p class='college-board-q-and-a-text'>*Please note that the activities in the <a href='https://www.quill.org/activities/packs/142' rel='noopener noreferrer' target='_blank'>AP Writing - Advanced Combining pack</a> are different as they are all uncued, meaning the feedback does not direct students to combine in a particular way. These are great for students who are ready to apply the strategies covered in the survey without suggestions or direction.</p>
          </div>".html_safe
      },
      {
        question: 'What grade-level or reading level are the AP Activity Packs designed for?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>The focus in most of these activities is to build the target skill of the pack (appositives, relative clauses, etc.), so the vocabulary and reading level are intentionally designed to be accessible by all students.</p>
            <p class='college-board-q-and-a-text'>Teacher Tip: You can preview and play through any pack and its activities to get a sense of whether it&apos;s appropriate for your students.</p>
          </div>".html_safe
      },
      {
        question: 'Will my students receive feedback as they work through the AP Writing Practice activity packs?',
        answer: "<p>Yes! In each recommended practice activity, Quill provides students with immediate feedback on their writing that they can use to revise their responses up to 5 times. Through these rounds of feedback and revision, students improve the clarity and precision of their writing.</p>".html_safe
      },
      {
        question: 'Where can I track my students&apos; completion of and performance on the AP Writing Practice packs?',
        answer: "<p>Quill has a variety of reports to help you track your students&apos; performance and progress. In the <a href='https://support.quill.org/en/articles/1140159-how-does-the-activity-summary-work' rel='noopener noreferrer' target='_blank'>Activity Summary report</a>, you can quickly see which activities your students have completed, along with color-coded icons indicating their proficiency with each activity. Quill has several other reports as well. <a href='https://s3.amazonaws.com/quill-image-uploads/uploads/files/Quill_Reports_Cheat_Sheet_Updated04_08_20.pdf' rel='noopener noreferrer' target='_blank'>This Cheat Sheet</a> shows you which report to go to for particular information, and <a href='https://s3.amazonaws.com/quill-image-uploads/uploads/files/Getting_Started_-_Student_Data_Reports__Basic_.mp4' rel='noopener noreferrer' target='_blank'>this video</a> will walk you through interpreting and utilizing three of Quill&apos;s student data reports.</p>".html_safe
      },
      {
        question: 'How many AP Writing Practice packs should I assign to my students and how long will it take them to complete a pack?',
        answer:
          "<div>
            <p>You can assign all the recommended packs in one click, or you can pick and choose, revisiting the recommendations report to assign more packs as needed.</p>
            <p>As Quill was designed to be a supplementary tool with each activity taking approximately 10-15 minutes, students are ideally completing an activity at least 1-2 times per week (at most completing one activity per day). Since each AP recommended pack contains between 4 and 7 activities, teachers generally expect a recommended pack to be completed in 1-2 weeks. Of course, students may need more or less time depending on the amount of activities in the pack, their level of difficulty, and students&apos; level of proficiency.</p>
            <p><a href='https://support.quill.org/en/articles/1065187-can-i-assign-activities-in-a-specific-order' rel='noopener noreferrer' target='_blank'>This article</a> explains how you can use deadlines to help students pace themselves.</p>
          </div>".html_safe
      },
      {
        question: 'If my students have been using Quill for a while, will they encounter activities in the AP Writing Practice packs that they have completed before?',
        answer: "<p>The activities in the AP Writing Practice packs are curated from existing Quill activities. While your students may encounter an activity they have already completed, the AP Writing Practice packs have been customized to target the skills students need to write successfully at the AP level. Given the quantity and variety of activities available on Quill, chances are that the AP Writing Practice packs will include plenty of new activities, even for students who have been using Quill for a while.</p>".html_safe
      },
      {
        question: 'Can I assign my students practice beyond the recommended AP Writing Practice packs?',
        answer: "<p>Yes! Quill offers <a href='https://support.quill.org/en/articles/1327607-what-are-each-of-the-different-quill-tools' rel='noopener noreferrer' target='_blank'>5 different tools</a> with more than 700 writing, grammar, and proofreading activities designed to engage students in the writing process. <a href='https://support.quill.org/en/articles/1049944-how-do-i-assign-a-featured-activity-pack' rel='noopener noreferrer' target='_blank'>This article</a> will show you how to explore and assign Quill&apos;s featured activity packs, and <a href='https://support.quill.org/en/articles/1049954-how-do-i-create-and-assign-a-new-activity-pack' rel='noopener noreferrer' target='_blank'>this article</a> will show you how to create a custom activity pack.</p>".html_safe
      },
      {
        question: 'Do I need to create an account on Quill.org to assign the AP Writing Skills Survey?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>It is recommended that you and your students create free accounts on Quill.org. Creating an account will give you access to the Survey and its recommended practice. Creating an account also allows you to track your students&apos; progress and view data reports. You can create an account by visiting the <a href='https://www.quill.org/account/new' rel='noopener noreferrer' target='_blank'>Quill sign-up page</a>.</p>
            <p class='college-board-q-and-a-text'>If you do not want to create an account, you or your students can complete the Survey <a href='https://quill.org/diagnostic/#/play/diagnostic/-L_wPCxbrT6toCb1fnYR?anonymous=true' rel='noopener noreferrer' target='_blank'>here</a>. However, please note that if you do not create an account, your students&apos; performance on the Survey will not be saved or shared with you, and you will not have access to the recommended skills practice. You will also not be able to track student progress or view data reports.</p>
          </div>".html_safe
      },
      {
        question: 'What if I still have questions?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>We are here for you! The following resources are available:</p>
            <p class='college-board-q-and-a-text'><strong>Quill Instructional Coach:</strong> You can reach out directly to Sherry Lewkowicz, Quill&apos;s coach dedicated to supporting College Board teachers, at <a href='mailto:sherry@quill.org'>sherry@quill.org</a>. Be sure to mention the course(s) you teach.</p>
            <p class='college-board-q-and-a-text'><strong><a href='https://www.quill.org/teacher-center' rel='noopener noreferrer' target='_blank'>Teacher Center:</a></strong> The place to go for all things best practice and implementation!</p>
            <p class='college-board-q-and-a-text'><strong>Support:</strong> Having a technical issue? Email <a href='mailto:support@quill.org'>support@quill.org</a> or use the chat in the lower right corner of Quill to connect with a member of the Quill support team.</p>
            <p class='college-board-q-and-a-text'>AP® is a registered trademark of the College Board.</p>
          </div>".html_safe
      }
    ]
  end

  def preap_questions_and_answers
    [
      {
        question: 'What is Quill.org?',
        answer: "<p>Quill is a writing tool that provides over 600 writing, grammar, and proofreading activities designed to engage students in the writing process. Quill provides practice in many areas of sentence writing, from comma placement and subject-verb agreement to the use of conjunctions to convey complex relationships between ideas. In the Quill Connect tool, students practice writing different types of sentences using the evidence-based strategy of sentence combining. Students receive specific, targeted feedback on their writing that they can use to revise their work. Through these activities, students practice writing a variety of sophisticated sentences and practice conveying complex ideas in clear, succinct, and grammatically strong ways. Most activities are designed to be completed in 10-15 minutes so that you have the freedom to use them in the way that works best for your classroom.</p>".html_safe
      },
      {
        question: 'How is Quill.org used in Pre-AP English 1?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>As part of the customized Pre-AP + Quill Offering for English 1, there are two distinct skills surveys. Pre-AP Skills Survey 1 addresses the basics of sentence patterns, while Pre-AP Skills Survey 2 engages with tools for sentence expansion. The skills featured as part of each survey are derived directly from the elements of grammar called out by the Pre-AP English High School Course Framework.</p>
            <p class='college-board-q-and-a-text'>You can use these skills surveys during the course to assess your students&apos; needs and to generate a sequence of recommended activities that provides targeted writing practice on the skills addressed instructionally in the Learning Cycles. In each of these recommended practice activities, students receive immediate feedback on their writing that they can use to revise their responses up to five times. Through these rounds of feedback and revision, students practice key writing skills.</p>
            <p class='college-board-q-and-a-text'>In addition to the skills surveys and recommended practice activities, there are also sentence combining activities aligned to texts that are part of each unit&apos;s instructional materials. These activities provide additional opportunities for students to practice their writing in context, combining sentences with a variety of skills and approaches that explore key ideas and themes from these texts.</p>
            <p class='college-board-q-and-a-text'>In addition to the previously mentioned tools and resources, you will also see direct links to Quill.org activities throughout English 1 lessons where specific grammar skills are addressed. The links will take students to independent practice activities that align with the writing goals of that particular lesson.</p>
          </div>".html_safe
      },
      {
        question: 'How is Quill.org used in Pre-AP English 2?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>As part of the customized Pre-AP + Quill Offering for English 2, there are two distinct skills surveys. Pre-AP Skills Survey 1 addresses the basics of sentence patterns, while Pre-AP Skills Survey 2 engages with tools for sentence expansion. The skills featured as part of each survey are derived directly from the elements of grammar called out by the Pre-AP English High School Course Framework.</p>
            <p class='college-board-q-and-a-text'>You can use these skills surveys during the course to assess your students&apos; needs and to generate a sequence of recommended activities that provides targeted writing practice on the skills addressed instructionally in the Learning Cycles. In each of these recommended practice activities, students receive immediate feedback on their writing that they can use to revise their responses up to five times. Through these rounds of feedback and revision, students practice key writing skills.</p>
            <p class='college-board-q-and-a-text'>At this time, there are no sentence combining activities aligned to texts that are part of each unit&apos;s instructional materials in Pre-AP English 2.</p>
          </div>".html_safe
      },
      {
        question: 'Do I need to create an account on Quill.org?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>It is recommended that you and your students create free accounts on Quill.org. Creating an account will give you access to the two skills surveys and recommended practice; creating an account also allows you to track your students&apos; progress and view data reports. You can create an account by visiting the Quill <a href='https://www.quill.org/sign-up/teacher' rel='noopener noreferrer' target='_blank'>sign-up page</a>.</p>
            <p class='college-board-q-and-a-text'>If you do not want to create an account, the links provided throughout the English 1 lessons will allow you and your students to complete activities on Quill without Quill accounts.</p>
            <p class='college-board-q-and-a-text'>Please note that if you do not create an account, you will not be able to use the skills surveys, access the recommended skills practice, track student progress, or view data reports.</p>
          </div>".html_safe
      },
      {
        question: 'Is a writing skills survey different than a diagnostic?',
        answer: "<p>Quill&apos;s writing skills surveys can be used in lieu of Quill&apos;s general diagnostics. For example, an AP teacher would likely assign the AP Writing Skills Survey in lieu of the Advanced Diagnostic. Keep in mind, however, that teachers may want ELL students in Pre-AP, AP, or SpringBoard courses to begin with one of the ELL Diagnostics instead of a writing skills survey. <a href='https://support.quill.org/en/articles/2554430-what-are-the-differences-between-the-various-diagnostic-assessments' rel='noopener noreferrer' target='_blank'>This article explains the differences between Quill&apos;s various diagnostics and surveys in more depth</a>.</p>".html_safe
      },
      {
        question: 'How many activities are in each Pre-AP Writing Practice pack?',
        answer: "<p>Each Pre-AP recommended pack contains between 4 and 7 activities, each of which are designed to take between 10 and 15 minutes each. There are also additional practice packs for students who finish the Pre-AP recommended packs: same skills, new content. <a href='https://support.quill.org/en/articles/4579893-how-do-i-assign-additional-practice-packs-for-pre-ap-skills-surveys' rel='noopener noreferrer' target='_blank'>Learn how to find and assign those here.</a></p>".html_safe
      },
      {
        question: 'How many Pre-AP Writing Practice packs should I assign to my students and how long will it take them to complete a pack?',
        answer:
          "<div>
            <p>You can assign all the recommended packs in one click, or you can pick and choose, revisiting the recommendations report to assign more packs as needed.</p>
            <p>In general, we&apos;ve found that students make progress when they are completing 2-4 activities on Quill per week. Since each Pre-AP recommended pack contains between 4 and 7 activities, teachers generally expect a recommended pack to be completed in 1-2 weeks. Of course, students may need more or less time depending on the amount of activities in the pack, their level of difficulty, and students&apos; level of proficiency. </p>
            <p><a href='https://support.quill.org/en/articles/1065187-can-i-assign-activities-in-a-specific-order' rel='noopener noreferrer' target='_blank'>This article</a> explains how you can use deadlines to help students pace themselves. </p>
          </div>".html_safe
      },
      {
        question: "Where can I track my students' completion of and performance on Quill activities?",
        answer: "<p>Quill has a variety of reports to help you track your students&apos; performance and progress. In the <a href='https://support.quill.org/en/articles/1140159-how-does-the-activity-summary-work' rel='noopener noreferrer' target='_blank'>Activity Summary report</a>, you can quickly see which activities your students have completed, along with color-coded icons indicating proficiency. Quill has several other reports as well. <a href='http://s3.amazonaws.com/quill-image-uploads/uploads/files/Quill_Reports_Cheat_Sheet_Updated04_08_20.pdf' rel='noopener noreferrer' target='_blank'>This cheat sheet</a> shows you which report to go to for particular information, and <a href='http://s3.amazonaws.com/quill-image-uploads/uploads/files/Getting_Started_-_Student_Data_Reports__Basic_.mp4' rel='noopener noreferrer' target='_blank'>this video will walk you through 3 of Quill&apos;s student data reports</a>.</p>".html_safe
      },
      {
        question: 'What tools does Quill.org offer?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>If you create a free account on Quill.org, you will be able to assign additional activities from any of Quill&apos;s 5 tools:</p>
            <ul>
              <li>
                <p>Quill Connect</p>
                <p class='college-board-q-and-a-text'>Students combine multiple ideas into a single sentence using the evidence-based strategy of sentence combining. Students receive instant feedback. *Note*: All activities recommended based on survey results are in Quill Connect.</p>
              </li>
              <li>
                <p>Quill Grammar</p>
                <p class='college-board-q-and-a-text'>Students practice basic grammar skills, from using correct capitalization to correcting commonly confused words.</p>
              </li>
              <li>
                <p>Quill Proofreader</p>
                <p class='college-board-q-and-a-text'>Students practice editing skills by correcting errors in passages. Students receive personalized follow-up activities based on their results.</p>
              </li>
              <li>
                <p>Quill Lessons</p>
                <p class='college-board-q-and-a-text'>Teachers lead whole-class writing instruction. Teachers control interactive slides that contain a mini-lesson and guided practice. Teachers can model writing strategies in real-time, present prompts to which students can respond, and then anonymously display student responses for discussion. Each Quill Lessons activity provides a lesson plan, writing prompts, discussion topics, and a follow-up independent practice activity. Teachers can also customize any lesson.</p>
              </li>
              <li>
                <p>Quill Diagnostic</p>
                <p class='college-board-q-and-a-text'>Students complete an activity designed to help teachers determine which skills students need to work on. After students complete a Quill Diagnostic activity, Quill recommends writing activities for students based on their results. <strong>Note</strong>: The writing skills surveys can be used in lieu of general Quill diagnostics.</p>
              </li>
            </ul>
          </div>".html_safe
      },
      {
        question: 'I see there are passage-aligned activities for Pre-AP English I. Are there passage-aligned activities for other Pre-AP courses?',
        answer: "<p>Unfortunately, at this time, there are no sentence combining activities aligned to texts in Pre-AP courses other than English I. If you would like to see activities like these for another course, please us know <a href='https://quillorg.canny.io/content-feedback' rel='noopener noreferrer' target='_blank'>here</a>!</p>".html_safe
      },
      {
        question: 'What if I still have questions?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>We are here for you! The following resources are available:</p>
            <p class='college-board-q-and-a-text'><strong>Quill Instructional Coach:</strong> You can reach out directly to Sherry Lewkowicz, Quill&apos;s coach dedicated to supporting College Board teachers, at <a href='mailto:sherry@quill.org'>sherry@quill.org</a>. Be sure to mention the course(s) you teach.</p>
            <p class='college-board-q-and-a-text'><strong><a href='https://www.quill.org/teacher-center' rel='noopener noreferrer' target='_blank'>Teacher Center:</a></strong> The place to go for all things best practice and implementation!</p>
            <p class='college-board-q-and-a-text'><strong>Support:</strong> Having a technical issue? Email <a href='mailto:support@quill.org'>support@quill.org</a> or use the chat in the lower right corner of Quill to connect with a member of the Quill support team.</p>
          </div>".html_safe
      }
    ]
  end

  def springboard_questions_and_answers
    [
      {
        question: 'What is Quill.org?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>Quill is a writing tool that provides over 600 writing, grammar, and proofreading activities designed to engage students in the writing process. Quill provides practice in many areas of sentence writing, from comma placement and subject-verb agreement to the use of conjunctions to convey complex relationships between ideas. In the Quill Connect tool, students practice writing different types of sentences using the evidence-based strategy of sentence combining. Students receive specific, targeted feedback on their writing that they can use to revise their work. Through these activities, students practice writing a variety of sophisticated sentences and practice conveying complex ideas in clear, succinct, and grammatically strong ways. Most activities are designed to be completed in 10-15 minutes so that you have the freedom to use them in the way that works best for your classroom.</p>
            <p class='college-board-q-and-a-text'>As part of the customized offering for SpringBoard, there are a variety of writing skills surveys to be used, depending on the context of your classes and students. The skills featured as part of each survey are derived directly from the elements of grammar called out by course texts and frameworks.</p>
            <p class='college-board-q-and-a-text'>You can use these skills surveys during the course to assess your students&apos; needs and to generate a sequence of recommended activities that provides targeted writing practice on the skills addressed instructionally. In each of these recommended practice activities, students receive immediate feedback on their writing that they can use to revise their responses up to five times. Through these rounds of feedback and revision, students practice key writing skills.</p>
            <p class='college-board-q-and-a-text'>In addition to the skills surveys and recommended practice activities, there are also sentence combining activities aligned to texts that appear in the instructional materials of both the Pre-AP English I course Grade 9 SpringBoard English Language Arts: English I. These activities provide additional opportunities for students to practice their writing in context, combining sentences with a variety of skills and approaches that explore key ideas and themes from these texts.</p>
          </div>".html_safe
      },
      {
        question: 'How do teachers typically incorporate Quill into their SpringBoard ELA courses?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>Teachers generally begin by having students complete a writing skills survey during class time. The practice that is recommended once students complete a survey can be completed by students independently and at their own pace, or can also be completed during class time. Some teachers ask students to complete recommended activities during a “Do Now,” during another portion of class time, or as homework. Since SpringBoard&apos;s Language and Writer&apos;s Craft elements of activities feature focused practice on specific grammatical skills, you may also find that there are <a href='https://www.quill.org/tools/lessons' rel='noopener noreferrer' target='_blank'>Quill Lessons</a> (Quill&apos;s whole-class instructional tool) that can support your instruction.</p>
            <p class='college-board-q-and-a-text'>Of course, this customized offering for SpringBoard has been designed to empower you to make the best decisions for your classroom and your students. Knowledge of your students&apos; needs will assist you in making appropriate decisions.</p>
          </div>".html_safe
      },
      {
        question: 'Do I need to create an account on Quill.org?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>It is recommended that you and your students create free accounts on Quill.org. Creating an account will give you access to the two skills surveys and recommended practice; creating an account also allows you to track your students&apos; progress and view data reports. You can create an account by visiting the Quill <a href='https://www.quill.org/sign-up/teacher' rel='noopener noreferrer' target='_blank'>sign-up page</a>.</p>
            <p class='college-board-q-and-a-text'>Please note that if you do not create an account, you will not be able to use the skills surveys, access the recommended skills practice, track student progress, or view data reports.</p>
          </div>".html_safe
      },
      {
        question: 'Is a writing skills survey different than a diagnostic?',
        answer: "<p class='college-board-q-and-a-text'>Quill&apos;s writing skills surveys can be used in lieu of Quill&apos;s general diagnostics. For example, a 7th grade SpringBoard ELA teacher would likely assign the SpringBoard Writing Skills Survey in lieu of the Starter or Intermediate Diagnostic. Keep in mind, however, that teachers may want ELL students in Pre-AP, AP, or SpringBoard classes to begin with one of the ELL Diagnostics instead of a writing skills survey. <a href='https://support.quill.org/en/articles/2554430-what-are-the-differences-between-the-various-diagnostic-assessments' rel='noopener noreferrer' target='_blank'>This article explains the differences between Quill&apos;s various diagnostics and surveys in more depth</a>.</p>".html_safe
      },
      {
        question: 'How many activities are in a skills survey recommended pack?',
        answer: "<p class='college-board-q-and-a-text'>Most recommended packs contain between 4 and 7 activities, each of which are designed to take between 10 and 15 minutes.</p>".html_safe
      },
      {
        question: 'How many recommended packs should I assign to my students and how long will it take them to complete a pack?',
        answer:
          "<div>
            <p>You can assign all the recommended packs in one click, or you can pick and choose, revisiting the recommendations report to assign more packs as needed.</p>
            <p class='college-board-q-and-a-text'>In general, we&apos;ve found that students make progress when they are completing 2-4 activities on Quill per week. Since each recommended pack contains between 4 and 7 activities, teachers generally expect a recommended pack to be completed in 1-2 weeks. Of course, students may need more or less time depending on the amount of activities in the pack, their level of difficulty, and students&apos; level of proficiency.</p>
            <p class='college-board-q-and-a-text'><a href='https://support.quill.org/en/articles/1065187-how-can-i-assign-activities-in-a-specific-order' rel='noopener noreferrer' target='_blank'>This article explains how you can use deadlines to help students pace themselves</a>.</p>
          </div>".html_safe
      },
      {
        question: "Where can I track my students' completion of and performance on Quill activities?",
        answer: "<p class='college-board-q-and-a-text'>Quill has a variety of reports to help you track your students&apos; performance and progress. In the <a href='https://support.quill.org/en/articles/1140159-how-does-the-activity-summary-work' rel='noopener noreferrer' target='_blank'>Activity Summary report</a>, you can quickly see which activities your students have completed, along with color-coded icons indicating proficiency. Quill has several other reports as well. <a href='http://s3.amazonaws.com/quill-image-uploads/uploads/files/Quill_Reports_Cheat_Sheet_Updated04_08_20.pdf' rel='noopener noreferrer' target='_blank'>This cheat sheet</a> shows you which report to go to for particular information, and <a href='http://s3.amazonaws.com/quill-image-uploads/uploads/files/Getting_Started_-_Student_Data_Reports__Basic_.mp4' rel='noopener noreferrer' target='_blank'>this video will walk you through 3 of Quill&apos;s student data reports</a>.</p>".html_safe
      },
      {
        question: 'What tools does Quill.org offer?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>If you create a free account on Quill.org, you will be able to assign additional activities from any of Quill&apos;s 5 tools:</p>
            <ul>
              <li>
                <p>Quill Connect</p>
                <p class='college-board-q-and-a-text'>Students combine multiple ideas into a single sentence using the evidence-based strategy of sentence combining. Students receive instant feedback. *Note*: All activities recommended based on survey results are in Quill Connect.</p>
              </li>
              <li>
                <p>Quill Grammar</p>
                <p class='college-board-q-and-a-text'>Students practice basic grammar skills, from using correct capitalization to correcting commonly confused words.</p>
              </li>
              <li>
                <p>Quill Proofreader</p>
                <p class='college-board-q-and-a-text'>Students practice editing skills by correcting errors in passages. Students receive personalized follow-up activities based on their results.</p>
              </li>
              <li>
                <p>Quill Lessons</p>
                <p class='college-board-q-and-a-text'>Teachers lead whole-class writing instruction. Teachers control interactive slides that contain a mini-lesson and guided practice. Teachers can model writing strategies in real-time, present prompts to which students can respond, and then anonymously display student responses for discussion. Each Quill Lessons activity provides a lesson plan, writing prompts, discussion topics, and a follow-up independent practice activity. Teachers can also customize any lesson.</p>
              </li>
              <li>
                <p>Quill Diagnostic</p>
                <p class='college-board-q-and-a-text'>Students complete an activity designed to help teachers determine which skills students need to work on. After students complete a Quill Diagnostic activity, Quill recommends writing activities for students based on their results. <strong>Note</strong>: The writing skills surveys can be used in lieu of general Quill diagnostics.</p>
              </li>
            </ul>
          </div>".html_safe
      },
      {
        question: 'I see there are passage-aligned activities for SpringBoard ELA English I. Are there passage-aligned activities for other SpringBoard ELA courses?',
        answer: "<p>Unfortunately, at this time, there are no sentence combining activities aligned to texts in SpringBoard ELA courses other than SpringBoard ELA Grade 9. If you would like to see activities like these for another course, please us know <a href='https://quillorg.canny.io/content-feedback' rel='noopener noreferrer' target='_blank'>here</a>!</p>".html_safe
      },
      {
        question: 'What if I still have questions?',
        answer:
          "<div>
            <p class='college-board-q-and-a-text'>We are here for you! The following resources are available:</p>
            <p class='college-board-q-and-a-text'><strong>Quill Instructional Coach:</strong> You can reach out directly to Sherry Lewkowicz, Quill&apos;s coach dedicated to supporting College Board teachers, at <a href='mailto:sherry@quill.org'>sherry@quill.org</a>. Be sure to mention the course(s) you teach.</p>
            <p class='college-board-q-and-a-text'><strong><a href='https://www.quill.org/teacher-center' rel='noopener noreferrer' target='_blank'>Teacher Center:</a></strong> The place to go for all things best practice and implementation!</p>
            <p class='college-board-q-and-a-text'><strong>Support:</strong> Having a technical issue? Email <a href='mailto:support@quill.org'>support@quill.org</a> or use the chat in the lower right corner of Quill to connect with a member of the Quill support team.</p>
            <p class='college-board-q-and-a-text'>AP® is a registered trademark of the College Board.</p>
          </div>".html_safe
      }
    ]
  end
end

