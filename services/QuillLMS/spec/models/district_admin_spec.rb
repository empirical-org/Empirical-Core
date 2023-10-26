# frozen_string_literal: true

# == Schema Information
#
# Table name: district_admins
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  district_id :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_district_admins_on_district_id  (district_id)
#  index_district_admins_on_user_id      (user_id)
#
require 'rails_helper'

describe DistrictAdmin, type: :model, redis: true do
  it { should belong_to(:district) }
  it { should belong_to(:user) }

  it { is_expected.to callback(:detach_schools).after(:destroy) }

  let!(:user) { create(:user, email: 'test@quill.org') }
  let!(:district) { create(:district) }
  let!(:district_admin) { create(:district_admin, user: user, district: district) }
  let!(:school1) { create(:school) }
  let!(:school2) { create(:school) }

  describe '#admin' do
    it 'should return the user associated' do
      expect(district_admin.admin).to eq(district_admin.user)
    end
  end

  describe '#attach_schools' do
    it 'should attach the specified schools to the district admin as administered schools' do
      district_admin.attach_schools([school1.id, school2.id])
      expect(district_admin.user.administered_schools).to match_array([school1, school2])
    end
  end

  describe '#detach_schools' do
    subject { district_admin.detach_schools }

    before { create(:school, district: district) }

    it { expect { subject }.to change(SchoolsAdmins, :count).from(1).to(0) }

    context 'school is already detached' do
      before { subject }

      it { expect { subject }.to not_change(SchoolsAdmins, :count) }
    end
  end
end
