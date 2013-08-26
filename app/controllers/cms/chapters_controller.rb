class CMS::ChaptersController < ApplicationController
  def index
    @chapters = Chapter.all
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
    @chapter = Chapter.new(chapter_params)

    if @chapter.save
      redirect_to chapters_path, notice: 'Chapter was successfully created.'
    else
      render :new
    end
  end

  def update
    @chapter = Chapter.find(params[:id])

    if @chapter.update_attributes(chapter_params)
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

  protected

  def chapter_params
    params.require(:chapter).permit!
  end
end
