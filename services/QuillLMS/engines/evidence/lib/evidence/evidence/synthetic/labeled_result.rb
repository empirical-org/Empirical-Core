# frozen_string_literal: true

module Evidence
  module Synthetic
    LabeledResult = Struct.new(:text, :label, :type, :generated, keyword_init: true) do
      def to_training_rows
        [training_row].concat(generated_training_rows)
      end

      private def training_row
        [type, text, label]
      end

      private def generated_training_rows
        generated
          .map {|generator| generator.results.map {|new_text| [type, new_text, label]}}
          .flatten(1)
      end

      def to_detail_rows
        [original_detail_row].concat(generated_detail_rows)
      end

      private def original_detail_row
        [text, label,'','', 'original', type]
      end

      private def generated_detail_rows
        generated
          .map {|generator| generator_results_detail_rows(generator)}
          .flatten(1)
      end

      private def generator_results_detail_rows(generator)
        generator.results.map do |new_text|
          [
            new_text,
            label,
            text,
            new_text == text ? 'no_change' : '',
            [generator.name, generator.language,generator.word].compact.join('-').downcase,
            type
          ]
        end
      end
    end
  end
end
