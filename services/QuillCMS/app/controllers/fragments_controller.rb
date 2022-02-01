class FragmentsController < ApplicationController

  def is_sentence
    response = HTTParty.post(
      "#{ENV['QUILL_NLP_URL']}/sentence_or_not",
      :body => {
        :text => params[:text],
      })
    puts response.code
    render json: response.body
  end

end