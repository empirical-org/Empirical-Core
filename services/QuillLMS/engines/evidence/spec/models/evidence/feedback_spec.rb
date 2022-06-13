# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Feedback, :type => :model) do

    context 'should validations' do
      subject { FactoryBot.build(:evidence_feedback) }

      it { should validate_presence_of(:text) }

      it { should validate_presence_of(:rule) }

      it { should validate_length_of(:text).is_at_least(10).is_at_most(500) }

      it { should validate_numericality_of(:order).only_integer.is_greater_than_or_equal_to(0) }

      it { should validate_uniqueness_of(:order).scoped_to(:rule_id) }
    end

    context 'should relationships' do

      it { should belong_to(:rule) }
    end
  end
end
