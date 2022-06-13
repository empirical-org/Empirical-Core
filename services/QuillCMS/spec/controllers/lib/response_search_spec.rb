# unit tests for regex + non-regex searching in module response_search

require "rails_helper"
require "modules/response_search"

RSpec.describe ResponseSearch do
  let(:test_query_filters) { { 'text' => '', 'filters' => "", 'excludeMisspellings' => 'true'} }

  describe '#build_regex_query_string' do
    it 'should add wildcards to start and end of regex if there is no start or end symbol in the original' do
      test1 = '/normal testt? regex/'
      expect(ResponseSearch.build_regex_query_string(test1)).to eq('/.*normal testt? regex.*/')
    end

    it 'should remove ^ symbol but NOT add wildcard at beginning of regex if original regex starts with ^' do
      test2 = '/^starts with regex/'
      expect(ResponseSearch.build_regex_query_string(test2)).to eq('/starts with regex.*/')
    end

    it 'should remove $ symbol but NOT add wildcard at end of regex if original regex ends with $' do
      test3 = '/ends with regex$/'
      expect(ResponseSearch.build_regex_query_string(test3)).to eq('/.*ends with regex/')
    end

    it 'should remove both ^ and $ symbols and add NO wildcards if original regex starts and ends with ^/$' do
      test4 = '/^starts and ends with regex$/'
      expect(ResponseSearch.build_regex_query_string(test4)).to eq('/starts and ends with regex/')
    end
  end

  describe '#get_query_values' do
    it 'should search in field \'sortable_text\' if original query contains regex' do
      test_query_filters['text'] = '/test_regex/'
      expect(ResponseSearch.get_query_values('000', test_query_filters)[:query_string][:default_field]).to eq('sortable_text')
    end

    it 'should search in field \'text\' if original query does not contain regex' do
      test_query_filters['text'] = 'test_no_regex'
      expect(ResponseSearch.get_query_values('000', test_query_filters)[:query_string][:default_field]).to eq('text')
    end
  end

  describe '#build_query_string' do
    it 'should build query string with appropriate regex if original query contains regex' do
      test_query_filters['text'] = '/test_regex/'
      expected_result = "/.*test_regex.*/ AND question_uid:(\"000\")"
      expect(ResponseSearch.build_query_string('000', test_query_filters, true)).to eq(expected_result)
    end

    it 'should build query string with appropriate string query if original query contains no regex' do
      test_query_filters['text'] = 'test_no_regex'
      expected_result = "\"test_no_regex\" AND question_uid:(\"000\")"
      expect(ResponseSearch.build_query_string('000', test_query_filters, false)).to eq(expected_result)
    end
  end
end
