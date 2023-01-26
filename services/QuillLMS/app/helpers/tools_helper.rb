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
