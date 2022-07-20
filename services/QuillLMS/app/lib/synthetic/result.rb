# frozen_string_literal: true

module Synthetic
  Result = Struct.new(:text, :label, :type, :generated, keyword_init: true) do
    def to_training_rows
      original_row = [type, text, label]

      [original_row].concat(generated_training_rows)
    end

    private def generated_training_rows
      generated_flattened
        .map {|_,new_text| [type, new_text, label]}
    end

    def to_detail_rows
      original_row = [text, label,'','', 'original', type]

      [original_row].concat(generated_detail_rows)
    end

    private def generated_detail_rows
      generated_flattened
        .map {|edit_type, new_text| [new_text, label, text, new_text == text ? 'no_change' : '', edit_type, type]}
    end

    # flatten :generated into one hash by combining the generator and the sub-keys,
    # e.g. {'tranlation-es' => 'hello', 'tranlation-ko' => 'hi', 'spelling-their' => 'what'...}
    private def generated_flattened
      generated
        .map {|generator, hash| hash.transform_keys {|key| [generator,key].join('-')}}
        &.reduce(&:merge)
    end
  end
end
