# frozen_string_literal: true

require 'rails_helper'

describe UpdateStudentLastActiveWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }
    let(:new_date) { DateTime.new(100) }

    it 'should update the users last seen with the given date time'  do
      subject.perform(user.id, new_date)
      expect(user.reload.last_active).to eq new_date
    end
  end
end
