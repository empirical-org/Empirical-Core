require 'kaminari'

class CMS::BaseController < ApplicationController
  before_filter :admin!
  before_filter :set_active
  layout 'cms'

  before_filter :find_record, only: [:show, :edit, :update, :destroy]
  before_filter :set_element_variable, only: [:show, :edit, :update, :destroy]
  respond_to :html, :json

  def index
    @records = if params[:search].blank?
      subject.order('id asc')        .page(params[:page]).per(100)
    else
      subject.search(params[:search]).page(params[:page]).per(100)
    end

    set_collection_variable
    respond_with(@records)
  end

  def new
    @record = subject.new
    set_element_variable
    respond_with(@record)
  end

  def create
    @record = subject.new(subject_params)
    @record.author = current_user if @record.respond_to?(:author=)
    @record.save
    set_element_variable
    respond_with @record
  end

  def show
    respond_with @record
  end

  def edit
    respond_with @record
  end

  def update
    @record.update_attributes subject_params
    respond_with @record
  end

  def destroy
    @record.destroy
    respond_with @record
  end

  protected

  def respond_with object
    super :cms, object
  end

  def find_record
    @record = subject.find(params[:id])
  end

  def set_collection_variable
    instance_variable_set :"@#{subject.model_name.collection}", @records
  end

  def set_element_variable
    instance_variable_set :"@#{subject.model_name.element}", @record
  end

  def admin!
    unless signed_in? && current_user.role.admin?
      auth_failed
    end
  end

  def set_active
    @active_page = /cms/
  end
end
