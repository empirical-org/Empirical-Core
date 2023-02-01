# frozen_string_literal: true

# == Schema Information
#
# Table name: admin_infos
#
#  id                  :bigint           not null, primary key
#  approval_status     :string
#  sub_role            :string
#  verification_reason :text
#  verification_url    :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  user_id             :bigint           not null
#
# Indexes
#
#  index_admin_infos_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

describe AdminInfo, type: :model, redis: true do
  it { should belong_to(:user) }

  it {should validate_presence_of(:user_id)}

  context 'uniqueness' do
    let!(:admin_info) {create(:admin_info)}

    it {should validate_uniqueness_of(:user_id)}
  end

  let(:admin_info) {create(:admin_info)}
  let(:admin) {create(:user)}

  describe 'admin' do
    it 'should read the user for the admin' do
      expect(admin_info.admin).to eq(admin_info.user)
    end
  end

  describe 'admin_id' do
    it 'should read the user_id for the admin_id' do
      expect(admin_info.admin_id).to eq(admin_info.user_id)
    end
  end

  describe 'admin=' do
    it 'should set the user for the admin' do
      admin_info.admin = admin
      expect(admin_info.user).to eq(admin)
    end
  end

  describe 'admin_id=' do
    it 'should set the user_id for the admin_id' do
      admin_info.admin_id = admin.id
      expect(admin_info.user_id).to eq(admin.id)
    end
  end

  describe '#sub_role' do
    it "should allow valid values" do
      AdminInfo::SUB_ROLES.each do |v|
        should allow_value(v).for(:sub_role)
      end
    end

    it { should allow_value(nil).for(:sub_role) }
    it { should_not allow_value("other").for(:sub_role) }
  end

  describe '#approval_status' do
    it "should allow valid values" do
      AdminInfo::APPROVAL_STATUSES.each do |v|
        should allow_value(v).for(:approval_status)
      end
    end

    it { should allow_value(nil).for(:approval_status) }
    it { should_not allow_value("other").for(:approval_status) }
  end

end
