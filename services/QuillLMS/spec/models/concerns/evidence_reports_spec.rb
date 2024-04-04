# frozen_string_literal: true

require 'rails_helper'

describe EvidenceReports, type: :model do
  before do
    class FakeReports
      include EvidenceReports
    end
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
    let!(:activity_session) { create(:activity_session) }
    let(:prompt_text) { "Correct prompt text" }
    let(:attempt_number) { FakeReports::EVIDENCE_FINAL_ATTEMPT_NUMBER }
    let(:prompt) { create(:evidence_prompt, text: prompt_text) }
    let!(:evidence_child_activity) { create(:evidence_activity, parent_activity_id: activity_session.activity.id, prompts: [prompt]) }
    let!(:feedback_history_for_prompt) { create(:feedback_history, prompt:, attempt: attempt_number, feedback_text: "Specific feedback") }

    before do
      allow(activity_session).to receive(:feedback_histories).and_return([feedback_history_for_prompt])
    end

    it 'returns the correct feedback history based on prompt text and attempt number' do
      result = FakeReports.new.get_feedback_history_from_activity_session_prompt_text_and_attempt_number(activity_session, prompt_text, attempt_number)
      expect(result).to eq(feedback_history_for_prompt)
    end

    it 'returns nil if the prompt text does not match any feedback histories' do
      result = FakeReports.new.get_feedback_history_from_activity_session_prompt_text_and_attempt_number(activity_session, "Nonexistent prompt text", attempt_number)
      expect(result).to be_nil
    end

    it 'returns nil if the attempt number does not match any feedback histories for the prompt' do
      result = FakeReports.new.get_feedback_history_from_activity_session_prompt_text_and_attempt_number(activity_session, prompt_text, 3)
      expect(result).to be_nil
    end

    it 'returns nil if feedback histories are empty' do
      empty_activity_session = create(:activity_session) # This session has no feedback_histories
      result = FakeReports.new.get_feedback_history_from_activity_session_prompt_text_and_attempt_number(empty_activity_session, prompt_text, attempt_number)
      expect(result).to be_nil
    end

    it 'returns nil if prompt text is blank' do
      result = FakeReports.new.get_feedback_history_from_activity_session_prompt_text_and_attempt_number(activity_session, "", attempt_number)
      expect(result).to be_nil
    end

    it 'returns nil if attempt number is blank' do
      result = FakeReports.new.get_feedback_history_from_activity_session_prompt_text_and_attempt_number(activity_session, prompt_text, "")
      expect(result).to be_nil
    end
  end

  describe 'get_feedback_from_feedback_history' do
    let(:instance) { FakeReports.new }
    let!(:activity_session) { create(:activity_session) }
    let(:prompt_text) { "Correct prompt text" }
    let(:wrong_prompt_text) { "Wrong prompt text" }
    let(:attempt_number) { FakeReports::EVIDENCE_FINAL_ATTEMPT_NUMBER }
    let(:prompt) { create(:evidence_prompt, text: prompt_text) }
    let!(:evidence_child_activity) { create(:evidence_activity, parent_activity_id: activity_session.activity.id, prompts: [prompt]) }
    let(:feedback_text) { "Specific feedback" }
    let!(:feedback_history_for_prompt) { create(:feedback_history, prompt:, attempt: attempt_number, feedback_text: feedback_text) }

    it 'returns feedback text if feedback history is found' do
      allow(instance).to receive(:get_feedback_history_from_activity_session_prompt_text_and_attempt_number)
                         .with(activity_session, prompt_text, attempt_number)
                         .and_return(feedback_history_for_prompt)

      expect(instance.get_feedback_from_feedback_history(activity_session, prompt_text, attempt_number)).to eq(feedback_text)
    end

    it 'returns nil if feedback history is not found' do
      allow(instance).to receive(:get_feedback_history_from_activity_session_prompt_text_and_attempt_number)
                         .with(activity_session, wrong_prompt_text, attempt_number)
                         .and_return(nil)

      expect(instance.get_feedback_from_feedback_history(activity_session, wrong_prompt_text, attempt_number)).to eq(nil)
    end

  end

  describe '#format_max_attempts_feedback' do
    let(:instance) { FakeReports.new }
    let(:html_feedback) { "<p>You completed five revisions!</p><br/><p>Your response was missing key details. Here are some strong responses:</p>" }
    let(:text_with_punctuation) { "This is a test!Please note,there are errors;However,it works." }
    let(:text_without_split) { "You completed five revisions! Your response was strong." }
    let(:plain_text_feedback) { "This is a plain text feedback without HTML." }

    it 'correctly processes HTML feedback and stops before the split text' do
      result = instance.format_max_attempts_feedback(html_feedback)
      expect(result).to eq("You completed five revisions! Your response was missing key details.")
    end

    it 'ensures punctuation is followed by a space' do
      result = instance.format_max_attempts_feedback(text_with_punctuation)
      expect(result).to eq("This is a test! Please note, there are errors; However, it works.")
    end

    it 'returns the full text if the split text does not appear' do
      result = instance.format_max_attempts_feedback(text_without_split)
      expect(result).to eq(text_without_split)
    end

    it 'returns nil if the feedback is nil' do
      result = instance.format_max_attempts_feedback(nil)
      expect(result).to be_nil
    end

    it 'processes plain text feedback without HTML' do
      result = instance.format_max_attempts_feedback(plain_text_feedback)
      expect(result).to eq(plain_text_feedback)
    end
  end

  describe '#get_suboptimal_final_attempt_evidence_feedback_from_activity_session_and_prompt_text' do
    let(:instance) { FakeReports.new }
    let(:activity_session) { double("ActivitySession") }
    let(:prompt_text) { "Correct prompt text" }
    let(:feedback_history) { double("FeedbackHistory") }
    let(:prompt) { double("Prompt", max_attempts_feedback: "<p>Some detailed feedback.</p>") }

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
        allow(feedback_history).to receive(:feedback_type).and_return(FeedbackHistory::GRAMMAR)
      end

      it 'returns spelling or grammar feedback' do
        result = instance.get_suboptimal_final_attempt_evidence_feedback_from_activity_session_and_prompt_text(activity_session, prompt_text)
        expect(result).to eq(FakeReports::EVIDENCE_SUBOPTIMAL_SPELLING_OR_GRAMMAR_FINAL_ATTEMPT_FEEDBACK)
      end
    end

    context 'when feedback history type is not specified and max attempts feedback is present' do
      before do
        allow(feedback_history).to receive(:feedback_type).and_return(nil)
        allow(instance).to receive(:format_max_attempts_feedback).with(prompt.max_attempts_feedback).and_return("Some detailed feedback.")
      end

      it 'returns formatted max attempts feedback' do
        result = instance.get_suboptimal_final_attempt_evidence_feedback_from_activity_session_and_prompt_text(activity_session, prompt_text)
        expect(result).to eq("Some detailed feedback.")
      end
    end

    context 'when feedback history type is not specified and no max attempts feedback is present' do
      before do
        allow(feedback_history).to receive(:feedback_type).and_return(nil)
        allow(prompt).to receive(:max_attempts_feedback).and_return(nil)
      end

      it 'returns default suboptimal final attempt feedback' do
        result = instance.get_suboptimal_final_attempt_evidence_feedback_from_activity_session_and_prompt_text(activity_session, prompt_text)
        expect(result).to eq(FakeReports::EVIDENCE_SUBOPTIMAL_FINAL_ATTEMPT_FEEDBACK)
      end
    end
  end

end
