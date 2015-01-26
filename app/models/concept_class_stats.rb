class ConceptClassStats
  # Calculate the average words per minute for a set of concept tag results
  def self.average_wpm(concept_tag_results)
    # Keep only the WPM results
    wpm_counts = concept_tag_results.reduce [] do |counts, result|
      if result.concept_tag.name == "Typing Speed"
        counts << result.metadata['wpm']
      end
      counts
    end
    wpm_counts.reduce(:+) / wpm_counts.size
  end
end