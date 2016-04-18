class StudentsClassroomsController < ApplicationController

    def create
      @user = current_user
      classcode = params[:classcode]
      begin
        classroom = Classroom.where(code: classcode).first
        Associators::StudentsToClassrooms.run(@user, classroom)
        JoinClassroomWorker.perform_async(@user.id)
      rescue NoMethodError => exception
        render json: {error: "No such classcode"}, status: 400
      else
        render json: classroom.attributes
      end
    end

    def hide
      sc = StudentsClassrooms.find(params[:id])
      sc.update(visible: false)
      render json: sc
    end

    def unhide
      sc = StudentsClassrooms.unscoped.find(params[:id])
      sc.update(visible: true)
      render json: sc
    end

    def teacher_hide
      row = StudentsClassrooms.where(student_id: params[:student_id], classroom_id: params[:classroom_id]).first
      row.update(visible: false)
      redirect_to teachers_classrooms_path
    end

    def add_classroom
      render :add_classroom
    end

    def classroom_manager
      render :students_classroom_manager
    end

    def classroom_manager_data
      begin
      active = current_user.students_classrooms
        .includes(classroom: :teacher)
        .map(&:students_classrooms_manager)
      inactive = StudentsClassrooms.unscoped
        .where(student_id: current_user.id, visible: false)
        .includes(classroom: :teacher)
        .map(&:students_classrooms_manager)
      rescue NoMethodError => exception
        render json: {error: "No classrooms yet!"}, status: 400
      else
        render json: {active: active, inactive: inactive}
      end
    end


end
