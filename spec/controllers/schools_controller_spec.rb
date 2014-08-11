require 'spec_helper'

describe SchoolsController do
  render_views

  before do
    @school = School.create(
      zipcode: '60657',
      name: "Josh's Finishing School"
    )
  end

  it 'fetches schools based on zipcode' do
    get :index, zipcode: '60657', format: 'json'

    response.status.should == 200

    json = JSON.parse(response.body)
    json.size.should == 1
    json.first['id'].should == @school.id
    json.first['name'].should == @school.name
  end

  it 'returns an error if no zipcode is passed' do
    get :index, format: 'json'

    response.status.should == 400
    json = JSON.parse(response.body)
    json['error'].should == 'You must past a zipcode.'
  end

end
