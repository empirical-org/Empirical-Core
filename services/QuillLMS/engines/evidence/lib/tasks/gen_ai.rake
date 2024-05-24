# frozen_string_literal: true

namespace :gen_ai do

  desc 'Seed the 6 GenAI concepts needed by the system'
  task populate_genai_concepts: :environment do
    concept_mapping = {
      'because' => 'qkjnIjFfXdTuKO7FgPzsIg',
      'but'     => 'KwspxuelfGZQCq7yX6ThPQ',
      'so'      => 'IBdOFpAWi42LgfXvcz0scQ'
    }

    Evidence::Prompt::CONJUNCTIONS.each do |conjunction|
      [true, false].each do |optimal|
        Evidence::Rule.create(
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
