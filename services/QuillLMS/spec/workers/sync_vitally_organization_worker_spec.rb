# frozen_string_literal: true

require 'rails_helper'

describe SyncVitallyOrganizationWorker do
  subject { described_class.new }

  let(:district) { create(:district) }

  describe '#perform' do
    it 'build payload from district object and send them to Vitally' do
      vitally_api_double = double

      expect(VitallyRestApi).to receive(:new).and_return(vitally_api_double)
      expect(vitally_api_double).to receive(:create).with('organizations', district.vitally_data)
      subject.perform(district.id)
    end
  end
end
