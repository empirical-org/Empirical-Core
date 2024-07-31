# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TranslatedTextsController, type: :controller do
  let(:staff_user) { create(:user, role: 'staff') }
  let(:regular_user) { create(:user) }

  before do
    allow(controller).to receive(:signed_in?) { true }
    allow(controller).to receive(:current_user) { current_user }
  end

  describe 'GET #index' do
    context 'when user is staff' do
      let(:current_user) { staff_user }

      before do
        get :index
      end

      it 'returns a successful response' do
        expect(response).to be_successful
      end

      it 'assigns @translated_texts' do
        expect(assigns(:translated_texts)).to be_a(ActiveRecord::Relation)
      end

      it 'renders the index template' do
        expect(response).to render_template(:index)
      end

      it 'assigns @js_file' do
        expect(assigns(:js_file)).to eq("entrypoints/snippets/translated_text.ts")
      end

      it 'assigns @locales' do
        locales = ["es-la", "zh-cn"]
        locales.each { |locale| create(:translated_text, locale:) }
        get :index
        expect(assigns(:locales)).to match_array(locales)
      end

      context 'a locale parameter is passed in' do
        let(:locale) { 'es-la' }
        let!(:es_text) { create(:translated_text, locale:) }
        let!(:zh_text) { create(:translated_text, locale: "zh-cn") }

        before do
          get :index, params: { locale: }
        end

        it 'assigns translated_texts for that locale' do
          expect(assigns(:translated_texts)).to include(es_text)
        end

        it 'does not add translated_texts for other locales' do
          expect(assigns(:translated_texts)).not_to include(zh_text)
        end
      end
    end

    context 'when user is not staff' do
      let(:current_user) { regular_user }

      before do
        get :index
      end

      it 'redirects to new_session_path' do
        expect(response).to redirect_to(new_session_path)
      end
    end
  end

  describe 'PATCH #update' do
    let(:translated_text) { create(:translated_text) }

    context 'when user is staff' do
      let(:current_user) { staff_user }

      context 'with valid params' do
        let(:new_translation) { 'Updated translation' }

        it 'updates the requested translated_text' do
          patch :update, params: { id: translated_text.id, translated_text: { translation: new_translation } }
          translated_text.reload
          expect(translated_text.translation).to eq(new_translation)
        end

        it 'renders a JSON response with success true' do
          patch :update, params: { id: translated_text.id, translated_text: { translation: new_translation } }
          expect(response.content_type).to include('application/json')
          expect(JSON.parse(response.body)['success']).to be true
        end

        it 'returns the new translation' do
          patch :update, params: { id: translated_text.id, translated_text: { translation: new_translation } }
          expect(response.content_type).to include('application/json')
          expect(JSON.parse(response.body)['translation']).to eq(new_translation)
        end
      end

      context 'with invalid params' do
        it 'renders a JSON response with errors' do
          patch :update, params: { id: translated_text.id, translated_text: { translation: '' } }
          expect(response.content_type).to include('application/json')
          expect(response).to have_http_status(:unprocessable_entity)
          expect(JSON.parse(response.body)['success']).to be false
          expect(JSON.parse(response.body)['errors']).to be_present
        end
      end
    end

    context 'when user is not staff' do
      let(:current_user) { regular_user }

      before do
        patch :update, params: { id: translated_text.id, translated_text: { translation: 'New translation' } }
      end

      it 'redirects to new_session_path' do
        expect(response).to redirect_to(new_session_path)
      end
    end
  end
end
