# frozen_string_literal: true

class TranslatedTextsController < ApplicationController
  before_action :staff!

  def index
    @translated_texts = TranslatedText
      .all
      .includes(:english_text, :translation_mappings)
      .page(params[:page])
      .per(200)

    @js_file = "entrypoints/snippets/translated_text.ts"
  end

  def update
    @translated_text = TranslatedText.find(params[:id])
    translated_text_params = params.require(:translated_text).permit(:translation)

    if @translated_text.update(translated_text_params)
      render json: { success: true, translation: @translated_text.translation }
    else
      render json: { success: false, errors: @translated_text.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
