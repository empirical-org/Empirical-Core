require 'rails_helper'

describe PartnerCurriculum, type: :model do
  it { should belong_to(:curriculum) }

  it { should validate_length_of(:partner).is_at_most(50) }
  it { should validate_presence_of(:partner) }
  it { should validate_inclusion_of(:partner).in?(PartnerCurriculum::PARTNERS) }

  it { should validate_presence_of(:curriculum_type) }
  it { should validate_length_of(:curriculum_type).is_at_most(50) }
  it { should validate_inclusion_of(:curriculum_type).in?(PartnerCurriculum::CURRICULUM_TYPES) }
  it { should validate_presence_of(:curriculum_id) }
  it { should validate_uniqueness_of(:curriculum_id).scoped_to([:curriculum_type, :partner]) }

  context 'basic data' do
    it 'should be valid' do
      unit_template = create(:unit_template)
      partner_curriculum = PartnerCurriculum.create(partner: 'amplify', curriculum: unit_template)
      expect(partner_curriculum).to be_valid
    end
  end
end
