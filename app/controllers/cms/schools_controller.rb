class Cms::SchoolsController < ApplicationController
  before_filter :signed_in!
  before_filter :staff!

  # This allows staff members to view and search through schools.
  def index

  end

  # This allows staff members to drill down on a specific school, including
  # viewing an index of teachers at this school.
  def show

  end

  # This allows staff members to edit certain details about a school.
  def edit

  end

  # This allows staff members to create a new school.
  def new

  end

  # TODO: subscriptions manager?

  private
  def school_query
    
  end
end
