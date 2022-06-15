class ActiveRecord::Relation
  # pluck_in_batches:  yields an array of *columns that is at least size
  #                    batch_size to a block.
  #
  #                    Special case: if there is only one column selected than each batch
  #                                  will yield an array of columns like [:column, :column, ...]
  #                                  rather than [[:column], [:column], ...]
  # Arguments
  #   columns      ->  an arbitrary selection of columns found on the table.
  #   batch_size   ->  How many items to pluck at a time
  #   &block       ->  A block that processes an array of returned columns.
  #                    Array is, at most, size batch_size
  #
  # Returns
  #   nothing is returned from the function

  # rubocop:disable Metrics/CyclomaticComplexity
  def pluck_in_batches(*columns, batch_size: 1000)
    if columns.empty?
      raise "There must be at least one column to pluck"
    end

    # the :id to start the query at
    batch_start = 1

    # It's cool. We're only taking in symbols
    # no deep clone needed
    select_columns = columns.dup

    # Find index of :id in the array
    remove_id_from_results = false
    id_index = columns.index(primary_key.to_sym)

    # :id is still needed to calculate offsets
    # add it to the front of the array and remove it when yielding
    if id_index.nil?
      id_index = 0
      select_columns.unshift(primary_key)

      remove_id_from_results = true
    end

    loop do
      items = where(table[primary_key].gteq(batch_start))
                  .limit(batch_size)
                  .order(table[primary_key].asc)
                  .pluck(*select_columns)

      break if items.empty?

      # Use the last id to calculate where to offset queries
      last_item = items.last
      last_id = last_item.is_a?(Array) ? last_item[id_index] : last_item

      # Remove :id column if not in *columns
      items.map! { |row| row[1..-1] } if remove_id_from_results

      yield items

      break if items.size < batch_size

      batch_start = last_id + 1
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end

module IncorrectSequenceCalculator

  def self.incorrect_sequences_for_question(uid)
    model = train_correct_sentences(Response.where(question_uid: uid, optimal: true).pluck(:text))
    counter = Hash.new(0)
    response_count = Response.where(question_uid: uid, optimal: [false, nil]).count > 250 ? 1 : 0
    Response.where(question_uid: uid, optimal: [false, nil]).where("count > ?", response_count).pluck_in_batches(:text, :count, **{batch_size: 250}) do |batch|
      counter = train_incorrect_sentences(batch, model, counter)
    end
    amplify(counter, model)
    counter.sort_by {|k, v| v }.reverse.first(100).map do |k,v|
      if k[0] != ' '
        "^#{k}"
      elsif k[-1] != ' '
        "#{k}$"
      else
        k
      end
    end
  end

  def self.get_padded_words_array(sentence)
    words = sentence.split
    words.map.with_index do |word, i|
      case i
      when 0
        "#{word} "
      when words.length - 1
        " #{word}"
      else
        " #{word} "
      end
    end
  end

  def self.get_substrings_of_sentence(sentence)
    padded = get_padded_words_array(sentence)

    number_of_words = padded.length
    combinations = []

    i = 0

    until i == number_of_words
      inner = i
      until inner == number_of_words
        phrase = padded[i..inner].join.gsub(/\s{2,}/, ' ')
        combinations.push(phrase)
        inner += 1
      end

      i+=1
    end
    combinations
  end

  def self.get_incorrect_substrings_of_sentence(sentence, correct_substrings)
    padded = get_padded_words_array(sentence)

    number_of_words = padded.length
    combinations = []

    i = 0

    until i == number_of_words
      inner = i
      until inner == number_of_words
        phrase = padded[i..inner].join.gsub(/\s{2,}/, ' ')
        if correct_substrings[phrase] == 0
          combinations.push(phrase)
        end
        inner += 1
      end

      i+=1
    end
    combinations

  end

  def self.train_correct_sentences(sentences=[], model=Hash.new(0))
    sentences.each do |sentence|
      get_substrings_of_sentence(sentence).each { |subs| model[subs] += 1 }
    end
    model
  end

  def self.train_incorrect_sentences(sentences=[], correct_substring_counts=Hash.new(0), counter=Hash.new(0))
    sentences.each do |sentence|
      get_incorrect_substrings_of_sentence(sentence[0], correct_substring_counts).each { |subs| counter[subs] += sentence[1] }
    end
    counter
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def self.amplify(incorrect_substrings, correct_substrings)
    begin
      incorrect_substrings.each do |substring,v|
        if v > 10
          correct_substrings.each do |corsub, c|
            if substring.slice(0...corsub.length) == corsub
              new_substring = " #{substring.slice(corsub.length..-1)}"
            elsif substring.slice(-corsub.length..-1) == corsub
              new_substring = substring.slice(0..(substring.length - corsub.length))
            end
            if new_substring && new_substring.strip != "" && (incorrect_substrings[new_substring] != 0)
              incorrect_substrings[new_substring] += v
              end

          end
        end
      end
    rescue RuntimeError
      puts substring.gsub(" ", "_"), corsub.gsub(" ", "_"), new_substring.gsub(" ", "_")
      raise
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

end
