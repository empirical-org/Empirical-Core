# frozen_string_literal: true

require 'rails_helper'

describe StudentsClassroomsController, type: :controller do
  describe '#create' do
    context 'when current user exists' do
      let(:user) { create(:user, role: User::STUDENT) }

      before do
        allow(controller).to receive(:current_user) { user }
      end

      context 'when classroom is found' do
        let!(:classroom) { create(:classroom) }

        it 'should kick off the students to classroom associator and join classroom worker' do
          expect(StudentJoinedClassroomWorker).to receive(:perform_async)
          # There's a weird setup here where this Associator calls `save` if
          # it creates a new record, and there's an `after_save` hook on the
          # model that that triggers the Associator a second time.
          expect(Associators::StudentsToClassrooms).to receive(:run).with(user, classroom).twice.and_call_original
          post :create, params: { classcode: classroom.code }
          expect(JSON.parse(response.body)).to eq classroom.reload.as_json
        end

        it 'should set visibility to true, but not kick off a join classroom worker if a record already exists' do
          sc = create(:students_classrooms, student: user, classroom: classroom, visible: false)

          expect(StudentJoinedClassroomWorker).not_to receive(:perform_async)
          # There's a weird setup here where this Associator calls `save` if
          # it creates a new record, and there's an `after_save` hook on the
          # model that that triggers the Associator a second time.
          expect(Associators::StudentsToClassrooms).to receive(:run).with(user, classroom).twice.and_call_original
          expect do
            post :create, params: { classcode: classroom.code }
          end.to not_change(StudentsClassrooms.unscoped, :count)
          expect(sc.reload.visible).to be(true)
        end
      end

      context 'when classroom is not found' do
        context 'when classroom is archived' do
          let!(:classroom) { create(:classroom, visible: false) }

          it 'should return that class is archived' do
            post :create, params: { classcode: classroom.code }
            expect(response.body).to eq({error: "Class is archived"}.to_json)
            expect(response.code).to eq "400"
          end
        end

        context 'when classroom does not exist' do
          it 'should return the class does not exist' do
            post :create, params: { classcode: "some_code" }
            expect(response.body).to eq({error: "No such classcode"}.to_json)
            expect(response.code).to eq "404"
          end
        end
      end
    end

    context 'when current user does not exist' do
      it 'should return not logged in' do
        post :create, params: { classcode: "some_code" }
        expect(response.body).to eq({error: "Student not logged in."}.to_json)
        expect(response.code).to eq "403"
      end
    end
  end

  # describe '#hide' do
  #   let(:student) { create(:student) }
  #   let!(:student_classroom) { StudentsClassrooms.create!(student: student, classroom: create(:classroom)) }
  #
  #   before do
  #     allow(controller).to receive(:current_user) { student }
  #   end
  #
  #   it 'should find the classroom and hide it' do
  #     student_classroom.update(visible: false)
  #     post :hide, id: student_classroom.id
  #     expect(student_classroom.reload.visible).to eq false
  #   end
  # end
end
