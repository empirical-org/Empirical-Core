namespace :add_spelling_api_rule_and_feedback do
  task :run => :environment do
    ActiveRecord::Base.transaction do
      rule = Comprehension::Rule.create!(
        uid: '7deb9bfc-4f4d-433f-a366-caf810849a32',
        name: 'Spelling',
        description: 'Try again. There may be a spelling mistake.',
        optimal: false,
        universal: true,
        rule_type: Comprehension::Rule::TYPE_SPELLING,
        suborder: 1,
        state: 'active'
      )
      Comprehension::Feedback.create!(
        rule: rule,
        text: 'Try again. There may be a spelling mistake.',
        order: 1
      )
      FeedbackHistory.where(feedback_type: FeedbackHistory::SPELLING).update_all(rule_uid: rule.uid)
    end
  end
end
