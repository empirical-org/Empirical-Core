require "rails_helper"

RSpec.describe Cron do
  describe "kicks off appropriate jobs at the appropriate time" do

    it "should not kick off jobs if the hour is not 11PM" do
      allow(Time).to receive(:now).and_return(Time.now.beginning_of_day)
      expect(UpdateIndividualResponseWorker).to_not receive(:perform_async)
      Cron.run
    end

    it "should kick off job if the hour is 11PM" do
      allow(Time).to receive(:now).and_return(Time.zone.now.end_of_day - 1.minute)
      expect(UpdateElasticsearchWorker).to receive(:perform_async).with(Time.zone.now.end_of_day - 1.minute)
      Cron.run
    end
  end
end
