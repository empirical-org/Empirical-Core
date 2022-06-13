# frozen_string_literal: true

require 'rails_helper'

describe NewRelicAttributable, type: :controller do
  controller(ApplicationController) do
    include NewRelicAttributable

    def index
      head :ok
    end
  end

  let(:user) { create(:user) }

  before do
    routes.draw { get :index, to: "anonymous#index" }
  end

  context "with current user" do
    it 'should pass user_id to NewRelic' do
      allow(controller).to receive(:current_user) { user }
      expect(::NewRelic::Agent).to receive(:add_custom_attributes).with({user_id: user.id})

      get :index
    end
  end

  context "without current user" do
    it 'should pass nil user_id to NewRelic' do
      allow(controller).to receive(:current_user) { nil }
      expect(::NewRelic::Agent).to receive(:add_custom_attributes).with({user_id: nil})

      get :index
    end
  end

  context 'Evidence engine' do
    controller(Evidence::ApiController) do

      def index
        head :ok
      end
    end

    it 'should pass user_id to NewRelic' do
      allow(controller).to receive(:current_user) { user }
      expect(::NewRelic::Agent).to receive(:add_custom_attributes).with({user_id: user.id})
      get :index
    end
  end
end
