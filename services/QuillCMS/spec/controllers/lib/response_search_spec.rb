# unit tests for regex + non-regex searching in module response_search

require "rails_helper"
require "modules/response_search"

RSpec.describe ResponseSearch do
  let(:test_query_filters) { { 'text' => '', 'filters' => "", 'excludeMisspellings' => 'true'} }

  it 'build_regex_query_string builds a correct regex search query' do
    test_1 = '/normal testt? regex/'
    expect(ResponseSearch.build_regex_query_string(test_1)).to eq('/.*normal testt? regex.*/')
    
    test_2 = '/^starts with regex/'
    expect(ResponseSearch.build_regex_query_string(test_2)).to eq('/starts with regex.*/')
    
    test_3 = '/ends with regex$/'
    expect(ResponseSearch.build_regex_query_string(test_3)).to eq('/.*ends with regex/')
  
    test_4 = '/^starts and ends with regex$/'
    expect(ResponseSearch.build_regex_query_string(test_4)).to eq('/starts and ends with regex/')
  end

  it 'get_query_values searches \'text\' without regex and \'text.keyword\' with regex' do
    test_query_filters['text'] = '/test_regex/'
    expect(ResponseSearch.get_query_values('000', test_query_filters)[:query_string][:default_field]).to eq('text.keyword')
    
    test_query_filters['text'] = 'test_no_regex'
    expect(ResponseSearch.get_query_values('000', test_query_filters)[:query_string][:default_field]).to eq('text')
  end

  it 'build_query_string builds an appropriate query string' do
    test_query_filters['text'] = '/test_regex/'
    expected_result = "/.*test_regex.*/ AND question_uid:(\"000\")"
    expect(ResponseSearch.build_query_string('000', test_query_filters, true)).to eq(expected_result)
    
    test_query_filters['text'] = 'test_no_regex'
    expected_result = "\"test_no_regex\" AND question_uid:(\"000\")"
  end
end
