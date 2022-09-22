# frozen_string_literal: true

require 'rails_helper'

describe Api::V1::UsersController do
  before { allow(controller).to receive(:current_user) { user } }

  describe '#index' do
    let(:user) { create(:user) }

    it 'should return the correct json' do
      get :index, as: :json

      expect(response.body).to eq({ user: user }.to_json)
    end
  end

  describe '#current_user_and_coteachers' do
    context 'current_user not present' do
      let(:user) { nil }

      it 'should return the correct json' do
        get :current_user_and_coteachers, as: :json

        expect(response.body).to eq({
          user: user,
          coteachers: []
        }.to_json)
      end
    end

    context 'current_user is present' do
      let!(:classroom) { create(:classroom, :with_coteacher) }
      let!(:user) { classroom.owner }
      let!(:coteachers) { classroom.coteachers.map { |ct| ct.attributes.slice('id', 'name') } }

      it 'should return the correct json' do
        get :current_user_and_coteachers, as: :json

        expect(response.body).to eq({
          user: user,
          coteachers: coteachers
        }.to_json)
      end
    end
  end

  describe '#current_user_role' do
    context 'teachers' do
      let(:user) { create(:teacher) }

      it 'should return teacher for teacher users' do
        get :current_user_role, as: :json

        expect(response.body).to eq({ role: "teacher" }.to_json)
      end
    end

    context 'students' do
      let(:user)  { create(:student) }

      it 'should return student for student users' do
        get :current_user_role, as: :json
        expect(response.body).to eq({ role: "student" }.to_json)
      end
    end

    context 'no user' do
      let(:user) { nil }

      it 'should return nil if current_user is nil' do
        get :current_user_role, as: :json
        expect(response.body).to eq({ role: nil }.to_json)
      end
    end
  end
end
