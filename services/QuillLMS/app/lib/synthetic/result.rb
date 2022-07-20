module Synthetic
  Result = Struct.new(:text, :label, :type, :generated, keyword_init: true) do
    def to_training_rows
      original_row = [type, text, label]
      generated_rows = generated
          .values
          &.map(&:values)
          &.flatten
          &.map {|new_text| [type, new_text, label]}

      [original_row].concat(generated_rows)
    end

    def to_detail_rows
      original_row = [text, label,'','', 'original', type]
      generated_rows = generated
        .map {|generator, hash| hash.transform_keys {|key| [generator,key].join('-')}}
        &.reduce(&:merge)
        &.map {|edit_type, new_text| [new_text, label, text, new_text == text ? 'no_change' : '', edit_type, type]}

      [original_row].concat(generated_rows)
    end
  end
end
