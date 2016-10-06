module NameGenerator

  def generate
    "#{color}-#{animal}-#{number}"
  end

  def animal
    sample('animals.db')
  end

  def color
    sample('colors.db')
  end

  def number
    rand(10000)
  end

  extend self

private

  def sample file
    File.readlines(Rails.root.join('db', file)).sample.strip
  end
end
