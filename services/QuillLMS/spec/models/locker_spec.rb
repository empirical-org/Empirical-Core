# frozen_string_literal: true

# == Schema Information
#
# Table name: lockers
#
#  id          :bigint           not null, primary key
#  label       :string
#  preferences :jsonb
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :integer
#
require 'rails_helper'

RSpec.describe Locker, type: :model do
  context 'validations' do
    let(:locker) { build(:locker) }

    it { expect(locker).to be_valid }
    it { should validate_uniqueness_of(:user_id) }
    it { should validate_presence_of(:label) }
  end
end
