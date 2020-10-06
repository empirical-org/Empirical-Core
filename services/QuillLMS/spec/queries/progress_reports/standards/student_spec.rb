require 'rails_helper'

describe ProgressReports::Standards::Student do
  describe 'getting users for the progress reports' do

    let!(:teacher) { create(:teacher) }
    let(:standard_level_ids) { [standard_levels[0].id, standard_levels[1].id] }

    describe 'for the standards report' do
      include_context 'Standard Progress Report'
      subject { ProgressReports::Standards::Student.new(teacher).results(filters).to_a }

      let(:filters) { {} }

      it 'retrieves the right aggregated data' do
        user = subject[0]
        expect(user.name).to be_present
        expect(user.total_standard_count).to be_present
        expect(user.proficient_standard_count).to be_present
        expect(user.not_proficient_standard_count).to be_present
        expect(user.total_activity_count).to be_present
        expect(user.average_score).to be_present
      end
    end
  end
end
