# frozen_string_literal: true

require 'rails_helper'

describe EvidenceReports, type: :model do
  before do
    fake_reports_class = Class.new do
      include EvidenceReports
    end

    stub_const('FakeReports', fake_reports_class)
  end

  describe '#get_evidence_prompt_from_activity_and_prompt_text' do

    let(:activity_session) { create(:activity_session) }
    let(:prompt_text) { "Prompt text "}
    let(:prompt) { create(:evidence_prompt, text: prompt_text) }
    let!(:evidence_child_activity) { create(:evidence_activity, parent_activity_id: activity_session.activity.id, prompts: [prompt]) }

    it 'should return the prompt if one is found' do
      expect(FakeReports.new.get_evidence_prompt_from_activity_and_prompt_text(activity_session, prompt_text)).to eq(prompt)
    end

    it 'should return nil if no prompt is found' do
      expect(FakeReports.new.get_evidence_prompt_from_activity_and_prompt_text(activity_session, "not prompt text")).to eq(nil)
    end

  end

  describe '#get_feedback_history_from_activity_session_prompt_text_and_attempt_number' do
    subject {
      FakeReports.new.get_feedback_history_from_activity_session_prompt_text_and_attempt_number(activity_session, prompt_text, attempt_number)
    }

    let!(:activity_session_with_feedback_histories) { create(:activity_session) }
    let(:activity_session) { activity_session_with_feedback_histories}
    let(:correct_prompt_text) { "Correct prompt text" }
    let(:prompt_text) { correct_prompt_text }
    let(:final_attempt_number) { FakeReports::EVIDENCE_FINAL_ATTEMPT_NUMBER }
    let(:attempt_number) { final_attempt_number }
    let(:prompt) { create(:evidence_prompt, text: correct_prompt_text) }
    let!(:evidence_child_activity) { create(:evidence_activity, parent_activity_id: activity_session.activity.id, prompts: [prompt]) }
    let(:feedback_history_for_prompt) { create(:feedback_history, prompt:, attempt: final_attempt_number, feedback_text: "Specific feedback") }

    before do
      allow(activity_session_with_feedback_histories).to receive(:feedback_histories).and_return([feedback_history_for_prompt])
    end

    context 'returns the correct feedback history based on prompt text and attempt number' do
      it { is_expected.to eq(feedback_history_for_prompt) }
    end

    context 'returns nil if the prompt text does not match any feedback histories' do
      let(:prompt_text) { "Nonexistent prompt text" }

      it { is_expected.to eq(nil) }
    end

    context 'returns nil if the attempt number does not match any feedback histories for the prompt' do
      let(:attempt_number) { 3 }

      it { is_expected.to eq(nil) }
    end

    context 'returns nil if feedback histories are empty' do
      let(:activity_session) { create(:activity_session) }

      it { is_expected.to eq(nil) }
    end

    context 'returns nil if prompt text is blank' do
      let(:prompt_text) { "" }

      it { is_expected.to eq(nil) }
    end

    context 'returns nil if attempt number is blank' do
      let(:attempt_number) { '' }

      it { is_expected.to eq(nil) }
    end
  end

  describe 'get_feedback_from_feedback_history' do
    let(:instance) { FakeReports.new }
    let!(:activity_session) { create(:activity_session) }
    let(:correct_prompt_text) { "Correct prompt text" }
    let(:wrong_prompt_text) { "Wrong prompt text" }
    let(:attempt_number) { FakeReports::EVIDENCE_FINAL_ATTEMPT_NUMBER }
    let(:prompt) { create(:evidence_prompt, text: prompt_text) }
    let!(:evidence_child_activity) { create(:evidence_activity, parent_activity_id: activity_session.activity.id, prompts: [prompt]) }
    let(:feedback_text) { "Specific feedback" }
    let!(:feedback_history_for_prompt) { create(:feedback_history, prompt:, attempt: attempt_number, feedback_text: feedback_text) }

    subject {
      instance.get_feedback_from_feedback_history(activity_session, prompt_text, attempt_number)
    }

    context 'returns feedback text if feedback history is found' do
      before do
        allow(instance).to receive(:get_feedback_history_from_activity_session_prompt_text_and_attempt_number)
                           .with(activity_session, correct_prompt_text, attempt_number)
                           .and_return(feedback_history_for_prompt)
      end

      let(:prompt_text) { correct_prompt_text }

      it { is_expected.to eq(feedback_text) }
    end

    context 'returns nil if feedback history is not found' do
      before do
        allow(instance).to receive(:get_feedback_history_from_activity_session_prompt_text_and_attempt_number)
                           .with(activity_session, wrong_prompt_text, attempt_number)
                           .and_return(nil)
      end

      let(:prompt_text) { wrong_prompt_text }

      it { is_expected.to eq(nil) }
    end

  end

  describe '#format_max_attempts_feedback' do
    let(:instance) { FakeReports.new }
    let(:html_feedback) { "<p>You completed five revisions!</p><br/><p>Your response was missing key details. Here are some strong responses:</p>" }
    let(:text_with_punctuation) { "This is a test!Please note,there are errors;However,it works." }
    let(:text_without_split) { "You completed five revisions! Your response was strong." }
    let(:plain_text_feedback) { "This is a plain text feedback without HTML." }

    subject {
      instance.format_max_attempts_feedback(feedback)
    }

    context 'correctly processes HTML feedback and stops before the split text' do
      let(:feedback) { html_feedback }

      it { is_expected.to eq ("You completed five revisions! Your response was missing key details.") }
    end

    context 'ensures punctuation is followed by a space' do
      let(:feedback) { text_with_punctuation }

      it { is_expected.to eq ("This is a test! Please note, there are errors; However, it works.") }
    end

    context 'returns the full text if the split text does not appear' do
      let(:feedback) { text_without_split }

      it { is_expected.to eq (text_without_split) }
    end

    context 'returns nil if the feedback is nil' do
      let(:feedback) { nil }

      it { is_expected.to eq nil }
    end

    context 'processes plain text feedback without HTML' do
      let(:feedback) { plain_text_feedback }

      it { is_expected.to eq (plain_text_feedback) }
    end
  end

  describe '#get_suboptimal_final_attempt_evidence_feedback_from_activity_session_and_prompt_text' do
    let(:instance) { FakeReports.new }
    let(:activity_session) { double("ActivitySession") }
    let(:prompt_text) { "Correct prompt text" }
    let(:feedback_history) { double("FeedbackHistory") }
    let(:prompt) { double("Prompt", max_attempts_feedback: "<p>Some detailed feedback.</p>") }

    subject { instance.get_suboptimal_final_attempt_evidence_feedback_from_activity_session_and_prompt_text(activity_session, prompt_text) }

    before do
      allow(instance).to receive(:get_feedback_history_from_activity_session_prompt_text_and_attempt_number)
                         .with(activity_session, prompt_text, FakeReports::EVIDENCE_FINAL_ATTEMPT_NUMBER)
                         .and_return(feedback_history)
      allow(instance).to receive(:get_evidence_prompt_from_activity_and_prompt_text)
                         .with(activity_session, prompt_text)
                         .and_return(prompt)
    end

    context 'when feedback history type is GRAMMAR, RULES_BASED_THREE, or SPELLING' do
      before do
        allow(feedback_history).to receive(:spelling_or_grammar?).and_return(true)
      end

      it 'returns spelling or grammar feedback' do
        is_expected.to eq(FakeReports::EVIDENCE_SUBOPTIMAL_SPELLING_OR_GRAMMAR_FINAL_ATTEMPT_FEEDBACK)
      end
    end

    context 'when feedback history type is not specified and max attempts feedback is present' do
      before do
        allow(feedback_history).to receive(:spelling_or_grammar?).and_return(false)
        allow(instance).to receive(:format_max_attempts_feedback).with(prompt.max_attempts_feedback).and_return("Some detailed feedback.")
      end

      it 'returns formatted max attempts feedback' do
        is_expected.to eq("Some detailed feedback.")
      end
    end

    context 'when feedback history type is not specified and no max attempts feedback is present' do
      before do
        allow(feedback_history).to receive(:spelling_or_grammar?).and_return(false)
        allow(prompt).to receive(:max_attempts_feedback).and_return(nil)
      end

      it 'returns default suboptimal final attempt feedback' do
        is_expected.to eq(FakeReports::EVIDENCE_SUBOPTIMAL_FINAL_ATTEMPT_FEEDBACK)
      end
    end
  end

end
