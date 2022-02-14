# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Hint, :type => :model) do

    context 'should validations' do

      it { should validate_presence_of(:explanation) }
      it { should validate_presence_of(:image_link) }
      it { should validate_presence_of(:image_alt_text) }
      it { should validate_presence_of(:rule) }
    end

    context 'should relationships' do
      it { should belong_to(:rule) }
    end

  end
end
