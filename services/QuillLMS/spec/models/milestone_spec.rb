require 'rails_helper'

describe Milestone, type: :model do
  it { should have_many(:user_milestones)}
  it { should have_many(:users).through(:user_milestones) }

  describe 'types' do
    it 'should have the correct types hash' do
      expect(Milestone::TYPES[:invite_a_coteacher]).to eq('Invite a Co-Teacher')
      expect(Milestone::TYPES[:refer_an_active_teacher]).to eq('Refer an Active Teacher',)
    end
  end
end
