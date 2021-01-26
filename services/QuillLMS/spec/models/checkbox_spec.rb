# == Schema Information
#
# Table name: checkboxes
#
#  id           :integer          not null, primary key
#  metadata     :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  objective_id :integer
#  user_id      :integer
#
# Indexes
#
#  index_checkboxes_on_user_id_and_objective_id  (user_id,objective_id) UNIQUE
#
require 'rails_helper'

RSpec.describe Checkbox, type: :model do
  it { should belong_to(:objective) }
  it { should belong_to(:user) }

  describe 'objective id' do
    let(:objective) { create(:objective) }
    let(:user) { create(:user, objectives: [objective]) }
    let(:checkbox) { create(:checkbox, user: user, objective: objective) }
    let(:checkbox1) { create(:checkbox, user: user) }

    it 'should allow creating a checkbox object' do
      checkbox1.objective = objective
      expect(checkbox1.save).to eq false
      expect(checkbox1.errors.messages).to eq({:objective_id=>["should only be checked once per user"]})
    end
  end
end
