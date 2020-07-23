require 'rails_helper'

describe SyncVitallyAccountsWorker do
  let(:subject) { described_class.new }
  let(:school) { create(:school) }

  describe '#perform' do
    it 'build payloads from school objects and batch send them to Vitally' do
      vitally_api_double = double
      payload = [SerializeVitallySalesAccount.new(school).data]
      expect(VitallyApi).to receive(:new).and_return(vitally_api_double)
      expect(vitally_api_double).to receive(:batch).with(payload)
      subject.perform([school.id])
    end
  end
end
