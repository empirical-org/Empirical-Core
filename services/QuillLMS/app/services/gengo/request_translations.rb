# frozen_string_literal: true

module Gengo
  class RequestTranslations < ApplicationService
    class RequestTranslationError < StandardError; end
    attr_accessor :english_texts

    STANDARD_COMMENT = "
    We are translating the instructions for an English-language grammar activity. The content of the activity itself is not translated. Therefore, please leave words that sound like they are part of the activity in the original english. Often they will between an HTML tag such as in <em>english word</em> or <ul>english  word</ul>.
    "
    SPANISH_LOCALE = "es-la"

    def initialize(english_texts)
      @english_texts = english_texts
    end

    def run
      resp = GengoAPI.postTranslationJobs(jobs: gengo_payload)
      raise RequestTranslationError unless resp.present?

      SaveTranslatedTextWorker
      .perform_in(1.minute, resp.dig("response", "order_id"))
    end

    def gengo_payload
      english_texts.reduce({}) do |hash, english_text|
        hash.merge( { english_text.id.to_s => {
          type: "text",
          body_src: english_text.text,
          lc_src: "en",
          lc_tgt: SPANISH_LOCALE,
          tier: "standard",
          slug: english_text.id,
          group: true,
          auto_approve: true,
          comment: STANDARD_COMMENT
        }})
      end
    end
  end
end
