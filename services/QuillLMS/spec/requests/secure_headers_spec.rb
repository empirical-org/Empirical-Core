# frozen_string_literal: true

require 'rails_helper'

class DummyController < ApplicationController
  def index
    cookies['foo'] = 'bar'
    render json: {}
  end
end

describe DummyController, type: :request do
  before do
    Rails.application.routes.draw do
      get '/dummy', to: 'dummy#index'
    end
  end

  after do
    Rails.application.reload_routes!
  end

  it 'should flag all cookies as HttpOnly' do
    get '/dummy'
    expect(response.header['Set-Cookie']).to match('HttpOnly')
  end

  it 'should set cache control headers' do
    get '/dummy'
    expect(response.header['Cache-Control']).to match('no-store')
    expect(response.header['Pragma']).to match('no-cache')
  end

  it 'should have a content security policy, both real and report-only' do
    get '/dummy'
    expect(response.header['Content-Security-Policy']).to_not be nil
  end
end
