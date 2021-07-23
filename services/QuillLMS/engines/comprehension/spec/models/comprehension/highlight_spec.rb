require 'rails_helper'

module Comprehension
  RSpec.describe(Highlight, :type => :model) do

    context 'should validations' do

      it { should validate_presence_of(:text) }

      it { should validate_length_of(:text).is_at_least(1).is_at_most(5000) }

      it { should validate_presence_of(:highlight_type) }

      it { should validate_inclusion_of(:highlight_type).in_array(Comprehension::Highlight::TYPES) }

      it { should validate_numericality_of(:starting_index).only_integer.is_greater_than_or_equal_to(0) }
    end

    context 'should relationships' do

      it { should belong_to(:feedback) }
    end
  end
end
