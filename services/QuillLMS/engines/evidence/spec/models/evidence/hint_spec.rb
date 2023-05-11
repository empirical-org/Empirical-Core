# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_hints
#
#  id             :bigint           not null, primary key
#  explanation    :string           not null
#  image_link     :string           not null
#  image_alt_text :string           not null
#  rule_id        :bigint
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  name           :text
#
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
