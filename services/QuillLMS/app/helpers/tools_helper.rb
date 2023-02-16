# frozen_string_literal: true

module ToolsHelper
  QUILL_CONNECT = 'Quill Connect'
  QUILL_LESSONS = 'Quill Lessons'
  QUILL_DIAGNOSTIC = 'Quill Diagnostic'
  QUILL_PROOFREADER = 'Quill Proofreader'
  QUILL_GRAMMAR = 'Quill Grammar'
  QUILL_EVIDENCE = 'Quill Reading for Evidence'

  def tools_tabs(large: true)
    [
      {
        name: large ? QUILL_CONNECT : 'Connect',
        url: '/tools/connect',
        id: QUILL_CONNECT
      },
      {
        name: large ? QUILL_LESSONS : 'Lessons',
        url: '/tools/lessons',
        id: QUILL_LESSONS
      },
      {
        name: large ? QUILL_DIAGNOSTIC : 'Diagnostic',
        url: '/tools/diagnostic',
        id: QUILL_DIAGNOSTIC
      },
      {
        name: large ? QUILL_PROOFREADER : 'Proofreader',
        url: '/tools/proofreader',
        id: QUILL_PROOFREADER
      },
      {
        name: large ? QUILL_GRAMMAR : 'Grammar',
        url: '/tools/grammar',
        id: QUILL_GRAMMAR
      },
      {
        name: large ? QUILL_EVIDENCE : 'Evidence',
        url: '/tools/evidence',
        id: QUILL_EVIDENCE
      }
    ]
  end
end

def evidence_text_helper
  {
    header_text: {
      first_line: "<p>Provide your students with nonfiction texts paired with AI-powered writing prompts, instead of multiple-choice questions, to enable deeper thinking. Students read a nonfiction text and build their comprehension through writing prompts, supporting a series of claims with evidence sourced from the text. Quill challenges students to write responses that are precise, logical, and based on textual evidence, with Quill coaching the student through custom, targeted feedback on each revision so that students strengthen their reading comprehension and hone their writing skills.</p><br/><br/>".html_safe,
      second_line: "<p>Designed for 8th-12th grade students, each activity takes 15-20 minutes to complete. Quill is developing activities for ELA, social studies, and science classrooms, with a particular focus on texts that examine 21st-century issues.</p>".html_safe,
      small: "<p>Quill provides free writing and grammar activities for elementary, middle, and high school students.</p>".html_safe
    },
    first_attempt: {
      large: "<p>Quill&apos;s feedback bot provides custom feedback for every response that mirrors the feedback a teacher would provide to a student in a 1:1 context. </p> <p>In this response, it&apos;s true that seaweed benefits cows by reducing their methane emissions, but the student has not specified *why* seaweed is beneficial. Quill asks the student to go back to the text and examine it more carefully to provide a reason why seaweed benefits cows and the environment. Students must use precise evidence in their response to be able to successfully complete it.</p>".html_safe,
      small: "<p>This response uses the wrong type of evidence to demonstrate a relationship of contrast. The feedback and mini lesson explain how to use because to show a relationship of causation between two ideas.</p>".html_safe
    },
    second_attempt: {
      large: "<p>The student identified that methane is harmful to the environment but did not support their response with a key statistic from the text. Quill encourages them to be as specific as possible to stregthen their response and more accurately respond to the claim.</p>".html_safe,
      small: "<p>The student identified that methane is harmful to the environment but did not support their response with a key statistic from the text. Quill encourages them to be as specific as possible.</p>".html_safe
    },
    third_attempt: {
      large: "<p>The student strengthened their evidence by adding a precise statistic from the text that explains how significantly seaweed impacts methane. Since the key ideas are in place, Quill now provides a mini-lesson on the grammar errors in their response. Quill only provides grammar and spelling feedback once the student has written a strong response with the key ideas from the text.</p>".html_safe,
      small: "<p>The student strengthened their evidence by adding a precise statistic from the text that explains how significantly seaweed impacts methane.</p>".html_safe,
    },
    fourth_attempt: {
      large: "<p>At this point the student has now written a precise, textually-supported sentence. Students often come into the tool writing vague or inaccurate statements, and through multiple rounds of practice, feedback, and revision, students gain the ability to utilize precise evidence in their responses.</p>".html_safe,
      small: "<p>The student wrote a precise, textually-supported sentence. Quill provides additional feedback to reinforce what they learned.</p>".html_safe
    }
  }
end
