# frozen_string_literal: true

require 'rails_helper'

describe SendSegmentIdentifyCallForAllAdminsWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:admins) { create_list(:admin, 5) }

    it 'should kick off a worker for every admin user' do
      admins.each do |admin|
        expect(IdentifyWorker).to receive(:perform_async).with(admin.id)
      end
      subject.perform
    end
  end
end
