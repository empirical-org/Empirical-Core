# == Schema Information
#
# Table name: partner_contents
#
#  id           :integer          not null, primary key
#  content_type :string(50)
#  order        :integer
#  partner      :string(50)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  content_id   :integer
#
# Indexes
#
#  index_partner_contents_on_content_type_and_content_id  (content_type,content_id)
#  index_partner_contents_on_partner                      (partner)
#
require 'rails_helper'

describe PartnerContent, type: :model do
  it { should belong_to(:content) }

  it { should validate_length_of(:partner).is_at_most(50) }
  it { should validate_presence_of(:partner) }
  it { should validate_inclusion_of(:partner).in?(PartnerContent::PARTNERS) }

  it { should validate_presence_of(:content_type) }
  it { should validate_length_of(:content_type).is_at_most(50) }
  it { should validate_inclusion_of(:content_type).in?(PartnerContent::CONTENT_TYPES) }
  it { should validate_presence_of(:content_id) }
  it { should validate_uniqueness_of(:content_id).scoped_to([:content_type, :partner]) }

  context 'basic data' do
    it 'should be valid' do
      unit_template = create(:unit_template)
      partner_content = PartnerContent.create(partner: 'amplify', content: unit_template)
      expect(partner_content).to be_valid
    end
  end
end
