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
end
