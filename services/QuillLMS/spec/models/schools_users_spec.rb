# frozen_string_literal: true

# == Schema Information
#
# Table name: schools_users
#
#  id        :integer          not null, primary key
#  school_id :integer
#  user_id   :integer
#
# Indexes
#
#  index_schools_users_on_school_id              (school_id)
#  index_schools_users_on_school_id_and_user_id  (school_id,user_id)
#  index_schools_users_on_user_id                (user_id) UNIQUE
#
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
