# frozen_string_literal: true

require 'rails_helper'

class FakeController < ApplicationController
  include QuillAuthentication
end

describe FakeController, type: :controller do

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
end
