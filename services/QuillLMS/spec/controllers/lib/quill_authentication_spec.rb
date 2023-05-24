# frozen_string_literal: true

require 'rails_helper'

class FakeController < ApplicationController
  include QuillAuthentication
  include Rails.application.routes.url_helpers

  def profile_path
    "/profile"
  end

  def new_session_path
    '/session/new'
  end

  def example_action
    auth_failed
  end
end

describe FakeController, type: :controller do

  describe '#auth_failed' do
    before do
      Rails.application.routes.draw do
        get '/example_action', to: 'fake#example_action'
      end
    end

    after do
      Rails.application.reload_routes!
    end

    context 'Accept: text/html' do
      it 'should return HTML, status 302' do
        get :example_action
        expect(response).to redirect_to('/profile')
        expect(response.status).to eq 302
      end
    end

    context 'Accept: application/json' do
      it 'should return JSON, status 401' do
        request.accept = "application/json"
        get :example_action
        expect(response.status).to eq 401
        expect(JSON.parse(response.body)).to eq({ "redirect" => "/session/new" })
      end
    end

  end

  describe 'authentication methods' do
    let(:classroom) { create(:classroom, :with_coteacher) }
    let(:coteacher) { classroom.coteachers.first }
    let(:owner) { classroom.owner }
    let(:random_teacher) {create(:teacher)}

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

    describe '#classroom_teacher' do
      it 'should return nil if current_user is coteacher of the classroom' do
        session[:user_id] = coteacher.id
        expect(controller.classroom_teacher!(classroom)).to eq(nil)
      end

      it 'should return nil if current_user is owner of the classroom' do
        session[:user_id] = owner.id
        expect(controller.classroom_teacher!(classroom)).to eq(nil)
      end

      it 'should redirect if current_user is not associated with the classroom via classrooms_teachers' do
        session[:user_id] = random_teacher.id
        expect(controller).to receive(:auth_failed)
        controller.classroom_teacher!(classroom)
      end
    end

    describe '#preview_student_id=' do
      let!(:student) { create(:student) }
      let!(:teacher) { create(:teacher) }

      describe 'if passed a student id' do
        it 'should set the session preview_student_id and the current user to the student' do
          controller.preview_student_id=(student.id)
          expect(session[:preview_student_id]).to eq(student.id)
          expect(controller.current_user).to eq(student)
        end
      end

      describe 'if passed a nil student id' do
        it 'should set the session preview_student_id to nil and the current user to the one saved in the session' do
          session[:user_id] = teacher.id
          controller.preview_student_id=nil
          expect(session[:preview_student_id]).to eq(nil)
          expect(controller.current_user).to eq(teacher)
        end
      end
    end
  end

  describe '#sign_in' do
    let(:user) { create(:user) }

    subject { controller.sign_in(user) }

    it { expect { subject }.to change { session[:user_id] }.from(nil).to(user.id) }

    context 'teacher' do
      before { allow(user).to receive(:teacher?).and_return(true) }

      it do
        expect(TestForEarnedCheckboxesWorker).to receive(:perform_async).with(user.id)
        expect(user).to receive(:update)
        expect(user).not_to receive(:save_user_pack_sequence_items)
        subject
      end
    end

    context 'student' do
      before { allow(user).to receive(:student?).and_return(true) }

      it do
        expect(TestForEarnedCheckboxesWorker).not_to receive(:perform_async)
        expect(user).to receive(:update)
        expect(user).to receive(:save_user_pack_sequence_items)
        subject
      end
    end

    context 'staff impersonating user' do
      before { allow(controller).to receive(:staff_impersonating_user?).and_return(true) }

      it do
        expect(TestForEarnedCheckboxesWorker).not_to receive(:perform_async)
        expect(user).not_to receive(:update)
        expect(user).not_to receive(:save_user_pack_sequence_items)
        subject
      end

    end

    context 'admin impersonating user' do
      before { allow(controller).to receive(:admin_impersonating_user?).and_return(true) }

      it do
        expect(TestForEarnedCheckboxesWorker).not_to receive(:perform_async)
        expect(user).not_to receive(:update)
        expect(user).not_to receive(:save_user_pack_sequence_items)
        subject
      end
    end
  end
end
