# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Flags, type: :model do
  context '#convert_flag_display_names_to_internal_names' do
    let(:activity) {create(:activity) }
    it 'should coerce flag display names to proper internal names' do
      activity.flags = ['Evidence Beta 2', 'production']
      activity.save!
      expect(Activity.find(activity.id).flags).to eq %w(evidence_beta2 production)
    end

  end
end
