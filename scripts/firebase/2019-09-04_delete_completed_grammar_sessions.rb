require 'csv'
require 'httparty'
require 'json'

THREAD_COUNT = 10

GRAMMAR_LMS_COMPLETED_SESSIONS_CSV_PATH = "grammar_LMS_finished_sessions.csv"

BASE_URL = "https://quillconnect.firebaseio.com"
GRAMMAR_SESSION_PATH = "/v3/sessions"

def delete_session_slice(session_keys, thread_index)
  session_keys.each { |key|
    delete_url = get_deletion_url(key)
    puts "Deleting session #{key} in thread #{thread_index}..."
    HTTParty.delete(delete_url)
  }
end

def multi_thread_deletions(session_keys, thread_count)
  session_key_slices = slice_session_keys(session_keys, thread_count)

  puts "Spinning up #{thread_count} threads for deletion..."
  threads = []
  session_key_slices.each_with_index { |keys, i|
    threads << Thread.new { delete_session_slice(keys, i) }
  }
  threads.each(&:join)
end

def slice_session_keys(session_keys, slice_count)
  puts "Slicing #{session_keys.length} keys into #{slice_count} chunks..."
  chunk_size = session_keys.length / slice_count
  session_keys.each_slice(chunk_size).to_a
end

def get_deletion_url(session_key)
  "#{BASE_URL}#{GRAMMAR_SESSION_PATH}/#{session_key}.json?timeout=10s"
end

def get_grammar_session_keys
  url = "#{BASE_URL}#{GRAMMAR_SESSION_PATH}.json?shallow=true&timeout=30"
  puts "Retrieving undeleted Grammar session keys..."
  response = HTTParty.get(url)
  grammar_session_keys_object = JSON.parse(response.body)
  grammar_session_keys_object.keys
end

def discover_grammar_sessions_left_to_delete
  puts "Loading CSV of session keys marked for deletion from the LMS..."
  session_ids_to_delete = CSV.read(GRAMMAR_LMS_COMPLETED_SESSIONS_CSV_PATH).flatten
  session_ids_still_live = get_grammar_session_keys
  puts "Finding the intersection of undeleted keys and keys marked for deletion..."
  session_ids_to_delete & session_ids_still_live
end

def delete_sessions_from_csv()
  puts "Figuring out which keys to delete..."
  all_session_keys = discover_grammar_sessions_left_to_delete
  puts "Discovered #{all_session_keys.length} keys to delete"
  multi_thread_deletions(all_session_keys, THREAD_COUNT)
end

delete_sessions_from_csv()
