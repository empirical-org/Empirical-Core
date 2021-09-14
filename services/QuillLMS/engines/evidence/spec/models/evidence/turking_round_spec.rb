require 'rails_helper'

module Evidence
  RSpec.describe(TurkingRound, :type => :model) do

    context 'should validations' do
      before { create(:evidence_turking_round) }

      it { should validate_presence_of(:activity_id) }

      it { should validate_presence_of(:expires_at) }

      it { should have_readonly_attribute(:uuid) }

      it { should validate_uniqueness_of(:uuid).case_insensitive }

      it 'should validate presence of uuid on any update call' do
        turking_round = create(:evidence_turking_round)
        turking_round.uuid = nil
        expect(turking_round.valid?).to(eq(false))
        expect(turking_round.errors[:uuid].include?("can't be blank")).to(eq(true))
      end

      it 'should set a default uuid when creating a new record' do
        turking_round = create(:evidence_turking_round, :uuid => nil)
        expect(turking_round.uuid).to_not(be_nil)
      end

      it 'should ensure expires_at is a future date on create' do
        turking_round = build(:evidence_turking_round, :expires_at => 1.month.ago)
        expect(turking_round.valid?).to(eq(false))
        expect(turking_round.errors[:expires_at].include?("must be in the future")).to(eq(true))
      end

      it 'should allow updates to expires_at to be in the past even though creates should not' do
        turking_round = create(:evidence_turking_round)
        turking_round.expires_at = 1.second.ago
        expect(turking_round.valid?).to(eq(true))
      end
    end

    context 'relationships' do
      it { should belong_to(:activity) }
    end
  end
end
