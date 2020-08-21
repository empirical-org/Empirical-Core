require 'rails_helper'

describe SchoolsUsers, type: :model, redis: true do
  it { should belong_to(:school) }
  it { should belong_to(:user) }

  it { is_expected.to callback(:update_subscriptions).after(:save) }

  let(:user) { create(:user, email: 'test@quill.org') }
  let(:school) { create(:school) }

  describe '#update_subscriptions' do
    it 'should call updated school' do
      schools_user = SchoolsUsers.new(user: user, school: school)
      expect(user).to receive(:updated_school).with(school.id)
      schools_user.update_subscriptions
    end
  end
end
