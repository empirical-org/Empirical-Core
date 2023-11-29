require "rails_helper"

RSpec.describe Cron do
  describe "kicks off appropriate jobs at the appropriate time" do

    subject { Cron.run }
    let(:now) {Time.zone.now}
    let(:run_time) { now.beginning_of_day + 3.hour }

    context 'UpdateElasticsearchWorker' do
      it "should not kick off jobs if the hour is not 3AM" do
        allow(Time).to receive(:now).and_return(now.beginning_of_day)
        expect(UpdateIndividualResponseWorker).to_not receive(:perform_async)
        subject
      end

      it "should kick off job if the hour is 3AM" do
        allow(Time).to receive(:now).and_return(run_time)

        expect(UpdateElasticsearchWorker).to receive(:perform_async).exactly(27).times

        subject
      end
    end

    context 'RefreshAllResponsesViewsWorker' do
      it "should run a refresh response view job if the hour is 3AM" do
        allow(Time).to receive(:now).and_return(run_time)
        expect(RefreshAllResponsesViewsWorker).to receive(:perform_async)

        subject
      end
    end
  end
end
