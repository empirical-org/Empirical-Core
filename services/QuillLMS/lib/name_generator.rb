module NameGenerator

  def generate
    "#{sample('noun_3.db')}-#{sample('noun_2.db')}"
  end

  extend self

  private

  def sample file
    File.readlines(Rails.root.join('db', file)).sample.strip
  end
end
