# frozen_string_literal: true

require 'rails_helper'

describe Units::Updater do
    include_context 'Unit Assignments Variables'

    let!(:unit) { create(:unit, user_id: teacher.id)}
    let!(:unit_template) { create(:unit_template_with_activities )}
    let!(:unit_based_on_unit_template) { create(:unit, user_id: teacher.id, unit_template_id: unit_template.id)}
    let!(:classroom_unit_for_unit_template) { create(:classroom_unit, classroom_id: classroom.id, unit_id: unit_based_on_unit_template.id, assigned_student_ids: [student.id])}
    # let activities_data = [{id: activity.id, due_date: nil}]
    # classroom_unit.update(unit_id: unit.id)

    def activities_data
      [{id: activity.id, due_date: nil}]
    end

    def cu_with_unit
      classroom_unit.update(unit_id: unit.id)
      classroom_unit
    end

    def ua_with_unit
      unit_activity.update(unit_id: unit.id)
      unit_activity
    end

    # in this file, 'unit' refers to a unit object, 'activities_data' to an array of objects
    # with activity ids and due_dates, and 'classrooms_data' to an array of objects with an id
    # and array of student ids.
    # self.run(unit.id, activities_data, classrooms_data)

    describe "assign_unit_template_to_one_class" do
      context "there are already students assigned to the classroom unit" do
        describe "concatenate_existing_student_ids is true" do

          it 'should add the new student to the array but also keep the old one' do
            classroom_data = {id: classroom.id, student_ids: [student1.id]}
            Units::Updater.assign_unit_template_to_one_class(unit_based_on_unit_template.id, classroom_data, unit_template.id, teacher.id, concatenate_existing_student_ids: true)
            expect(classroom_unit_for_unit_template.reload.assigned_student_ids).to eq([student.id, student1.id])
          end

        end
      end
    end

    describe "the updated classroom_unit's" do

        context 'assigned_student_ids array overwrites when the old array was' do

            describe 'assigned to all students' do
              def update_ca_to_all_assigned
                cu_with_unit.update(assigned_student_ids: [], assign_on_join: true)
                classroom_unit
              end

              before do
                update_ca_to_all_assigned
              end

              it "is still assigned to all students if an empty array is passed" do
                classrooms_data = [{id: classroom.id, student_ids: []}]
                Units::Updater.run(unit.id, activities_data, classrooms_data)
                expect(classroom_unit.reload.assigned_student_ids).to eq([])
              end

              it "replaces the old array if some students are passed" do
                classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
                Units::Updater.run(unit.id, activities_data, classrooms_data)
                expect(classroom_unit.reload.assigned_student_ids).to eq([student.id])
              end

            end

            describe 'assigned to some students' do
              def update_cu_to_some_assigned
                cu_with_unit.update(assigned_student_ids: [student2.id])
                classroom_unit
              end

              before do
                update_cu_to_some_assigned
              end

              it "is assigned to all students if an empty array is passed" do
                classrooms_data = [{id: classroom.id, student_ids: []}]
                Units::Updater.run(unit.id, activities_data, classrooms_data)
                expect(classroom_unit.reload.assigned_student_ids).to eq([])
              end

              it "replaces the old array if different students are passed" do
                classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
                Units::Updater.run(unit.id, activities_data, classrooms_data)
                expect(classroom_unit.reload.assigned_student_ids).to eq([student.id])
              end

              it "archives the classroom activity if passed false" do
                classrooms_data = [{id: classroom.id, student_ids: false}]
                Units::Updater.run(unit.id, activities_data, classrooms_data)
                expect(classroom_unit.reload.visible).to eq(false)
              end

            end

          end

      end

    describe 'when an old classroom activity does not exist a new one is initialized' do
      def hide_ca
        classroom_unit.update(visible: false)
        classroom_unit
      end

      before do
        hide_ca
      end

      it 'unless it does not have assigned students' do
        initial_count = ClassroomUnit.count
        classrooms_data = [{id: classroom.id, student_ids: false}]
        Units::Updater.run(unit.id, activities_data, classrooms_data)
        expect(ClassroomUnit.count).to eq(initial_count)
      end

      it 'with an entire class of assigned students' do
        classrooms_data = [{id: classroom.id, student_ids: []}]
        Units::Updater.run(unit.id, activities_data, classrooms_data)
        expect(ClassroomUnit.all.last.assigned_student_ids).to eq([])
      end

      it 'with some assigned students' do
        classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
        Units::Updater.run(unit.id, activities_data, classrooms_data)
        expect(ClassroomUnit.all.last.assigned_student_ids).to eq([student.id])
      end

      it 'with a new activity if it does not already exist' do
        expect(UnitActivity.where(activity_id: activity1).count).to eq(0)
        classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
        activities_data = [{id: activity1.id, due_date: nil}]
        Units::Updater.run(unit.id, activities_data, classrooms_data)
        expect(UnitActivity.where(activity_id: activity1).count).to eq(1)
      end

    end


    describe 'new or updated activity sessions' do

      before do
        cu_with_unit
        ua_with_unit
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
          ActivitySession.create(
            user_id: student.id,
            activity_id: unit_activity.activity_id,
            classroom_unit_id: classroom_unit.id,
            completed_at: Date.current,
            state: 'finished',
            percentage: 0.8
          )

          classrooms_data = [{id: classroom.id, student_ids: [student1.id, student2.id], assign_on_join: false}]
          Units::Updater.run(unit.id, activities_data, classrooms_data)
          student_as_visibility = ActivitySession.unscoped.where(user_id: student.id).first.visible
          expect(student_as_visibility).to eq(false)
        end

        it 'can add all students in a classroom' do
          classrooms_data = [{id: classroom.id, student_ids: [], assign_on_join: true}]
          Units::Updater.run(unit.id, activities_data, classrooms_data)
          assigned_users = classroom_unit.reload.assigned_student_ids
          expect(assigned_users).to include(student1.id, student2.id, student.id)
        end

        it 'can unnassign some students and assign new students' do
          classrooms_data = [{id: classroom.id, student_ids: [student1.id]}]
          old_assigned_student_ids = classroom_unit.assigned_student_ids
          expect(old_assigned_student_ids).to eq([student.id])
          Units::Updater.run(unit.id, activities_data, classrooms_data)
          new_assigned_student_ids = classroom_unit.reload.assigned_student_ids
          expect(new_assigned_student_ids).to eq([student1.id])
        end

        it "hides all activity sessions when assigned to no students" do
          expect(classroom_unit.assigned_student_ids.any?).to eq(true)
          classrooms_data = [{id: classroom.id, student_ids: false}]
          Units::Updater.run(unit.id, activities_data, classrooms_data)
          assigned_users = classroom_unit.reload.activity_sessions
          expect(assigned_users).to be_empty
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
