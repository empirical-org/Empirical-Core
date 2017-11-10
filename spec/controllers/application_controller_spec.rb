require 'rails_helper'

describe ApplicationController, type: :controller do
  describe 'authentication methods' do
    let(:classroom) { create(:classroom, :with_coteacher) }
    let(:coteacher) { classroom.coteachers.first }
    let(:owner) { classroom.owner }

    describe '#classroom_owner' do
      it 'should return nil if current_user is owner of the classroom' do
        session[:user_id] = owner.id
        expect(controller.classroom_owner!(classroom)).to eq(nil)
      end

      it 'should redirect if current_user is not owner of the classroom' do
        session[:user_id] = coteacher.id
        expect(controller).to receive(:auth_failed)
        controller.classroom_owner!(classroom)
      end
    end

    describe '#classroom_coteacher' do
      it 'should return nil if current_user is coteacher of the classroom' do
        session[:user_id] = coteacher.id
        expect(controller.classroom_coteacher!(classroom)).to eq(nil)
      end

      it 'should redirect if current_user is not coteacher of the classroom' do
        session[:user_id] = owner.id
        expect(controller).to receive(:auth_failed)
        controller.classroom_coteacher!(classroom)
      end
    end
  end
end
