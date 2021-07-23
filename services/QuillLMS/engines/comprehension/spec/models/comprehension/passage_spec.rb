require 'rails_helper'

module Comprehension
  RSpec.describe(Passage, :type => :model) do

    context("relations") { it { should belong_to(:activity) } }

    context 'should validations' do

      it { should validate_presence_of(:activity) }

      it { should validate_presence_of(:text) }

      it { should validate_length_of(:text).is_at_least(50) }
    end
  end
end
