# == Schema Information
#
# Table name: pdf_subscriptions
#
#  id                               :bigint           not null, primary key
#  frequency                        :string           not null
#  token                            :string           not null
#  created_at                       :datetime         not null
#  updated_at                       :datetime         not null
#  admin_report_filter_selection_id :bigint           not null
#
# Indexes
#
#  index_pdf_subscriptions_on_admin_report_filter_selection_id  (admin_report_filter_selection_id)
#  index_pdf_subscriptions_on_frequency                         (frequency)
#
require 'rails_helper'

RSpec.describe PdfSubscription, type: :model do
  it { expect(build(:pdf_subscription)).to be_valid }

  it { should belong_to(:admin_report_filter_selection) }

  it { should validate_presence_of(:frequency) }
  it { should validate_inclusion_of(:frequency).in_array(described_class::FREQUENCIES) }

  it 'generates a token before creating a subscription' do
    pdf_subscription = build(:pdf_subscription)
    expect { pdf_subscription.save }.to change(pdf_subscription, :token).from(nil).to(String)
  end

  context 'scopes' do
    let!(:monthly_subscription) { create(:pdf_subscription, :monthly) }
    let!(:weekly_subscription) { create(:pdf_subscription, :weekly) }

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

  describe '#generate_token' do
    it 'generates a unique token before creation' do
      subscription = build(:pdf_subscription)
      expect(subscription.token).to be_nil
      subscription.save
      expect(subscription.token).not_to be_nil
    end
  end
end
