require "rails_helper"

RSpec.describe CronController, type: :controller do
  it 'should call Cron.run and return 200' do
    expect(Cron).to receive(:run)
    expect(response.status).to eq(200)
    post :new
  end
end
