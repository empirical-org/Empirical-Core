# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasInstancesController do
  subject { post canvas_instances_path, params: params }

  let(:params) { {} }

  before do
    allow(User).to receive(:find).with(user.id).and_return(user)
    sign_in user
  end

  context 'user is a student' do
    let(:user) { create(:student) }

    it { expect(subject).to redirect_to new_session_path }
  end

  context 'user is a teacher' do
    let(:user) { create(:teacher) }

    it { expect(subject).to redirect_to new_session_path }
  end

  # context 'user is an admin' do
  #   let(:user) { create(:admin) }

  #   context 'nil url' do

  #   end
  # end
end
