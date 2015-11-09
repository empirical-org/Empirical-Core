class Profile::Query
  def query(student)
    sessions = student.activity_sessions
                      .preload(:activity, :classroom_activity, :concept_results => [:concept])
                      .where(state: ["finished", "unstarted"])
  end
end
