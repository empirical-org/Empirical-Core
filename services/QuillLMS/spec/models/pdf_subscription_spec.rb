# == Schema Information
#
# Table name: pdf_subscriptions
#
#  id                               :bigint           not null, primary key
#  frequency                        :string           not null
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
end
