require 'rails_helper'

describe Milestone, type: :model do
  it { should have_many(:user_milestones)}
  it { should have_many(:users).through(:user_milestones) }

  describe 'types' do
    it 'should have the correct types hash' do
      expect(Milestone::TYPES).to eq({invite_a_coteacher: 'Invite a Co-Teacher'})
    end
  end
end