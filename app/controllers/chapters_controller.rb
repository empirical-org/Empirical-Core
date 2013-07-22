class ChaptersController < ApplicationController
  def index
    @chapters = Chapter.all
  end

  def show
    @chapter = Chapter.find(params[:id])
  end

  def new
    @chapter = Chapter.new
    @chapter.workbook_id = params[:workbook_id]
    @chapter.build_assessment(body: "Please enter some text.")
  end

  def edit
    @chapter = Chapter.find(params[:id])
    @chapter.rule_position_text = '1, 2, 3' if @chapter.rule_position.empty?
    render :new
  end

  def create
    @chapter = Chapter.new(param[:chapter])

    if @chapter.save
      redirect_to @chapter, notice: 'Chapter was successfully created.'
    else
      render :new
    end
  end

  def update
    @chapter = Chapter.find(params[:id])

    if @chapter.update_attributes(params[:chapter])
      redirect_to @chapter, notice: 'Chapter was successfully updated.'
    else
      render :new
    end
  end

  def destroy
    @chapter = Chapter.find(params[:id])

    @chapter.assignments.each do |assignment|
      assignment.scores.each(&:destroy)
      assignment.destroy
    end

    @chapter.destroy
    redirect_to chapters_path
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
