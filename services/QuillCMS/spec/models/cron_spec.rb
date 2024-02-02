require "rails_helper"

RSpec.describe Cron do
  describe "kicks off appropriate jobs at the appropriate time" do
    context 'RefreshAllResponsesViewsWorker' do
      it "should not kick off jobs if the hour is not 3AM" do
        allow(Time).to receive(:now).and_return(Time.zone.now.beginning_of_day)
        expect(RefreshAllResponsesViewsWorker).to_not receive(:perform_async)
        Cron.run
      end


      it "should run a refresh response view job if the hour is 3AM" do
        allow(Time).to receive(:now).and_return(Time.zone.now.beginning_of_day + 3.hour)
        expect(RefreshAllResponsesViewsWorker).to receive(:perform_async)

        Cron.run
      end
    end
  end
end
