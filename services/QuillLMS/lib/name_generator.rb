module NameGenerator

  def generate
    sample('nouns.db').map { |w| w.strip }.join('-')
  end

  extend self

  private

  def sample file
    File.readlines(Rails.root.join('db', file)).sample(3)
  end
end
