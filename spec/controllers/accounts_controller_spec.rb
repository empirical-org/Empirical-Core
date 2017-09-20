require 'rails_helper'

describe AccountsController, type: :controller do
  it 'should allow session role to become student or teacher but not staff' do
    post :role, role: 'staff'
    expect(@request.session[:role]).to eq(nil)
    post :role, role: 'student'
    expect(@request.session[:role]).to eq('student')
    post :role, role: 'teacher'
    expect(@request.session[:role]).to eq('teacher')
  end
end
