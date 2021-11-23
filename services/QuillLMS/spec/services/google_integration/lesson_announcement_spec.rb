# frozen_string_literal: true

require 'rails_helper'

describe GoogleIntegration::LessonAnnouncement do
  let(:classroom_unit) { create(:classroom_unit) }
  let(:unit_activity) { create(:unit_activity) }
  let(:subject) { GoogleIntegration::LessonAnnouncement.new(classroom_unit, unit_activity) }

  describe "#post" do
    it "sends GoogleApiErrors to NewRelic" do
      expect(subject).to receive(:can_post_to_google_classroom?).and_return(true)
      expect(subject).to receive(:handle_response).and_raise(GoogleIntegration::LessonAnnouncement::GoogleApiError)
      expect(NewRelic::Agent).to receive(:add_custom_attributes)
      expect(NewRelic::Agent).to receive(:notice_error)
      subject.post
    end
  end

  describe "#handle_response" do
    it "raises a GoogleApiError on a non-200 response" do
      mock_response = double("response", {
        status: 403,
        body: '{}'
      })
      expect{subject.send(:handle_response) { mock_response }}.to raise_error(GoogleIntegration::LessonAnnouncement::GoogleApiError)
    end
  end
end
