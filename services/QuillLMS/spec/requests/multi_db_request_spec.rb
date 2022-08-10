# frozen_string_literal: true

require 'rails_helper'

class WidgetsController < ApplicationController
  def index
    head :ok
  end

  def show
    head :ok
  end

  def new
    head :ok
  end

  def create
    head :ok
  end

  def edit
    head :ok
  end

  def update
    head :ok
  end

  def destroy
    head :ok
  end
end

RSpec.describe WidgetsController, type: :request do
  let(:widget) { double(:widget, id: 1) }

  before { Rails.application.routes.draw { resources :widgets } }

  after { Rails.application.reload_routes! }

  subject { http_request }

  context 'GET' do
    let(:http_request) { get url }

    describe 'widget#index' do
      let(:url) { '/widgets' }

      it { should_only_read_from_replica }
    end

    describe 'widgets#new' do
      let(:url) { '/widgets/new' }

      it { should_only_read_from_replica }
    end

    describe 'widgets#edit' do
      let(:url) { "/widgets/#{widget.id}/edit" }

      it { should_only_read_from_replica }
    end

    describe 'widgets#show' do
      let(:url) { "/widgets/#{widget.id}" }

      it { should_only_read_from_replica }
    end
  end

  context 'POST' do
    let(:http_request) { post url, params: {} }

    describe 'widgets#create' do
      let(:params) { {} }
      let(:url) { '/widgets' }

      it { should_only_write_to_primary }
    end
  end

  context 'PUT' do
    let(:http_request) { put url, params: {} }

    describe 'widgets#update' do
      let(:url) { "/widgets/#{widget.id}" }

      it { should_only_write_to_primary }
    end
  end

  context 'PATCH' do
    let(:http_request) { patch url, params: {} }

    describe 'widgets#update' do
      let(:url) { "/widgets/#{widget.id}" }

      it { should_only_write_to_primary }
    end
  end

  context 'DELETE' do
    let(:http_request) { delete url }

    describe 'widgets#destroy' do
      let(:url) { "/widgets/#{widget.id}" }

      it { should_only_write_to_primary }
    end
  end

  def should_only_read_from_replica
    subject
    expect(request.session[:db_selection_methods]).to eq [:read_from_replica]
  end

  def should_only_write_to_primary
    subject
    expect(request.session[:db_selection_methods]).to eq [:write_to_primary]
  end
end
