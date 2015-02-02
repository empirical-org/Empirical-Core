class Teachers::UnitsController < ApplicationController
  #before_action :setup



  def create
	  # TODO refactor models to get rid of classroom_activity, its unneccessary
    
    # create a unit
    unit = Unit.create name: params[:unit_name]

    # create a classroom_activity
    x1 = params[:pairs_of_activity_id_and_due_date]
    (JSON.parse(x1)).each do |pair|
      due_date = pair['due_date']
      activity_id = pair['activity_id']
      classrooms = JSON.parse(params[:selected_classrooms])
      classrooms.each do |classroom|
        student_ids = (classroom['all_students'] == true) ? nil : classroom['student_ids']
        unit.classroom_activities.create activity_id: activity_id, classroom_id: classroom['classroom_id'], assigned_student_ids: student_ids, due_date: due_date
      end
    end

    # activity_sessions in the state of 'unstarted' are automatically created in an after_create callback in the classroom_activity model
    AssignActivityWorker.perform_async(current_user.id) # current_user should be the teacher
    redirect_to teachers_classroom_scorebook_path(current_user.classrooms.first)

  end








  # def create
  #   @classroom.units.create_next
  #   redirect_to teachers_classroom_lesson_planner_path(@classroom)
  # end

# protected

#   def setup
#     @classroom = current_user.classrooms.find(params[:classroom_id])
#   end
end
