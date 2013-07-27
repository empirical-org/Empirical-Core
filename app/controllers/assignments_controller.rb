class AssignmentsController < ApplicationController
  def index
    @assignments = Assignment.all
  end

  def show
    @assignment = Assignment.find(params[:id])
  end

  def new
    @assignment = Assignment.new
    @user       = params[:user_id]
    @chapter    = params[:chapter_id]
    @classcode  = params[:classcode]
  end

  def edit
    @assignment = Assignment.find(params[:id])
  end

  def create
    @assignment = Assignment.new(params[:assignment])
    @assignment.user_id    = params[:user_id]
    @assignment.classcode  = params[:classcode]
    @assignment.chapter_id = params[:chapter_id]

    if @assignment.save
      User.where(role: 'student', classcode: @assignment.classcode)
        student.scores.create(assignment_id: @assignment.id)
      end

      redirect_to profile_path, notice: 'Assignment was successfully created.'
    else
      render :new
    end
  end

  def update
    @assignment = Assignment.find(params[:id])

    if @assignment.update_attributes(params[:assignment])
      redirect_to @assignment, notice: 'Assignment was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    Assignment.find(params[:id]).destroy
    redirect_to profile_path, notice: 'Assignment was deleted.'
  end
end
