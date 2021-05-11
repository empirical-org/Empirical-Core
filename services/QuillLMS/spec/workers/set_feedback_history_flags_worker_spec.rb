require 'rails_helper'

describe SetFeedbackHistoryFlagsWorker, type: :worker do
  let(:session_uid) { SecureRandom.uuid }
  let(:worker) { described_class.new }
  let(:feedback_history) { create(:feedback_history, feedback_session_uid: session_uid, attempt: 3) }

  it 'should create a consecutive repeating flag if the immediately previous attempt violated the same rule' do
    create(:feedback_history, feedback_session_uid: session_uid, rule_uid: feedback_history.rule_uid, prompt_id: feedback_history.prompt_id, attempt: 2)
    worker.perform(feedback_history.id)
    feedback_history.reload
    expect(feedback_history.feedback_history_flags.count).to eq(1)
  end

  it 'should create a non-consecutive repeating flag if a non-immediate previous attempt violated the same rule' do
    create(:feedback_history, feedback_session_uid: session_uid, rule_uid: feedback_history.rule_uid, prompt_id: feedback_history.prompt_id, attempt: 1)
    worker.perform(feedback_history.id)
    feedback_history.reload
    expect(feedback_history.feedback_history_flags.count).to eq(1)
  end

  it 'should create no flags if a later item has a the same rule violation' do
    create(:feedback_history, feedback_session_uid: session_uid, rule_uid: feedback_history.rule_uid, prompt_id: feedback_history.prompt_id, attempt: 4)
    worker.perform(feedback_history.id)
    feedback_history.reload
    expect(feedback_history.feedback_history_flags.count).to eq(0)
  end

  it 'should create no flags if there is not earlier history violating the same rule' do
    worker.perform(feedback_history.id)
    feedback_history.reload
    expect(feedback_history.feedback_history_flags.count).to eq(0)
  end
end
