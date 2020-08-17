require "rails_helper"

RSpec.describe Cron do
  describe "kicks off appropriate jobs at the appropriate time" do
    let(:response1) { create(:response, id: 1) }
    let(:response2) { create(:response) }
    let(:response3) { create(:response, created_at: Date.yesterday, updated_at: Date.yesterday)}

    it "should not kick off jobs if the hour is not 11PM" do
      allow(Time).to receive(:now).and_return(Time.now.beginning_of_day)
      expect(UpdateIndividualResponseWorker).to_not receive(:perform_async)
      Cron.run
    end

    it "should kick off jobs if the hour is 11PM" do
      allow(Time).to receive(:now).and_return(Time.zone.now.end_of_day - 1.minute)
      expect(UpdateIndividualResponseWorker).to receive(:perform_async).with(response1.id)
      expect(UpdateIndividualResponseWorker).to receive(:perform_async).with(response2.id)
      expect(UpdateIndividualResponseWorker).not_to receive(:perform_async).with(response3.id)
      Cron.run
    end
  end
end
