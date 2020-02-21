module NameGenerator

  def generate
    "#{sample('noun_1.db')}-#{sample('noun_2.db')}"
  end

  extend self

  private

  def sample file
    File.readlines(Rails.root.join('db', file)).sample.strip
  end
end
