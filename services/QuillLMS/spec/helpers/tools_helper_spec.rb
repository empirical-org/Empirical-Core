# frozen_string_literal: true

require 'rails_helper'

describe ToolsHelper do
  describe '#tools_tabs' do
    let(:large_tabs) {
      [
        {
          name: ToolsHelper::QUILL_CONNECT,
          url: '/tools/connect',
          id: ToolsHelper::QUILL_CONNECT
        },
        {
          name: ToolsHelper::QUILL_LESSONS,
          url: '/tools/lessons',
          id: ToolsHelper::QUILL_LESSONS
        },
        {
          name: ToolsHelper::QUILL_DIAGNOSTIC,
          url: '/tools/diagnostic',
          id: ToolsHelper::QUILL_DIAGNOSTIC
        },
        {
          name: ToolsHelper::QUILL_PROOFREADER,
          url: '/tools/proofreader',
          id: ToolsHelper::QUILL_PROOFREADER
        },
        {
          name: ToolsHelper::QUILL_GRAMMAR,
          url: '/tools/grammar',
          id: ToolsHelper::QUILL_GRAMMAR
        },
        {
          name: ToolsHelper::QUILL_EVIDENCE,
          url: '/tools/evidence',
          id: ToolsHelper::QUILL_EVIDENCE
        },
      ]
    }
    let(:small_tabs)  {
      [
        {
          name: 'Connect',
          url: '/tools/connect',
          id: ToolsHelper::QUILL_CONNECT
        },
        {
          name: 'Lessons',
          url: '/tools/lessons',
          id: ToolsHelper::QUILL_LESSONS
        },
        {
          name: 'Diagnostic',
          url: '/tools/diagnostic',
          id: ToolsHelper::QUILL_DIAGNOSTIC
        },
        {
          name: 'Proofreader',
          url: '/tools/proofreader',
          id: ToolsHelper::QUILL_PROOFREADER
        },
        {
          name: 'Grammar',
          url: '/tools/grammar',
          id: ToolsHelper::QUILL_GRAMMAR
        },
        {
          name: 'Evidence',
          url: '/tools/evidence',
          id: ToolsHelper::QUILL_EVIDENCE
        },
      ]
    }

    it 'should return the large tabs when large is true' do
      expect(helper.tools_tabs(large: true)).to eq large_tabs
    end

    it 'should return the small tabs when large is false' do
      expect(helper.tools_tabs(large: false)).to eq small_tabs
    end
  end
end
