# frozen_string_literal: true

# == Schema Information
#
# Table name: learn_worlds_accounts
#
#  id          :bigint           not null, primary key
#  last_login  :datetime
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  external_id :string           not null
#  user_id     :bigint
#
# Indexes
#
#  index_learn_worlds_accounts_on_external_id  (external_id) UNIQUE
#  index_learn_worlds_accounts_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe LearnWorldsAccount, type: :model do
  subject { create(:learn_worlds_account) }

  it { should belong_to(:user) }
  it { should validate_uniqueness_of(:external_id) }

  it { expect(subject).to be_valid }

  context 'scopes' do

    context 'enrolled courses' do
      before { create(:learn_worlds_account_enrolled_course_event, learn_worlds_account: subject) }

      it { expect(subject.enrolled_courses.count).to eq(1) }
    end

    context 'completed courses' do
      before { create(:learn_worlds_account_completed_course_event, learn_worlds_account: subject) }

      it { expect(subject.completed_courses.count).to eq(1) }
    end

    context 'earned certificate courses' do
      before { create(:learn_worlds_account_earned_certificate_course_event, learn_worlds_account: subject) }

      it { expect(subject.earned_certificate_courses.count).to eq(1) }
    end
  end
end
