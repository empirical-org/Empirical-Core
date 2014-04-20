class ChapterShim < SimpleDelegator
  def assessment
    self.class.new(self)
  end

  def story_instructions
    data['instructions']
  end

  def article_header
    name
  end
end
