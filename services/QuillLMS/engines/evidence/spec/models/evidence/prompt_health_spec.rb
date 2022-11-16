# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(PromptHealth, :type => :model) do

    context 'associations' do

      it { should belong_to(:activity_health) }

    end

    context 'validations' do

      it { should validate_numericality_of(:current_version).is_greater_than_or_equal_to(1) }

      it { should validate_numericality_of(:version_responses).is_greater_than_or_equal_to(0) }

      it { should validate_inclusion_of(:first_attempt_optimal).in?(0..100)}

      it { should validate_inclusion_of(:final_attempt_optimal).in?(0..100)}

      it { should validate_inclusion_of(:avg_attempts).in?(0..5)}

      it { should validate_inclusion_of(:confidence).in?(0..1)}

      it { should validate_inclusion_of(:percent_automl_consecutive_repeated).in?(0..100)}

      it { should validate_inclusion_of(:percent_automl).in?(0..100)}

      it { should validate_inclusion_of(:percent_opinion).in?(0..100)}

      it { should validate_inclusion_of(:percent_grammar).in?(0..100)}

      it { should validate_inclusion_of(:percent_plagiarism).in?(0..100)}

      it { should validate_inclusion_of(:percent_spelling).in?(0..100)}
    end
  end
end
