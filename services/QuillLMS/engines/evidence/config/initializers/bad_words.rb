path = File.join(Evidence::Engine.root, 'config/initializers/bad_words.json')
io = File.open(path).read 

module BadWords; end

BadWords::ALL = JSON.parse(io)['words'].map(&:downcase)

