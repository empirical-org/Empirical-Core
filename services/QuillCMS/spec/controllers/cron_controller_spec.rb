require "rails_helper"

RSpec.describe CronController, type: :controller do
  it 'should return 200 for found' do
    expect(Cron).to receive(:run)
    expect(response.status).to eq(200)
    get :run
  end
end