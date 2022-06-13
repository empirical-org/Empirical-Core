# frozen_string_literal: true

namespace :data do
  desc 'Add prefilter rules and feedbacks'
  task :prefilter => :environment do |t, args|
    TOO_SHORT_FEEDBACK = "Whoops, it looks like you submitted your response before it was ready! Re-read what you wrote and finish the sentence provided."
    PROFANITY_FEEDBACK = "Revise your work. When writing your response, make sure to use appropriate language."
    MULTIPLE_SENTENCES_FEEDBACK = "Revise your work. Your response should be only one sentence long."
    QUESTION_MARK_FEEDBACK = "Revise your response. Instead of using a question mark, write a statement that ends with a period. Remember, anytime you do an activity like this one on Quill, you'll write statements instead of questions."

    prefilters = [
      { name: 'too short', feedback: TOO_SHORT_FEEDBACK },
      { name: 'profanity', feedback: PROFANITY_FEEDBACK },
      { name: 'multiple sentences', feedback: MULTIPLE_SENTENCES_FEEDBACK },
      { name: 'ends in a question mark', feedback: QUESTION_MARK_FEEDBACK }
    ]

    ActiveRecord::Base.transaction do
      Evidence::Rule.find_or_create_by!(
        name: 'prefilter - optimal',
        universal: true,
        rule_type: 'prefilter',
        optimal: true,
        state: 'active'
      )

      prefilters.each do |prefilter|
        rule = Evidence::Rule.find_or_create_by!(
          name: 'prefilter - ' << prefilter[:name],
          universal: true,
          rule_type: 'prefilter',
          optimal: false,
          state: 'active'
        )

        Evidence::Feedback.find_or_create_by!(
          rule_id: rule.id,
          order: 0,
          text: prefilter[:feedback]
        )
      end
    end
  end
end
