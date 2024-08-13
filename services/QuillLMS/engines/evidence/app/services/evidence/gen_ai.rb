module Evidence
  module GenAI
    HistoryItem = Struct.new(:user, :assistant, keyword_init: true)
  end
end
