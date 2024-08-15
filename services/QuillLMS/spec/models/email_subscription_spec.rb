# frozen_string_literal: true

# == Schema Information
#
# Table name: email_subscriptions
#
#  id                :bigint           not null, primary key
#  cancel_token      :string           not null
#  frequency         :string           not null
#  params            :jsonb
#  subscription_type :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :integer          not null
#
require 'rails_helper'

RSpec.describe EmailSubscription, type: :model do
  it { expect(build(:email_subscription)).to be_valid }

  it { should belong_to(:user) }

  it { should validate_presence_of(:frequency) }
  it { should validate_inclusion_of(:frequency).in_array(described_class::FREQUENCIES) }

  it { should validate_presence_of(:subscription_type) }
  it { should validate_inclusion_of(:subscription_type).in_array(described_class::SUBSCRIPTION_TYPES) }

  context 'scopes' do
    let(:user) { create(:admin) }
    let!(:monthly_subscription) { create(:email_subscription, :monthly, user:) }
    let!(:weekly_subscription) { create(:email_subscription, :weekly, user:) }

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

    context '.premium' do
      subject { described_class.premium }

      it { is_expected.to eq [] }

      context 'user has a subscription' do
        let(:school) { create(:school) }
        let(:subscription) { create(:subscription) }

        before do
          create(:schools_users, user:, school:)
          create(:school_subscription, subscription:, school:)
        end

        it { is_expected.to include(monthly_subscription, weekly_subscription) }
      end
    end
  end

  context '#copy_filters' do
    subject { email_subscription.copy_filters }

    let(:email_subscription) { create(:email_subscription, subscription_type: described_class::ADMIN_DIAGNOSTIC_REPORT) }
    let(:user) { email_subscription.user }

    it { expect { subject }.to not_change(AdminReportFilterSelection, :count) }

    context 'filters to copy exist' do
      let(:copy_from_filter_selection) { { "user_id" => user.id } }

      before do
        create(:admin_report_filter_selection,
          user:,
          report: AdminReportFilterSelection::DIAGNOSTIC_GROWTH_REPORT_SKILL,
          filter_selections: copy_from_filter_selection)
      end

      it { expect { subject }.to change(AdminReportFilterSelection, :count).by(1) }

      it do
        subject
        expect(AdminReportFilterSelection.find_by(user:, report: AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_SKILL).filter_selections).to eq(copy_from_filter_selection)
      end

      context 'copy to filter already exists' do
        before do
          create(:admin_report_filter_selection,
            user:,
            report: AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_SKILL,
            filter_selections: { "test" => "intended to be overwritten" })
        end

        it { expect { subject }.to not_change(AdminReportFilterSelection, :count) }

        it do
          subject
          expect(AdminReportFilterSelection.find_by(user:, report: AdminReportFilterSelection::DIAGNOSTIC_GROWTH_SUBSCRIPTION_SKILL).filter_selections).to eq(copy_from_filter_selection)
        end
      end
    end
  end
end
