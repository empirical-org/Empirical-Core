module ScorebookHelper

  def percentage_color(score)
    return score.percentage_color if score.respond_to?(:percentage_color)

    case score
    when 0.75..1.0
      'green'
    when 0.5..0.75
      'yellow'
    when 0.0..0.5
      'red'
    else
      'gray'
    end
  end

end