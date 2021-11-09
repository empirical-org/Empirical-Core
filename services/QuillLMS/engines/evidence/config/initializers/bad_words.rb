path = File.join(Evidence::Engine.root, 'config/initializers/bad_words.json')
io = File.open(path).read 
BAD_WORDS = JSON.parse(io)['words'].map(&:downcase)
