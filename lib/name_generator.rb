module NameGenerator

  def generate
    "#{color}-#{animal}"
  end

  def animal
    sample('animals.db')
  end

  def color
    sample('colors.db')
  end

  extend self

private

  def sample file
    File.readlines(Rails.root.join('db', file)).sample.strip
  end
end
