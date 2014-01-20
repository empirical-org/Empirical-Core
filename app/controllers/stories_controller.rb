class StoriesController < ApplicationController
  layout 'questions_module'
  before_filter :quill_iframe

  def form
    @story = Story.new(_uid: params[:uid], _cid: params[:cid])
  end

  def save
    @story = Story.new(params[:story])

    unless @story.save
      render :form
    end
  end

protected

  def quill_iframe
    response.headers['X-Frame-Options'] = "ALLOW-FROM #{root_url}"
  end
end
