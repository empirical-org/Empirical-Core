require 'rails_helper'

# it { shoulda cheatsheet: https://github.com/thoughtbot/it { shoulda-matchers#activemodel-matchers
RSpec.describe SessionFeedbackHistory, type: :model do
  setup do
    @activity1 = Comprehension::Activity.create!()
    @activity2 = Comprehension::Activity.create!()
    @because_prompt1 = Comprehension::Prompt.create!(activity: @activity1)
    @because_prompt2 = Comprehension::Prompt.create!(activity: @activity2)
    @but_prompt1 = Comprehension::Prompt.create!(activity: @activity1)
    @but_prompt2 = Comprehension::Prompt.create!(activity: @activity2)
    @so_prompt1 = Comprehension::Prompt.create!(activity: @activity1)
    @so_prompt2 = Comprehension::Prompt.create!(activity: @activity2)

    session1_uid = SecureRandom.uuid
    session2_uid = SecureRandom.uuid

    create(:feedback_history, activity_session_uid: session1_uid, prompt_id: @because_prompt1.id, optimal: false)
    create(:feedback_history, activity_session_uid: session1_uid, prompt_id: @because_prompt1.id, attempt: 2, optimal: true)
    create(:feedback_history, activity_session_uid: session1_uid, prompt_id: @but_prompt1.id, optimal: true)
    create(:feedback_history, activity_session_uid: session1_uid, prompt_id: @so_prompt1.id, optimal: false)
    create(:feedback_history, activity_session_uid: session1_uid, prompt_id: @so_prompt1.id, attempt: 2, optimal: false)
    create(:feedback_history, activity_session_uid: session1_uid, prompt_id: @so_prompt1.id, attempt: 3, optimal: true)
    create(:feedback_history, activity_session_uid: session2_uid, prompt_id: @because_prompt2.id, optimal: false)
    create(:feedback_history, activity_session_uid: session2_uid, prompt_id: @because_prompt2.id, attempt: 2, optimal: false)
  end

  context '#list_by_activity_session' do
    it 'should identify two records when there are two unique activity_session_uids' do
      assert_equal SessionFeedbackHistory.list_by_activity_session.count, 2
    end
  end

end

