require 'rails_helper'

describe Units::Updater do
  include_context 'Unit Assignments Variables'

  let!(:unit) { FactoryGirl.create(:unit, user_id: teacher.id)}
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
  # self.run(unit, activities_data, classrooms_data)
  describe 'the unit' do
    it "gets hide_if_no_visible_classroom_activities called on it" do
      expect(unit).to receive(:hide_if_no_visible_classroom_activities)
      classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
      Units::Updater.run(unit, activities_data, classrooms_data)
    end
  end


  describe "the updated classroom_activity's" do

    context 'assigned_student_ids array overwrites when the old array was' do

        describe 'assigned to all students' do
          def update_ca_to_all_assigned
            ca_with_unit.update(assigned_student_ids: [])
            classroom_activity
          end

          before(:each) do
            update_ca_to_all_assigned
          end

          it "is still assigned to all students if an empty array is passed" do
            classrooms_data = [{id: classroom.id, student_ids: []}]
            Units::Updater.run(unit, activities_data, classrooms_data)
            expect(classroom_activity.reload.assigned_student_ids).to eq([])
          end

          it "replaces the old array if some students are passed" do
            classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
            Units::Updater.run(unit, activities_data, classrooms_data)
            expect(classroom_activity.reload.assigned_student_ids).to eq([student.id])
          end

          it "archives the classroom activity if passed false" do
            classrooms_data = [{id: classroom.id, student_ids: false}]
            Units::Updater.run(unit, activities_data, classrooms_data)
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
            Units::Updater.run(unit, activities_data, classrooms_data)
            expect(classroom_activity.reload.assigned_student_ids).to eq([])
          end

          it "replaces the old array if different students are passed" do
            classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
            Units::Updater.run(unit, activities_data, classrooms_data)
            expect(classroom_activity.reload.assigned_student_ids).to eq([student.id])
          end

          it "archives the classroom activity if passed false" do
            classrooms_data = [{id: classroom.id, student_ids: false}]
            Units::Updater.run(unit, activities_data, classrooms_data)
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
        Units::Updater.run(unit, activities_data, classrooms_data)
        expect(ClassroomActivity.count).to eq(initial_count)
      end

      it 'with an entire class of assigned students' do
        classrooms_data = [{id: classroom.id, student_ids: []}]
        Units::Updater.run(unit, activities_data, classrooms_data)
        expect(ClassroomActivity.all.last.assigned_student_ids).to eq([])
      end

      it 'with some assigned students' do
        classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
        Units::Updater.run(unit, activities_data, classrooms_data)
        expect(ClassroomActivity.all.last.assigned_student_ids).to eq([student.id])
      end

      it 'with a new activity if it does not already exist' do
        expect(ClassroomActivity.where(activity_id: activity1).count).to eq(0)
        classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
        activities_data = [{id: activity1.id, due_date: nil}]
        Units::Updater.run(unit, activities_data, classrooms_data)
        expect(ClassroomActivity.where(activity_id: activity1).count).to eq(1)
      end

    end


    describe 'new or updated activity sessions' do

      before(:each) do
        ca_with_unit
        classroom.students.push(student1, student2, student)
      end

      context 'when assigned students are changed' do

        it 'gives newly assigned students an activity session' do
           classrooms_data = [{id: classroom.id, student_ids: [student.id, student1.id, student2.id]}]
           Units::Updater.run(unit, activities_data, classrooms_data)
           assigned_users = classroom_activity.reload.activity_sessions.map(&:user_id)
           expect(assigned_users).to include(student1.id, student2.id)
        end

        it 'hides the activity session of unassigned students' do
          classrooms_data = [{id: classroom.id, student_ids: [student1.id, student2.id]}]
          Units::Updater.run(unit, activities_data, classrooms_data)
          student_as_visibility = ActivitySession.unscoped.where(user_id: student.id).first.visible
          expect(student_as_visibility).to eq(false)
        end

        it 'can add all students in a classroom' do
          classrooms_data = [{id: classroom.id, student_ids: []}]
          Units::Updater.run(unit, activities_data, classrooms_data)
          assigned_users = classroom_activity.reload.activity_sessions.map(&:user_id)
          expect(assigned_users).to include(student1.id, student2.id, student.id)
        end

        it 'can unnassign some students and assign new students' do
          expect(classroom_activity.activity_sessions).to eq(student.activity_sessions)
          classrooms_data = [{id: classroom.id, student_ids: [student1.id]}]
          Units::Updater.run(unit, activities_data, classrooms_data)
          assigned_users = classroom_activity.reload.activity_sessions.map(&:user_id)
          expect(assigned_users).to include(student1.id)
          expect(assigned_users).not_to include(student.id)
        end

        it "does not affect the activity session of existing students" do
          expect(classroom_activity.activity_sessions).to eq(student.activity_sessions)
          classrooms_data = [{id: classroom.id, student_ids: [student.id, student1.id, student2.id]}]
          Units::Updater.run(unit, activities_data, classrooms_data)
          assigned_users = classroom_activity.reload.activity_sessions.map(&:user_id)
          expect(assigned_users).to include(student.id)
        end

        it "hides all activity sessions when assigned to no students" do
          expect(classroom_activity.activity_sessions).to eq(student.activity_sessions)
          classrooms_data = [{id: classroom.id, student_ids: false}]
          Units::Updater.run(unit, activities_data, classrooms_data)
          assigned_users = classroom_activity.reload.activity_sessions
          expect(assigned_users).to be_empty
        end

      end

      context 'when a new activity is added' do

        it "creates new activity sessions with new activity for assigned students" do
          expect(student.activity_sessions.map(&:activity_id)).to eq([activity.id])
          classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
          activities_data = [{id: activity1.id, due_date: nil}]
          Units::Updater.run(unit, activities_data, classrooms_data)
          expect(student.reload.activity_sessions.map(&:activity_id).sort).to eq([activity.id, activity1.id].sort)
        end

        it "does not creates new activity sessions with new activity for non-assigned students" do
          classrooms_data = [{id: classroom.id, student_ids: [student.id]}]
          activities_data = [{id: activity1.id, due_date: nil}]
          Units::Updater.run(unit, activities_data, classrooms_data)
          expect(student1.activity_sessions.count).to eq(0)
        end

      end



    end



  end






  #TODO: find out if this code is worth salvaging
  # let!(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  #
  # let!(:old_kept_activity) { FactoryGirl.create(:activity) }
  # let!(:old_kept_activity_old_due_date) { Date.yesterday }
  #
  # let!(:old_removed_activity) { FactoryGirl.create(:activity) }
  # let!(:new_activity) { FactoryGirl.create(:activity) }
  #
  # let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  #
  # let!(:student1) { FactoryGirl.create(:user, role: 'student', classrooms: [classroom]) }
  # let!(:student2) { FactoryGirl.create(:user, role: 'student', classrooms: [classroom]) }
  #
  # let!(:old_assigned_student_ids) { [student1.id] }
  #
  # let!(:unit) { FactoryGirl.create(:unit, name: 'old_name')}
  # let!(:id) { unit.id }
  #
  # let!(:old_classroom_activity1) { FactoryGirl.create(:classroom_activity,
  #                                                     activity: old_kept_activity,
  #                                                     due_date: old_kept_activity_old_due_date,
  #                                                     assigned_student_ids: old_assigned_student_ids,
  #                                                     classroom: classroom,
  #                                                     unit: unit) }
  #
  # let!(:old_classroom_activity2) { FactoryGirl.create(:classroom_activity,
  #                                                     activity: old_removed_activity,
  #                                                     due_date: Date.yesterday,
  #                                                     assigned_student_ids: old_assigned_student_ids,
  #                                                     classroom: classroom,
  #                                                     unit: unit) }
  #
  # let!(:new_name) { 'new_name' }
  #
  # let!(:old_kept_activity_new_due_date) { Date.today }
  # let!(:new_activity_due_date) { Date.today }
  #
  # let!(:new_assigned_student_ids) { [student2.id] }
  #
  # let!(:activities_data) do
  #   [
  #     {
  #       id: old_kept_activity.id,
  #       due_date: old_kept_activity_new_due_date
  #     },
  #     {
  #       id: new_activity.id,
  #       due_date: new_activity_due_date
  #     }
  #   ]
  # end
  #
  # let!(:classrooms_data) do
  #   [
  #     {
  #       id: classroom.id,
  #       student_ids: new_assigned_student_ids
  #     }
  #   ]
  # end
  #
  #
  # def subject
  #   Units::Updater.run(teacher, id, new_name, activities_data, classrooms_data)
  # end
  #
  # it 'updates the units name' do
  #   subject
  #   expect(Unit.find(id).name).to eq(new_name)
  # end
  #
  # it 'creates classroom_activity for new activity' do
  #   subject
  #   x = unit.classroom_activities.find_by(classroom: classroom, activity: new_activity)
  #   expect(x).to be_present
  # end
  #
  # it 'updates due date for old kept activity' do
  #   subject
  #   expect(old_classroom_activity1.reload.due_date).to eq(old_kept_activity_new_due_date)
  # end
  #
  # it 'updates assigned_student_ids for old kept activity' do
  #   subject
  #   expect(old_classroom_activity1.reload.assigned_student_ids).to eq(new_assigned_student_ids)
  # end
  #
  # it 'creates a new classroom activity for the new activity' do
  #   subject
  #   x = unit.classroom_activities.find_by(classroom: classroom, activity: new_activity)
  #   expect(x).to be_present
  # end
  #
  # it 'hides the classroom activity associated with the old removed activity' do
  #   subject
  #   x = unit.classroom_activities.find_by(classroom: classroom, activity: old_removed_activity)
  #   expect(x).to be_nil
  #   expect(ClassroomActivity.find_by(id: old_classroom_activity2.id)).to be_nil
  # end
  #
  # it 'hides the activity session associated to the removed activity' do
  #   subject
  #   as = ActivitySession.where(classroom_activity: old_classroom_activity2)
  #   expect(as).to be_empty
  # end
  #
  # it 'hides the activity session associated to the unassigned student (on the old, kept activity)' do
  #   subject
  #   as = old_classroom_activity1.activity_sessions.find_by(user: student1)
  #   expect(as).to be_nil
  # end
  #
  # it 'creates the activity session associated to the newly assigned student (on the old, kept activity)' do
  #   subject
  #   ca = ClassroomActivity.find_by(activity: old_kept_activity, classroom: classroom)
  #   as = ca.activity_sessions.find_by(user: student2)
  #   expect(as).to be_present
  # end
  #
  # it 'creates the activity session associated to the new activity' do
  #   subject
  #   ca = ClassroomActivity.find_by(classroom: classroom, activity: new_activity)
  #   as = ca.activity_sessions.find_by(user: student2)
  #   expect(as).to be_present
  # end
