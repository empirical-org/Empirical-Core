# frozen_string_literal: true

require 'rails_helper'

describe RailsAdmin::MainController, type: :controller do
  routes { RailsAdmin::Engine.routes }

  context 'as an admin' do
    describe '#index' do
      it 'should not raise an error on queries of type string' do
        expect do
          get :index, params: { model_name: 'activity', query: 'example_string_query_param', utf8: true}
        end.to_not raise_error
      end
    end
  end
end
