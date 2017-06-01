module ResponseSearch

  def search_responses(question_uid, query_filters)
    puts query_filters
    sort_values = get_sort_values(query_filters)
    query_values = get_query_values(question_uid, query_filters)
    Response.__elasticsearch__.seach({
      sort: sort_values,
      query: query_values
    })
  end

  def get_sort_values(query_filters)

  end

  def get_query_values(question_uid, query_filters)
    query = {
      query_string: {
        default_field: 'text',
        query: build_query_string(question_uid, query_filters)
      }
    }
  end

  def build_query_string(question_uid, query_filters)
    string = query_filters["text"] || ""
    string = add_question_uid_filter(string, question_uid)
    string = add_not_filters(string, query_filters[:filters].to_h)
  end

  def add_question_uid_filter(current_string, question_uid)
    if current_string.empty?
      "question_uid:(#{question_uid})"
    else
      current_string + " question_uid:(#{question_uid})"
    end
  end

  def add_not_filters(string, filters)
    puts "Filters"
    puts filters
    parsed_filters = filters.map do |key, value|
      key_value_to_not_string(key, value)
    end
    current_string + parsed_filters.join("")
  end

  def key_value_to_not_string(key, value)
    vals = value.map {|val| "\"#{val}\"" }.join(" OR ")
    " AND NOT #{key.to_s}:(#{vals})"
  end
end
