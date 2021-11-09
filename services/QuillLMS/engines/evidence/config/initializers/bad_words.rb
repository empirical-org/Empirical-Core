io = File.open('config/initializers/bad_words.json').read 
BAD_WORDS = JSON.parse(io)['words'].map(&:downcase)