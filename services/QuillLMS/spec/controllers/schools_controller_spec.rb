require 'rails_helper'

describe SchoolsController, type: :controller do
  render_views

  before do
    @school1 = School.create(
      zipcode: '60657',
      name: "Josh's Finishing School"
    )
    @school2 = School.create(
      zipcode: '11221',
      name: 'Max Academy'
    )
  end

  it 'fetches schools based on zipcode' do
    get :index, search: '60657', format: 'json'

    expect(response.status).to eq(200)

    json = JSON.parse(response.body)
    expect(json['data'].first['id']).to eq(@school1.id)
  end

  it 'fetches schools based on text string' do
    get :index, search: 'Max A', format: 'json'

    expect(response.status).to eq(200)

    json = JSON.parse(response.body)
    expect(json['data'].first['id']).to eq(@school2.id)
  end

  context "there is a current user" do

    describe '#select_school' do
      let(:user) { create(:user) }
      let(:school_user) { create(:school_user, user: user) }

      before do
        allow(controller).to receive(:current_user) { user }
      end
    end

  end

  context "there is no current user" do

    describe '#select_school' do
      let(:user) { create(:user) }
      let(:school_user) { create(:school_user, user: user) }

      before do
        allow(controller).to receive(:current_user) { nil }
      end

      it 'should redirect to login' do
        put :select_school, school_id_or_type: @school1.id, format: :json

        response.should redirect_to '/session/new'
      end
    end

  end

end
