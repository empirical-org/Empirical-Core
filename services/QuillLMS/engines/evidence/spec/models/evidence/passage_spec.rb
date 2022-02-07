# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Passage, :type => :model) do

    context 'relations' do
      it { should belong_to(:activity) }
    end

    context 'should validations' do

      it { should validate_presence_of(:activity) }

      it { should validate_presence_of(:text) }

      it { should validate_length_of(:text).is_at_least(50) }
    end
  end
end
