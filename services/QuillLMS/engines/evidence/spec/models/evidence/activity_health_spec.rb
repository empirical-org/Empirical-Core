require 'rails_helper'

module Evidence
  RSpec.describe(ActivityHealth, :type => :model) do

    context 'associations' do

      it { should have_many(:prompt_healths).dependent(:destroy) }

    end

    context 'validations' do

      it { should validate_inclusion_of(:flags).in?(ActivityHealth::FLAGS) }

      it { should validate_numericality_of(:version).is_greater_than_or_equal_to(1) }

      it { should validate_numericality_of(:version_plays).is_greater_than_or_equal_to(0) }

      it { should validate_numericality_of(:total_plays).is_greater_than_or_equal_to(0) }

      it { should validate_inclusion_of(:completion_rate).in?(0..100)}

      it { should validate_inclusion_of(:because_avg_attempts).in?(0..5)}

      it { should validate_inclusion_of(:but_avg_attempts).in?(0..5)}

      it { should validate_inclusion_of(:so_avg_attempts).in?(0..5)}
    end
  end
end
