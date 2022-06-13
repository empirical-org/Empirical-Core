# frozen_string_literal: true

require 'rails_helper'

describe SyncVitallyAccountsWorker do
  subject { described_class.new }

  let(:school) { create(:school) }

  describe '#perform' do
    it 'build payloads from school objects and batch send them to Vitally' do
      vitally_api_double = double
      serializer_double = double('serializer', data: SerializeVitallySalesAccount.new(school).data)
      expect(SerializeVitallySalesAccount).to receive(:new).and_return(serializer_double)
      expect(VitallyApi).to receive(:new).and_return(vitally_api_double)
      expect(vitally_api_double).to receive(:batch).with([serializer_double.data])
      subject.perform([school.id])
    end
  end
end
