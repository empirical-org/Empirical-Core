class ChaptersController < ApplicationController
  # GET /chapters
  # GET /chapters.json
  def index
    @chapters = Chapter.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @chapters }
    end
  end

  # GET /chapters/1
  # GET /chapters/1.json
  def show
    @chapter = Chapter.find(params[:id])
    @assessment = @chapter.assessment
    @rules = @chapter.rules
    @lessons = @chapter.lessons

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @chapter }
    end
  end

  # GET /chapters/new
  # GET /chapters/new.json
  def new
    @chapter = Chapter.new
    @workbook = params[:workbook_id]
    @rules = Rule.all

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @chapter }
    end
  end

  # GET /chapters/1/edit
  def edit
    @chapter = Chapter.find(params[:id])
  end

  # POST /chapters
  # POST /chapters.json
  def create
    @chapter = Chapter.new(params[:chapter])
    @chapter.workbook_id = params[:workbook_id]

    respond_to do |format|
      if @chapter.save
        @assessment = Assessment.new(:body => params[:assessment])
        @assessment.chapter_id = @chapter.id
        @assessment.save
        #CREATE ASSESSMENT BASED ON CHAPTER'S ID
        format.html { redirect_to @chapter, notice: 'Chapter was successfully created.' }
        format.json { render json: @chapter, status: :created, location: @chapter }
      else
        format.html { render action: "new" }
        format.json { render json: @chapter.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /chapters/1
  # PUT /chapters/1.json
  def update
    @chapter = Chapter.find(params[:id])

    respond_to do |format|
      if @chapter.update_attributes(params[:chapter])
        format.html { redirect_to @chapter, notice: 'Chapter was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @chapter.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /chapters/1
  # DELETE /chapters/1.json
  def destroy
    @chapter = Chapter.find(params[:id])
    @assignments = @chapter.assignments
    if @assignments.any?
      @assignments.each do |assignment|
        @scores = assignment.scores
        @scores.each do |score|
          score.destroy
        end
        assignment.destroy
      end
    end
    @assessment = @chapter.assessment
    @rules = @chapter.rules
    if @rules.any?
      @rules.each do |rule|
        if rule.lessons.any?
          rule.lessons.each do |lesson|
            lesson.destroy
          end
        end
        rule.destroy
      end
    end
    @chapter.destroy

    respond_to do |format|
      format.html { redirect_to profile_path }
      format.json { head :no_content }
    end
  end

  def next
    @current_chapter = Chapter.find(params[:current_chapter])
    @next_chapter = Chapter.find(@current_chapter.id + 1)
    redirect_to chapter_path(@next_chapter)
    #currently this is workbook-agnostic; will need to revise
  end

  def previous
    @current_chapter = Chapter.find(params[:current_chapter])
    @previous_chapter = Chapter.find(@current_chapter.id - 1)
    redirect_to chapter_path(@previous_chapter)
    #currently this is workbook-agnostic; will need to revise
  end
end
