module ResponseSearch

  module_function

  def search_responses(question_uid, query_filters)
    sort_values = get_sort_values(query_filters)
    query_values = get_query_values(question_uid, query_filters)
    search_payload = {
      sort: sort_values,
      query: query_values
    }
    results = Response.__elasticsearch__.search(search_payload)
    page_number = query_filters[:pageNumber]
    {
      numberOfPages: results.page(page_number).total_pages,
      numberOfResults: results.results.total,
      numberOfResultsOnPage: results.page(page_number).size,
      results: results.page(page_number).records
    }
  end

  def get_sort_values(query_filters)
    if query_filters[:sort][:column] == 'text'
      sort_value = [
        {
          "sortable_text": "#{query_filters[:sort][:direction] || 'desc'}"
        }
      ]
    else
      sort_value = [
        {
          "#{query_filters[:sort][:column]&.underscore || 'count'}": "#{query_filters[:sort][:direction] || 'desc'}"
        }
      ]
    end
    sort_value
  end

  def get_query_values(question_uid, query_filters)
    user_input = query_filters["text"].strip
    is_regex = user_input.first == '/' && user_input.last == '/'
    query = {
      query_string: {
        default_field: is_regex ? 'text.keyword' : 'text',
        query: build_query_string(question_uid, query_filters, is_regex)
      }
    }
  end

  def build_query_string(question_uid, query_filters, is_regex) 
    if is_regex
      string = build_regex_query_string(query_filters["text"])
    else
      string = "\"#{query_filters["text"]}\""
    end
    
    string = add_question_uid_filter(string, question_uid)
    string = add_not_filters(string, query_filters[:filters].to_h)
    string = add_spelling_filter(string, query_filters[:excludeMisspellings])
  end

  def build_regex_query_string(user_input)
    user_input.gsub!(/(?<=^\/)([^\^])/, '.*\1')
    user_input.gsub!(/(?<=^\/)[\^]/, '')
    user_input.gsub!(/([^\$])(?=\/$)/, '\1.*')
    user_input.gsub!(/([\$])(?=\/$)/, '')
    user_input
  end

  def add_question_uid_filter(current_string, question_uid)
    if current_string.empty?
      "question_uid:(\"#{question_uid}\")"
    else
      current_string + " AND question_uid:(\"#{question_uid}\")"
    end
  end

  def add_not_filters(current_string, filters)
    parsed_filters = filters.map do |key, value|
      key_value_to_not_string(key, value)
    end
    current_string + parsed_filters.join("")
  end

  def add_spelling_filter(current_string, filter)
    if filter then current_string + " AND NOT spelling_error:(true)" else current_string end
  end

  def key_value_to_not_string(key, value)
    if value.empty?
      return ""
    else
      vals = value.map {|val| "\"#{val}\"" }.join(" OR ")
      " AND NOT #{key.to_s}:(#{vals})"
    end
  end
end
