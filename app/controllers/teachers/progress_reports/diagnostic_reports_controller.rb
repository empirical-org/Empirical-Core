class Teachers::ProgressReports::DiagnosticReportsController < Teachers::ProgressReportsController

  def show
    @classroom_id = current_user.classrooms_i_teach.last.id || nil
    @report = params[:report] || 'question'
  end

  def question_view
    render json:  {data: [{question_id: 123,
                    score: 87,
                    instructions: 'Fix run on sentence',
                    prompt: 'Run'},
                    {question_id: 1323,
                    score: 70,
                    instructions: 'Go to the gym',
                    prompt: 'Run'},
                    {question_id: 112323,
                    score: 30,
                    instructions: "I can't it's too hard",
                    prompt: 'Run'}]
                  }
  end

  def students_by_classroom
    render json: results_for_classroom(params[:classroom_id])
  end

  def recommendations_for_classroom
    render json: get_recommendations_for_classroom(params[:classroom_id])
  end

  private

  def results_for_classroom classroom_id
    classroom = Classroom.find(classroom_id)
    diagnostic = Activity.find(413)
    scores = {
      id: classroom.id,
      name: classroom.name
    }
    scores[:students] = classroom.students.map { |student|
      loaded = student.activity_sessions.includes(concept_results: :concept).find_by(activity_id: diagnostic.id, is_final_score: true)
      if loaded
        formatted_concept_results = get_concept_results(loaded)
        session = {
          id: loaded.id,
          time: get_time_in_minutes(loaded),
          number_of_questions: formatted_concept_results.length,
          concept_results: formatted_concept_results,
          score: get_average_score(formatted_concept_results)
        }
      else
        session = {
          id: nil,
          time: nil,
          concept_results: []
        }
      end
      {
        id: student.id,
        name: student.name,
        session: session
      }
    }
    scores
  end

  def get_time_in_minutes activity_session
    ((activity_session.completed_at - activity_session.started_at) / 60).round()
  end

  def get_concept_results activity_session
    activity_session.concept_results.group_by{|cr| cr[:metadata]["questionNumber"]}.map { |key, cr|
      {
        directions: cr.first[:metadata]["directions"],
        prompt: cr.first[:metadata]["prompt"],
        answer: cr.first[:metadata]["answer"],
        score: get_score_for_question(cr),
        concepts: cr.map { |crs|
          {
            id: crs.concept_id,
            name: crs.concept.name,
            correct: crs[:metadata]["correct"] == 1
          }
        },
        question_number: cr.first[:metadata]["questionNumber"]
      }
    }
  end

  def get_score_for_question concept_results
    concept_results.inject(0) {|sum, crs| sum + crs[:metadata]["correct"]} / concept_results.length * 100
  end

  def get_average_score formatted_results
    (formatted_results.inject(0) {|sum, crs| sum + crs[:score]} / formatted_results.length).round()
  end

  @@data = [
    {
      recommendation: "Fragments",
      activityPackId: 1,
      requirements: [
        {
          concept_id: "j89kdRGDVjG8j37A12p37Q",
          count: 3
        },
        {
          concept_id: "KfA8-dg8FvlJz4eY0PkekA",
          count: 6
        },
        {
          concept_id: "LH3szu784pXA5k2N9lxgdA",
          count: 3
        },
      ]
    },

    {
      recommendation: "Compound Subjects, Objects, and Predicates",
      activityPackId: 2,
      requirements: [
        {
          concept_id: "Jl4ByYtUfo4VhIKpMt23yA",
          count: 1
        },
        {
          concept_id: "QNkNRs8zbCXU7nLBeo4mgA",
          count: 1
        },
        {
          concept_id: "GZ04vHSTxWUTzhWMGfwcUQ",
          count: 1
        },
      ]
    },

    {
      recommendation: "Adjectives",
      activityPackId: 3,
      requirements: [
        {
          concept_id: "GiUZ6KPkH958AT8S413nJg",
          count: 1
        }
      ]
    },

    {
      recommendation: "Adverbs",
      activityPackId: 4,
      requirements: [
        {
          concept_id: "GZ04vHSTxWUTzhWMGfwcUQ",
          count: 1
        }
      ]
    },

    {
      recommendation: "Compound Sentences",
      activityPackId: 5,
      requirements: [
        {
          concept_id: "GiUZ6KPkH958AT8S413nJg",
          count: 4
        },
        {
          concept_id: "Qqn6Td-zR6NIAX43NOHoCg",
          count: 1
        },
        {
          concept_id: "hJKqVOkQQQgfEsmzOWC1xw",
          count: 1
        },
        {
          concept_id: "72q842CV_svVJyAhouSArg",
          count: 1
        },
        {
          concept_id: "kODm7xLmhGShct5uJIfHXg",
          count: 1
        }
      ]
    },

    {
      recommendation: "Complex Sentences",
      activityPackId: 6,
      requirements: [
        {
          concept_id: "nb0JW1r5pRB5ouwAzTgMbQ",
          count: 2
        },
        {
          concept_id: "Q8FfGSv4Z9L2r1CYOfvO9A",
          count: 2
        },
        {
          concept_id: "v5U1EpXQ1dLjLlNQu0Js_w",
          count: 1
        },
        {
          concept_id: "S8b-N3ZrB50CWgxD5yg8yQ",
          count: 1
        },
        {
          concept_id: "7H2IMZvq0VJ4Uvftyrw7Eg",
          count: 1
        },
        {
          concept_id: "VKmlb8cQQaIo1AeM9X79qw",
          count: 1
        }
      ]
    },

    {
      recommendation: "Appositive and Modifying Phrases",
      activityPackId: 7,
      requirements: [
        {
          concept_id: "InfGdB6Plr2M930kqsn63g",
          count: 1
        },
        {
          concept_id: "VzHTK34WeLp6lfbpkM-L2w",
          count: 1
        }
      ]
    },

    {
      recommendation: "Parallel Structure",
      activityPackId: 8,
      requirements: [
        {
          concept_id: "O9DCEPwtmVvmlRhmdiaw6w",
          count: 1
        }
      ]
    }
  ]


  def get_recommendations_for_classroom classroom_id
    classroom = Classroom.find(classroom_id)
    diagnostic = Activity.find(413)
    students = classroom.students
    activity_sessions = students.map do |student|
      student.activity_sessions.includes(concept_results: :concept).find_by(activity_id: diagnostic.id, is_final_score: true)
    end
    activity_sessions.compact!
    activity_sessions_counted = activity_sessions_with_counted_concepts(activity_sessions)

    @@data.map do |activity_pack_recommendation|
      students = []
      activity_sessions_counted.each do |activity_session|
        activity_pack_recommendation[:requirements].each do |req|
          if activity_session[:concept_scores][req[:concept_id]] < req[:count]
            students.push(activity_session[:user_id])
            break
          end
        end
      end
      return_value_for_recommendation(students, activity_pack_recommendation)
    end
  end

  def return_value_for_recommendation students, activity_pack_recommendation
    {
      activity_pack_id: activity_pack_recommendation[:activityPackId],
      name: activity_pack_recommendation[:recommendation],
      students: students
    }
  end

  def activity_sessions_with_counted_concepts activity_sessions
    activity_sessions.map do |activity_session|
      {
        user_id: activity_session.user_id,
        concept_scores: concept_results_by_count(activity_session)
      }
    end
  end

  def concept_results_by_count activity_session
    hash = Hash.new(0)
    activity_session.concept_results.each do |concept_result|
      hash[concept_result.concept.uid] += concept_result["metadata"]["correct"]
    end
    hash
  end


end
