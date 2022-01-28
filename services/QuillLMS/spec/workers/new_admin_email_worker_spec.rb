# frozen_string_literal: true

require 'rails_helper'

describe NewAdminEmailWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }
    let!(:school) { create(:school) }

    it 'should send the new admin email' do
      expect_any_instance_of(User).to receive(:send_new_admin_email).with(school)
      subject.perform(user.id, school.id)
    end
  end
end
