# frozen_string_literal: true

# == Schema Information
#
# Table name: email_subscriptions
#
#  id           :bigint           not null, primary key
#  cancel_token :string           not null
#  frequency    :string           not null
#  params       :jsonb
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :integer          not null
#
# Indexes
#
#  index_email_subscriptions_on_frequency  (frequency)
#
require 'rails_helper'

RSpec.describe EmailSubscription, type: :model do
  it { expect(build(:email_subscription)).to be_valid }

  it { should belong_to(:user) }

  it { should validate_presence_of(:frequency) }
  it { should validate_inclusion_of(:frequency).in_array(described_class::FREQUENCIES) }

  context 'scopes' do
    let!(:monthly_subscription) { create(:email_subscription, :monthly) }
    let!(:weekly_subscription) { create(:email_subscription, :weekly) }

    describe '.weekly' do
      subject { described_class.weekly }

      it { is_expected.to include weekly_subscription }
      it { is_expected.not_to include monthly_subscription }
    end

    describe '.monthly' do
      subject { described_class.monthly }

      it { is_expected.to include monthly_subscription }
      it { is_expected.not_to include weekly_subscription }
    end
  end
end
