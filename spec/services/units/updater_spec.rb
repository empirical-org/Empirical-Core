require 'rails_helper'

describe Units::Updater do
  include_context 'Unit Assignments Variables'

  let!(:unit) { create(:unit, user_id: teacher.id)}
  # let activities_data = [{id: activity.id, due_date: nil}]
  # classroom_activity.update(unit_id: unit.id)

  def activities_data
      [{id: activity.id, due_date: nil}]
  end

  def ca_with_unit
    classroom_activity.update(unit_id: unit.id)
    classroom_activity
  end


  # in this file, 'unit' refers to a unit object, 'activities_data' to an array of objects
  # with activity ids and due_dates, and 'classrooms_data' to an array of objects with an id
  # and array of student ids.
  # self.run(unit.id, activities_data, classrooms_data)


  describe "the updated classroom_activity's" do

    context 'assigned_student_ids array overwrites when the old array was' do

        describe 'assigned to all students' do
          def update_ca_to_all_assigned
            ca_with_unit.update(assigned_student_ids: [], assign_on_join: true)
            classroom_activity
          end

          before(:each) do
            update_ca_to_all_assigned
          end

          it "is still assigned to all students if an empty array is passed" do
            classrooms_data = [{id: classroom.id, student_ids: []}]
            Units::Updater.run(unit.id, activities_data, classrooms_data)
            expect(classroom_activity.reload.assigned_student_ids).to eq([])
          end

          it "replaces the old array if some students are passed" do
            classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
            Units::Updater.run(unit.id, activities_data, classrooms_data)
            expect(classroom_activity.reload.assigned_student_ids).to eq([student.id])
          end

          it "archives the classroom activity if passed false" do
            classrooms_data = [{id: classroom.id, student_ids: false}]
            Units::Updater.run(unit.id, activities_data, classrooms_data)
            expect(classroom_activity.reload.visible).to eq(false)
          end

        end

        describe 'assigned to some students' do
          def update_ca_to_some_assigned
            ca_with_unit.update(assigned_student_ids: [student2.id])
            classroom_activity
          end

          before(:each) do
            update_ca_to_some_assigned
          end

          it "is assigned to all students if an empty array is passed" do
            classrooms_data = [{id: classroom.id, student_ids: []}]
            Units::Updater.run(unit.id, activities_data, classrooms_data)
            expect(classroom_activity.reload.assigned_student_ids).to eq([])
          end

          it "replaces the old array if different students are passed" do
            classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
            Units::Updater.run(unit.id, activities_data, classrooms_data)
            expect(classroom_activity.reload.assigned_student_ids).to eq([student.id])
          end

          it "archives the classroom activity if passed false" do
            classrooms_data = [{id: classroom.id, student_ids: false}]
            Units::Updater.run(unit.id, activities_data, classrooms_data)
            expect(classroom_activity.reload.visible).to eq(false)
          end

        end

      end

    end

    describe 'when an old classroom activity does not exist a new one is initialized' do
      def hide_ca
        classroom_activity.update(visible: false)
        classroom_activity
      end

      before(:each) do
        hide_ca
      end

      it 'unless it does not have assigned students' do
        initial_count = ClassroomActivity.count
        classrooms_data = [{id: classroom.id, student_ids: false}]
        Units::Updater.run(unit.id, activities_data, classrooms_data)
        expect(ClassroomActivity.count).to eq(initial_count)
      end

      it 'with an entire class of assigned students' do
        classrooms_data = [{id: classroom.id, student_ids: []}]
        Units::Updater.run(unit.id, activities_data, classrooms_data)
        expect(ClassroomActivity.all.last.assigned_student_ids).to eq([])
      end

      it 'with some assigned students' do
        classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
        Units::Updater.run(unit.id, activities_data, classrooms_data)
        expect(ClassroomActivity.all.last.assigned_student_ids).to eq([student.id])
      end

      it 'with a new activity if it does not already exist' do
        expect(ClassroomActivity.where(activity_id: activity1).count).to eq(0)
        classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
        activities_data = [{id: activity1.id, due_date: nil}]
        Units::Updater.run(unit.id, activities_data, classrooms_data)
        expect(ClassroomActivity.where(activity_id: activity1).count).to eq(1)
      end

    end


    describe 'new or updated activity sessions' do

      before(:each) do
        ca_with_unit
        classroom.students.push(student1, student2, student)
      end

      context 'when assigned students are changed' do

        it 'does not give newly assigned students an activity session' do
           classrooms_data = [{id: classroom.id, student_ids: [student.id, student1.id, student2.id]}]
           old_activity_session_count = ActivitySession.count
           Units::Updater.run(unit.id, activities_data, classrooms_data)
           expect(ActivitySession.count).to eq(old_activity_session_count)
        end

        it 'hides the activity session of unassigned students' do
          ActivitySession.create(user_id: student.id, activity_id: classroom_activity.activity, classroom_activity_id: classroom_activity.id, completed_at: Date.today, state: 'finished', percentage: 0.8)
          classrooms_data = [{id: classroom.id, student_ids: [student1.id, student2.id], assign_on_join: false}]
          Units::Updater.run(unit.id, activities_data, classrooms_data)
          student_as_visibility = ActivitySession.unscoped.where(user_id: student.id).first.visible
          expect(student_as_visibility).to eq(false)
        end

        it 'can add all students in a classroom' do
          classrooms_data = [{id: classroom.id, student_ids: [], assign_on_join: true}]
          Units::Updater.run(unit.id, activities_data, classrooms_data)
          assigned_users = classroom_activity.reload.assigned_student_ids
          expect(assigned_users).to include(student1.id, student2.id, student.id)
        end

        it 'can unnassign some students and assign new students' do
          classrooms_data = [{id: classroom.id, student_ids: [student1.id]}]
          old_assigned_student_ids = classroom_activity.assigned_student_ids
          expect(old_assigned_student_ids).to eq([student.id])
          Units::Updater.run(unit.id, activities_data, classrooms_data)
          new_assigned_student_ids = classroom_activity.reload.assigned_student_ids
          expect(new_assigned_student_ids).to eq([student1.id])
        end

        it "hides all activity sessions when assigned to no students" do
          expect(classroom_activity.assigned_student_ids.any?).to eq(true)
          classrooms_data = [{id: classroom.id, student_ids: false}]
          Units::Updater.run(unit.id, activities_data, classrooms_data)
          assigned_users = classroom_activity.reload.activity_sessions
          expect(assigned_users).to be_empty
        end

        it "hides the unit when assigned to no students" do
          expect(Unit.unscoped.find(unit.id).visible).to eq(true)
          classrooms_data = [{id: classroom.id, student_ids: false}]
          Units::Updater.run(unit.id, activities_data, classrooms_data)
          assigned_users = classroom_activity.reload.activity_sessions
          expect(Unit.unscoped.find(unit.id).visible).to eq(false)
        end

      end

      context 'when a new activity is added' do

        it "it does not create new activity sessions" do
          # because it used to create new ones
          expect(student.activity_sessions.map(&:activity_id)).to be_empty
          classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
          activities_data = [{id: activity1.id, due_date: nil}]
          old_activity_session_count = ActivitySession.count
          Units::Updater.run(unit.id, activities_data, classrooms_data)
          expect(ActivitySession.count).to eq(old_activity_session_count)
        end

      end
    end
  end
