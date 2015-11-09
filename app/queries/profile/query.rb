class Profile::Query
  def query(student)
    sessions = student.activity_sessions
                      .preload(:activity, :classroom_activity => [:unit], :concept_results => [:concept])
                      .where(state: ["finished", "unstarted"])
                      .where("is_final_score = true OR state = 'unstarted'")
  end
end
