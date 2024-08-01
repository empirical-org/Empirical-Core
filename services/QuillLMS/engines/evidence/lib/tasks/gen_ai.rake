# frozen_string_literal: true

namespace :gen_ai do
  desc 'Seed the 6 GenAI concepts needed by the system'
  task populate_genai_concepts: :environment do
    concept_mapping = {
      'because' => 'qkjnIjFfXdTuKO7FgPzsIg',
      'but' => 'KwspxuelfGZQCq7yX6ThPQ',
      'so' => 'IBdOFpAWi42LgfXvcz0scQ'
    }
    rules_uids_optimal = Evidence::GenAI::ResponseBuilder::RULES_OPTIMAL
    rule_uids_suboptimal = Evidence::GenAI::ResponseBuilder::RULES_SUBOPTIMAL

    Evidence::Prompt::CONJUNCTIONS.each do |conjunction|
      [true, false].each do |optimal|
        uid_mapping = optimal ? rules_uids_optimal : rule_uids_suboptimal

        Evidence::Rule.create(
          uid: uid_mapping[conjunction],
          concept_uid: concept_mapping[conjunction],
          universal: true,
          rule_type: Evidence::Rule::TYPE_GEN_AI,
          optimal:,
          state: 'active',
          name: "GenAI universal #{conjunction} - #{optimal ? 'optimal' : 'suboptimal'}"
        )
      end
    end
  end
end
