# frozen_string_literal: true

path = File.join(Evidence::Engine.root, 'config/initializers/bad_words.json')
io = File.read(path)

module BadWords; end

BadWords::ALL = JSON.parse(io)['words'].map(&:downcase)

