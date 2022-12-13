# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Hint, :type => :model) do

    context 'should validations' do

      it { should validate_presence_of(:explanation) }
      it { should validate_presence_of(:image_link) }
      it { should validate_presence_of(:image_alt_text) }
    end

    context 'should relationships' do
      it { should have_many(:rules) }
    end

  end
end
