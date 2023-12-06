# == Schema Information
#
# Table name: pdf_subscriptions
#
#  id                :bigint           not null, primary key
#  filter_selections :jsonb
#  frequency         :string           not null
#  title             :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :bigint           not null
#
# Indexes
#
#  index_pdf_subscriptions_on_frequency  (frequency)
#  index_pdf_subscriptions_on_title      (title)
#  index_pdf_subscriptions_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe PdfSubscription, type: :model do
  it { expect(build(:pdf_subscription)).to be_valid }

  it { should belong_to(:user) }

  it { should validate_presence_of(:frequency) }
  it { should validate_inclusion_of(:frequency).in_array(described_class::FREQUENCIES) }
  it { should validate_inclusion_of(:title).in_array(described_class::TITLES) }
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:user_id) }
end
