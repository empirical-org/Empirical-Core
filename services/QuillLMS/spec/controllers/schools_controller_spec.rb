require 'rails_helper'

describe SchoolsController, type: :controller do
  render_views

  before do
    @school = School.create(
      zipcode: '60657',
      name: "Josh's Finishing School"
    )
  end

  it 'fetches schools based on zipcode' do
    get :index, zipcode: '60657', format: 'json'

    expect(response.status).to eq(200)

    json = JSON.parse(response.body)
    expect(json.size).to eq(1)
    expect(json.first['id']).to eq(@school.id)
    expect(json.first['text']).to eq(@school.name)
  end

  it 'returns an error if no zipcode is passed' do
    get :index, format: 'json'

    expect(response.status).to eq(400)
    json = JSON.parse(response.body)
    expect(json['error']).to eq('You must enter a zipcode.')
  end

  describe '#select_school' do
    let(:user) { create(:user) }
    let(:school_user) { create(:school_user, user: user) }

    before do
      allow(controller).to receive(:current_user) { user }
    end

    it 'should fire up the sync sales contact worker' do
      expect(SyncSalesContactWorker).to receive(:perform_async)
      put :select_school, school_id_or_type: @school.id, format: :json
    end
  end

end
