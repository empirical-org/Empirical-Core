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

  def module
    session[:uid] = params[:uid]
    session[:cid] = params[:cid]
    session[:student] = params[:student]

    redirect_to ''
  end

protected

  def quill_iframe
    response.headers['X-Frame-Options'] = "ALLOW-FROM #{root_url}"
  end
end
