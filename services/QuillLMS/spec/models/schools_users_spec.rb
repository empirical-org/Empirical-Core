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

  describe '#school_changed_change_log' do
    let!(:school1) { create(:school) }
    let!(:school2) { create(:school) }
    let(:schools_user) { create(:schools_users, school: school1) }

    it 'should do nothing if school_id does not change' do
      expect do
        schools_user.save
      end.to not_change(ChangeLog, :count)
    end

    it 'should create a new ChangeLog record when school_id changes' do
      expect do
        schools_user.school_id = school2.id
        schools_user.save
      end.to change(ChangeLog, :count).by(1)
    end

    it 'should have an old and new school_id in the ChangeLog created' do
      schools_user.school_id = school2.id
      schools_user.save

      expect(ChangeLog.last.previous_value).to eq(school1.id.to_s)
      expect(ChangeLog.last.new_value).to eq(school2.id.to_s)
    end
  end
end
