# frozen_string_literal: true

require 'rails_helper'

describe SyncVitallyUsersWorker do
  subject { described_class.new }

  let(:school) { create(:school) }
  let(:user) { create(:teacher, school: school) }

  before do
    create(:activity_classification, key: 'diagnostic')
    create(:activity_classification, key: 'evidence')
  end

  describe '#perform' do
    it 'build payloads from user objects and batch send them to Vitally' do
      create(:diagnostic)
      vitally_api_double = double
      serializer_double = double('serializer', data: SerializeVitallySalesUser.new(user).data)
      expect(SerializeVitallySalesUser).to receive(:new).and_return(serializer_double)
      expect(VitallyApi).to receive(:new).and_return(vitally_api_double)
      expect(vitally_api_double).to receive(:batch).with([serializer_double.data])
      subject.perform([user.id])
    end
  end
end
