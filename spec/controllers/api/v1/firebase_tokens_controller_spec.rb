require 'rails_helper'

describe Api::V1::FirebaseTokensController, :type => :controller do

  context 'PUT #update' do
    let!(:app) { FirebaseApp.create!(name: 'foobar', secret: '12345abcde') }
    let!(:user) { FactoryGirl.create(:student) }

    context 'default behavior' do
      before do
        subject
      end

      def subject
        post :create, app: 'foobar'
      end

      it 'responds with 200' do
        expect(response.status).to eq(200)
      end

      it 'responds with a firebase token' do
        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to have_key('token')
      end
    end

  end
end