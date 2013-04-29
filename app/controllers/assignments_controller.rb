class AssignmentsController < ApplicationController
  # GET /assignments
  # GET /assignments.json
  def index
    @assignments = Assignment.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @assignments }
    end
  end

  # GET /assignments/1
  # GET /assignments/1.json
  def show
    @assignment = Assignment.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @assignment }
    end
  end

  # GET /assignments/new
  # GET /assignments/new.json
  def new
    @assignment = Assignment.new
    @user = params[:user_id]
    @chapter = params[:chapter_id]
    @classcode = params[:classcode]

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @assignment }
    end
  end

  # GET /assignments/1/edit
  def edit
    @assignment = Assignment.find(params[:id])
  end

  # POST /assignments
  # POST /assignments.json
  def create
    @assignment = Assignment.new(params[:assignment])
    @assignment.user_id = params[:user_id]
    @assignment.classcode = params[:classcode]
    @assignment.chapter_id = params[:chapter_id]


    respond_to do |format|
      if @assignment.save
        User.all.each do |student|
          if student.role == "user" && student.classcode == @assignment.classcode
            @score = Score.new(:user_id => student.id, :assignment_id => @assignment.id)
            @score.save
            #should add error handling here
          end
        end
        format.html { redirect_to profile_path, notice: 'Assignment was successfully created.' }
        format.json { render json: @assignment, status: :created, location: @assignment }
      else
        format.html { render action: "new" }
        format.json { render json: @assignment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /assignments/1
  # PUT /assignments/1.json
  def update
    @assignment = Assignment.find(params[:id])

    respond_to do |format|
      if @assignment.update_attributes(params[:assignment])
        format.html { redirect_to @assignment, notice: 'Assignment was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @assignment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /assignments/1
  # DELETE /assignments/1.json
  def destroy
    @assignment = Assignment.find(params[:id])
    @assignment.scores.each do |score|
      score.destroy
    end
    @assignment.destroy

    respond_to do |format|
      format.html { redirect_to profile_path, notice: 'Assignment was deleted.' }
      format.json { head :no_content }
    end
  end
end
