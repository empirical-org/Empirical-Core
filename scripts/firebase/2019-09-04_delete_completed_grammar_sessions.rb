require 'csv'
require 'httparty'

THREAD_COUNT = 10

GRAMMAR_SESSION_CSV_PATH = "grammar_sessions_to_delete.csv" 
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
  session_key_slices = []
  slice_count.times { |i|
    session_key_slices << session_keys[(i * chunk_size), chunk_size]
  }
  session_key_slices
end

def get_deletion_url(session_key)
  "#{BASE_URL}#{GRAMMAR_SESSION_PATH}/#{session_key}.json?timeout=10s"
end

def delete_sessions_from_csv()
  puts "Reading session keys in from CSV file..."
  all_session_keys = CSV.read(GRAMMAR_SESSION_CSV_PATH).flatten
  multi_thread_deletions(all_session_keys, THREAD_COUNT)
end

delete_sessions_from_csv()
