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

  it { is_expected.to callback(:attach_schools).after(:create) }
  it { is_expected.to callback(:detach_schools).after(:destroy) }

  let!(:user) { create(:user, email: 'test@quill.org') }
  let!(:district) { create(:district) }
  let!(:district_admin) { create(:district_admin, user: user, district: district) }

  describe '#admin' do
    it 'should return the user associated' do
      expect(district_admin.admin).to eq(district_admin.user)
    end
  end

  describe '#attach_schools' do
    let(:attach_school_to_district) { create(:school, district: district) }

    it { expect { attach_school_to_district }.to change(SchoolsAdmins, :count).from(0).to(1) }
    it { expect { attach_school_to_district }.to change(NewAdminEmailWorker.jobs, :size).by(1) }

    context 'school is already attached' do
      before { attach_school_to_district }

      it { expect { district_admin.attach_schools }.to not_change(SchoolsAdmins, :count) }
      it { expect { district_admin.attach_schools }.to not_change(NewAdminEmailWorker.jobs, :size) }
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
