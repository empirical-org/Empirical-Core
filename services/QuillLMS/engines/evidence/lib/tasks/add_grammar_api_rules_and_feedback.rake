# frozen_string_literal: true

namespace :grammar_api_rules_and_feedback do
  desc 'data migration for grammar-api specific rules and feedback'
  task :insert => :environment do
    rules_csv = CSV.parse(File.read('engines/evidence/lib/tasks/rules.csv'), headers: true)
    valid_rules = rules_csv.select do |r|
      ['Grammar API', 'Opinion API'].include?(r['Module']) && r['Rule UID'].present?
    end

    all_prompts = Evidence::Prompt.all

    ActiveRecord::Base.transaction do
      valid_rules.each do |r|
        created_rule = Evidence::Rule.find_or_initialize_by(uid: r['Rule UID'])
        created_rule.attributes = {
            name: r['Rule'],
            note: r['Rule Description'],
            universal: true,
            rule_type: r['Module'] == 'Grammar API' ? 'grammar' : 'opinion',
            optimal: false,
            suborder: r['Rule Suborder'],
            state: 'active',
        }
        created_rule.save!

        feedback = Evidence::Feedback.find_or_initialize_by(
            rule_id: created_rule.id,
            order: 0,
            text: r['Feedback V3 [HM 4/21]']
        )

        feedback.save!

        all_prompts.each do |p|
          p_r = Evidence::PromptsRule.find_or_initialize_by(
              prompt_id: p.id, rule_id: created_rule.id
          )
          p_r.save!
        end

      end
    end

  end
end
