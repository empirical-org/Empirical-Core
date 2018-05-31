require 'factory_bot_rails'
require 'faker'

class FactoriesController < ApplicationController
  respond_to :json
  rescue_from Exception, with: :show_errors

  def create
    render json: FactoryBot.create(factory, *traits, attributes).to_json
  end

  def create_list
    render json: FactoryBot.create_list(factory, number, *traits, attributes).to_json
  end

  def destroy_all
    unless Rails.env.production? || Rails.env.development?
      tables = ActiveRecord::Base.connection.tables
      tables.delete 'schema_migrations'
      tables.each do |table|
        table_name = ActionController::Base.helpers.sanitize(table)
        ActiveRecord::Base.connection.execute("TRUNCATE #{table_name} CASCADE")
      end
      render json: {}, status: 204
    else
      render json: { error: "Cannot clean database in #{Rails.env} environment" },
        status: 500
    end
  end

  private

  def traits
    if params[:traits].present?
      params[:traits].map { |_key, trait| trait.to_sym }
    end
  end

  def factory
    params[:factory].to_sym
  end

  def attributes
    params.except(:factory, :traits, :controller, :action, :number).symbolize_keys
  end

  def number
    params[:number].to_i
  end

  def show_errors(exception)
    error_hash = {
      error: "#{exception.class}: #{exception.to_s}",
      backtrace: exception.backtrace.join("\n")
    }

    render json: error_hash, status: :bad_request
  end
end
