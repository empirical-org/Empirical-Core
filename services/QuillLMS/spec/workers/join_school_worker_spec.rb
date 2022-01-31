# frozen_string_literal: true

require 'rails_helper'

describe JoinSchoolEmailWorker do
  subject { described_class.new }

  describe '#perform' do
    let!(:user) { create(:user) }
    let!(:school) { create(:school) }

    it 'should send the join school email' do
      expect_any_instance_of(User).to receive(:send_join_school_email).with(school)
      subject.perform(user.id, school.id)
    end
  end
end
