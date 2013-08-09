class CMS::PagesController < ApplicationController
  def show
    @page = CMS::Configuration.pages.find{|p| p.name == params[:page]}
  end

  def static_page
    render "pages/#{params[:page]}"
  end
end
