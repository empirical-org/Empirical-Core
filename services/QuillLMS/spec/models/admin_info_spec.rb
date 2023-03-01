# frozen_string_literal: true

# == Schema Information
#
# Table name: admin_infos
#
#  id                  :bigint           not null, primary key
#  approval_status     :string
#  approver_role       :string
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

  it { should validate_presence_of(:user_id) }

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
        admin_info.sub_role = v
        expect(admin_info).to be_valid
      end

      admin_info.sub_role = nil
      expect(admin_info).to be_valid
    end

    it "should not allow invalid values" do
      admin_info.sub_role = 'other'
      expect(admin_info).not_to be_valid
    end
  end

  describe '#approval_status' do

    it "should allow valid values" do
      AdminInfo::APPROVER_ROLES.each do |v|
        admin_info.approver_role = v
        expect(admin_info).to be_valid
      end

      admin_info.approver_role = nil
      expect(admin_info).to be_valid
    end

    it "should not allow invalid values" do
      admin_info.approver_role = 'other'
      expect(admin_info).not_to be_valid
    end
  end

  describe '#approval_status' do
    it "should allow valid values" do
      AdminInfo::APPROVAL_STATUSES.each do |v|
        admin_info.approval_status = v
        expect(admin_info).to be_valid
      end

      admin_info.approval_status = nil
      expect(admin_info).to be_valid
    end

    it "should not allow invalid values" do
      admin_info.approval_status = 'other'
      expect(admin_info).not_to be_valid
    end
  end

end
