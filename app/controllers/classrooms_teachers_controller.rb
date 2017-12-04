class ClassroomsTeachersController < ApplicationController
  before_action :signed_in!

  def edit_coteacher_form
    # @classrooms_user_coteachers_with_a_specific_teacher = current_user.classrooms_i_coteach_with_a_specific_teacher(params[:coteacher_id])
    # if @classrooms_user_coteachers_with_a_specific_teacher.any?
    #   @coteacher_name = User.find(params[:coteacher_id]).pluck(:name)
    # end
    classrooms_and_coteachers = ActiveRecord::Base.connection.execute("
      SELECT classrooms.id AS classroom_id, classrooms.name AS classroom_name, coteachers.name AS coteacher_name, coteachers.id AS coteacher_id
        FROM classrooms_teachers AS my_classrooms_teachers
        LEFT JOIN classrooms_teachers AS coteacher_classrooms_teachers
          ON coteacher_classrooms_teachers.classroom_id = my_classrooms_teachers.classroom_id
          AND coteacher_classrooms_teachers.role = 'coteacher'
        LEFT JOIN users AS coteachers ON coteacher_classrooms_teachers.user_id = coteachers.id
        JOIN classrooms ON classrooms.id = my_classrooms_teachers.classroom_id
        WHERE my_classrooms_teachers.role = 'owner' AND my_classrooms_teachers.user_id = #{current_user.id}
    ").to_a
    @classrooms_grouped_by_coteacher_id = Hash.new {|h,k| h[k] = [] }
    @classrooms = classrooms_and_coteachers.map do |classy|
                    if classy["coteacher_id"]
                      @classrooms_grouped_by_coteacher_id[classy["coteacher_id"]].push(classy["classroom_id"])
                    end
                    {id: classy["classroom_id"], name: classy["classroom_name"]}
                  end
    @classrooms.uniq!
    @classrooms
  end


end
