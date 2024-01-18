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
end

# require 'rails_helper'

# RSpec.describe PdfSubscription, type: :model do
#   it { should belong_to(:admin_report_filter_selection) }
#   it { should validate_presence_of(:frequency) }
#   it { should validate_inclusion_of(:frequency).in_array(PdfSubscription::FREQUENCIES) }

#   describe 'scopes' do
#     let!(:weekly_subscription) { create(:pdf_subscription, frequency: PdfSubscription::WEEKLY) }
#     let!(:monthly_subscription) { create(:pdf_subscription, frequency: PdfSubscription::MONTHLY) }

#     describe '.weekly' do
#       it 'includes subscriptions with weekly frequency' do
#         expect(PdfSubscription.weekly).to include(weekly_subscription)
#         expect(PdfSubscription.weekly).not_to include(monthly_subscription)
#       end
#     end

#     describe '.monthly' do
#       it 'includes subscriptions with monthly frequency' do
#         expect(PdfSubscription.monthly).to include(monthly_subscription)
#         expect(PdfSubscription.monthly).not_to include(weekly_subscription)
#       end
#     end
#   end

#   describe '#generate_token' do
#     it 'generates a unique token before creation' do
#       subscription = build(:pdf_subscription)
#       expect(subscription.token).to be_nil
#       subscription.save
#       expect(subscription.token).not_to be_nil
#     end
#   end

#   describe 'delegation' do
#     let(:admin_report_filter_selection) { create(:admin_report_filter_selection) }
#     let(:subscription) { create(:pdf_subscription, admin_report_filter_selection: admin_report_filter_selection) }

#     it 'delegates user to admin_report_filter_selection' do
#       expect(subscription.user).to eq(admin_report_filter_selection.user)
#     end
#   end
# end
