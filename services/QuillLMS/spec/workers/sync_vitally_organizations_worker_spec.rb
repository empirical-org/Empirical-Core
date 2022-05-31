# frozen_string_literal: true

require 'rails_helper'

describe SyncVitallyOrganizationsWorker do
  subject { described_class.new }

  let(:district) { create(:district) }

  describe '#perform' do
    it 'build payloads from district objects and batch send them to Vitally' do
      vitally_api_double = double

      expect(VitallyApi).to receive(:new).and_return(vitally_api_double)
      expect(vitally_api_double).to receive(:batch).with([district.vitally_data])
      subject.perform([district.id])
    end
  end
end
