# frozen_string_literal: true

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

  describe 'index' do
    it 'fetches schools based on zipcode' do
      get :index, params: { search: '60657' }, as: :json

      expect(response.status).to eq(200)

      json = JSON.parse(response.body)
      expect(json['data'].first['id']).to eq(@school1.id)
    end

    it 'fetches schools based on text string' do
      get :index, params: { search: 'Max' }, as: :json

      expect(response.status).to eq(200)

      json = JSON.parse(response.body)
      expect(json['data'].first['id']).to eq(@school2.id)
    end

    it 'will return an empty array if the search length is less than the minimum' do
      get :index, params: { search: 'M' }, as: :json

      expect(response.status).to eq(200)

      json = JSON.parse(response.body)
      expect(json['data']).to eq([])
    end
  end

  context "there is no current user" do

    describe '#select_school' do
      let(:user) { create(:user) }
      let(:school_user) { create(:school_user, user: user) }

      before { allow(controller).to receive(:current_user) { nil } }

      it 'should redirect to login' do
        put :select_school, params: { school_id_or_type: @school1.id }, as: :json

        expect(response).to redirect_to('/session/new')
      end
    end

  end

  context "there is a current user" do

    describe '#select_school' do
      let(:user) { create(:user, email: 'emilaif@gmail.com') }

      before { allow(controller).to receive(:current_user) { user } }

      it 'should attach the user to school' do
        put :select_school, params: { school_id_or_type: @school1.id }, as: :json

        expect(SchoolsUsers.find_by(user_id: user.id, school_id: @school1.id)).to be
      end
    end

  end

  describe '#submit_unlisted_school_information' do
    let(:user) { create(:user, email: 'emilaif@gmail.com') }

    before { allow(controller).to receive(:current_user) { user } }

    it 'calls the TrackUnlistedSchoolInformationWorker with the current user and parameters' do
      school_name = 'Nonexistent'
      school_zipcode = 55555
      expect(TrackUnlistedSchoolInformationWorker).to receive(:perform_async).with(user.id, school_name, school_zipcode)

      post :submit_unlisted_school_information, params: { school_name: school_name, school_zipcode: school_zipcode }, as: :json
    end
  end

end
