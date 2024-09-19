# frozen_string_literal: true

require 'rails_helper'

module VitallyIntegration
  describe UnignoreActiveOrganizationsWorker do
    subject { described_class.new.perform }

    let(:active_sign_in) { DateTime.current - 1.hour }
    let(:active_student) { create(:student, last_sign_in: active_sign_in) }
    let(:active_classroom) { create(:classroom, students: [active_student]) }
    let(:active_school) { create(:school, users: active_classroom.reload.teachers) }
    let(:inactive_sign_in) { DateTime.current - 100.hours }
    let(:inactive_student) { create(:student, last_sign_in: inactive_sign_in) }
    let(:inactive_classroom) { create(:classroom, students: [inactive_student]) }
    let(:inactive_school) { create(:school, users: inactive_classroom.reload.teachers) }

    let!(:active_district) { create(:district, schools: [active_school]) }
    let!(:inactive_district) { create(:district, schools: [inactive_school]) }

    it do
      expect(UnignoreOrganizationWorker).to receive(:perform_in).with(anything, active_district.id)
      subject
    end

    it do
      expect(UnignoreOrganizationWorker).not_to receive(:perform_in).with(anything, inactive_district.id)
      subject
    end
  end
end
