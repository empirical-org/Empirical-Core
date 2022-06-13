# frozen_string_literal: true

namespace :universal_rules do
  desc 'Add or update universal rules from CSV file'
  # Example usage: rake 'universal_rules:update_from_csv[grammar, rules.csv]'
  task :update_from_csv, [:type, :filename] => :environment do |t, args|
    iostream = File.read(args[:filename])
    UniversalRuleLoader.update_from_csv(type: args[:type], iostream: iostream)
  end

  desc 'Data migration to add or update the ERROR type universal rule'
  task :set_error_feedback, [:feedback_text] => :environment do |t, args|
    error_rule = Evidence::Rule.find_by(rule_type: Evidence::Rule::TYPE_ERROR)
    if error_rule
      error_rule.feedbacks.first.update!(text: args[:feedback_text])
    else
      error_rule = Evidence::Rule.new(
        uid: SecureRandom.uuid,
        name: 'API Error',
        universal: true,
        optimal: true,
        rule_type: Evidence::Rule::TYPE_ERROR,
        state: Evidence::Rule::STATE_ACTIVE
      )
      error_rule.feedbacks = [Evidence::Feedback.new(
        order: 0,
        text: args[:feedback_text]
      )]
      error_rule.save!
    end
  end
end
