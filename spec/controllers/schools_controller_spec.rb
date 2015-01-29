require 'rails_helper'

describe SchoolsController, :type => :controller do
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
    expect(json['error']).to eq('You must past a zipcode.')
  end

end
