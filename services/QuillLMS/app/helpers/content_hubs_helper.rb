# frozen_string_literal: true

module ContentHubsHelper
  def unit_activities_include_content_activities?(unit_activities, content_activity_ids)
    unit_activities.where(activity_id: content_activity_ids).any?
  end

  def unit_activities_include_social_studies_activities?(unit_activities)
    activity_ids = world_history_1200_to_present_data.flat_map { |template| template[:activities].pluck(:activity_id) }

    unit_activities_include_content_activities?(unit_activities, activity_ids)
  end

  def unit_activities_include_science_activities?(unit_activities)
    activity_ids = building_ai_knowledge_data.flat_map { |template| template[:activities].pluck(:activity_id) }

    unit_activities_include_content_activities?(unit_activities, activity_ids)
  end

  def course_with_assignment_data(course_data, classrooms)
    return course_data if !classrooms || classrooms.empty?

    classroom_ids_as_string = classrooms.map(&:id).join(',')

    course_data.map { |unit_template| assignment_data_for_unit_template(unit_template, classroom_ids_as_string) }
  end

  def assignment_data_for_unit_template(unit_template, classroom_ids_as_string)
    unit_template[:activities].map do |activity|
      unit_activities = UnitActivity
        .joins(:classroom_units)
        .where(activity_id: activity[:activity_id])
        .where("classroom_units.classroom_id IN (#{classroom_ids_as_string})")

      classroom_units = ClassroomUnit.where(unit_id: unit_activities.pluck(:unit_id))
      activity_sessions = ActivitySession.completed.where(classroom_unit: classroom_units.ids, activity_id: activity[:activity_id], is_final_score: true)
      activity_sessions_with_scores = activity_sessions.where.not(percentage: nil)

      activity[:assigned_student_count] = classroom_units.pluck(:assigned_student_ids).flatten.uniq.count
      activity[:completed_student_count] = activity_sessions.pluck(:user_id).uniq.count
      activity[:link_for_report] = get_link_for_report(activity, classroom_units, activity_sessions)
      activity[:average_score] = activity_sessions_with_scores.empty? ? nil : (activity_sessions_with_scores.pluck(:percentage).sum / activity_sessions_with_scores.count) * 100

      activity
    end

    unit_template
  end

  def get_link_for_report(activity, classroom_units, activity_sessions)
    last_classroom_unit = classroom_units.last
    last_activity_session = activity_sessions.last

    unit_id = unit_id_for_report(last_classroom_unit, last_activity_session)
    classroom_id = classroom_id_for_report(last_classroom_unit, last_activity_session)

    return nil if !(unit_id && classroom_id)

    "/teachers/progress_reports/diagnostic_reports#/u/#{unit_id}/a/#{activity[:activity_id]}/c/#{classroom_id}/students"
  end

  def activities_with_preview_link(activities)
    activities.map do |activity|
      activity[:preview_href] = get_link_for_activitiy_preview(activity)
      activity
    end
  end

  def get_link_for_activitiy_preview(activity)
    return nil unless activity[:activity_id]

    evidence_activity = Evidence::Activity.find_by(parent_activity_id: activity[:activity_id])

    return nil unless evidence_activity

    return "/evidence/#/play?anonymous=true&uid=#{evidence_activity.id}"
  end

  def unit_id_for_report(last_classroom_unit, last_activity_session)
    last_activity_session&.unit&.id || last_classroom_unit&.unit_id
  end

  def classroom_id_for_report(last_classroom_unit, last_activity_session)
    last_activity_session&.classroom&.id || last_classroom_unit&.classroom_id
  end

  def building_ai_knowledge_data
    [
      {
        display_name: "AI & Animal Conservation",
        description: "One exciting application of AI is helping to protect endangered and vulnerable animals. In this activity pack, students will learn about how researchers are using AI to help protect elephants from poachers, monitor the health of coral reefs, and even try to communicate with whales! Students will also be introduced to foundational concepts in AI, including computer vision, machine learning, and large language models.",
        unit_template_id: 711,
        all_quill_articles_href: "https://docs.google.com/document/u/0/d/1YKOsYcaZ86PbEbrBRo9RR7JW9EkT7ETCY_cMBdu5V70/edit",
        quill_teacher_guide_href: '',
        activities: activities_with_preview_link(ai_and_animal_conservation_activities)
      },
      {
        display_name: "AI & Arts and Entertainment",
        description: "Many people are concerned about how AI will impact jobs, and those working in arts and entertainment are no exception. In this activity pack, students will explore debates related to the use of AI in music, visual art, and video game development. They will also be introduced to foundational AI concepts, including voice cloning, image generation, and generative artificial intelligence.",
        unit_template_id: 713,
        all_quill_articles_href: "https://docs.google.com/document/u/0/d/1sAf0m5q4vTtZUTDndsQejMhgUxOxrCXOgO2sm2dmbM0/edit",
        quill_teacher_guide_href: '',
        activities: activities_with_preview_link(ai_and_arts_and_entertainment_activities)
      }
    ]
  end

  def ai_and_animal_conservation_activities
    [
      {
        activity_id: 2523,
        display_name: 'How Can Computer Vision Protect Elephants From Poachers?',
        description: 'Students will read a text that explores how TrailGuard uses computer vision to protect wild elephants from poachers, while also investigating the limits of this technology.',
        paired_ai_edu_activities: [
          {
            name: 'Seeing is believing',
            link: 'https://docs.google.com/presentation/d/1i3GaqNUIIHoSLTptHu-0TQ4vZGFyEbN2-RWxaGZps-c/edit#slide=id.g1265186feb3_0_1463'
          }
        ]
      },
      {
        activity_id: 2525,
        display_name: 'Can Large Language Models Help Humans Talk to Whales?',
        description: 'Students will read a text that explores how researchers are using large language models to try to communicate with whales.',
        paired_ai_edu_activities: [
          {
            name: 'Interspecies Communication App',
            link: 'https://www.aiedu.org/interspecies-comm-download'
          }
        ]
      },
      {
        activity_id: 2514,
        display_name: 'How Are Marine Biologists Using Machine Learning to Protect Coral Reefs?',
        description: 'Students will read a text that explores how researchers are using AI and audio analysis to monitor the health of coral reefs.',
        paired_ai_edu_activities: [
          {
            name: 'And this piggy... sounded happy!',
            link: 'https://docs.google.com/presentation/d/1i3GaqNUIIHoSLTptHu-0TQ4vZGFyEbN2-RWxaGZps-c/edit#slide=id.g1265186feb3_0_1684'
          }
        ]
      }
    ]
  end

  def ai_and_arts_and_entertainment_activities
    [
      {
        activity_id: 2543,
        display_name: 'Why Did a Drake Song Spark a Debate About AI Voice Cloning?',
        description: 'Students will read a text that explores the benefits and drawbacks of AI voice cloning technology in the music industry.',
        paired_ai_edu_activities: [
          {
            name: 'Sound like myself',
            link: 'https://docs.google.com/presentation/d/1i3GaqNUIIHoSLTptHu-0TQ4vZGFyEbN2-RWxaGZps-c/edit#slide=id.g1265186feb3_0_231'
          },
          {
            name: 'Where credit is due',
            link: 'https://docs.google.com/presentation/d/1i3GaqNUIIHoSLTptHu-0TQ4vZGFyEbN2-RWxaGZps-c/edit#slide=id.g1265186feb3_0_341'
          }
        ]
      },
      {
        activity_id: 2562,
        display_name: 'Are AI Image Generators Stealing From Visual Artists?',
        description: 'Students will read a text that explores whether AI companies broke copyright laws when creating their AI image generators.',
        paired_ai_edu_activities: [
          {
            name: 'Counting Mars',
            link: 'https://docs.google.com/presentation/d/1i3GaqNUIIHoSLTptHu-0TQ4vZGFyEbN2-RWxaGZps-c/edit#slide=id.g1265186feb3_0_99'
          }
        ]
      },
      {
        activity_id: 2597,
        display_name: 'Can Generative AI Improve Non-Player Characters in Video Games?',
        description: 'Students will read a text that explores opposing perspectives on using generative artificial intelligence to improve non-player characters (NPCs) in video games.',
        paired_ai_edu_activities: [
          {
            name: "Methink'st thou art a general offense",
            link: 'https://docs.google.com/presentation/d/1i3GaqNUIIHoSLTptHu-0TQ4vZGFyEbN2-RWxaGZps-c/edit#slide=id.g1265186feb3_0_242'
          }
        ]
      }
    ]
  end

  def world_history_1200_to_present_data
    [
      {
        display_name: "The Global Tapestry (1200-1450 CE)",
        description: "From 1200 to 1450 CE, diverse societies emerged and expanded around the world. Although these societies had many similarities, they also had important differences. As interactions increased, unique ideas, resources, and technology spread farther than ever before. New trade networks—and new conflicts—arose as societies made contact across Europe, Asia, and Africa.",
        unit_template_id: 470,
        oer_unit_website: "https://www.oerproject.com/1200-to-the-Present/Unit-2",
        oer_unit_teacher_guide: "https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit2/Unit-2-Guide",
        all_oer_articles: "https://docs.google.com/document/d/1Q62sQb8H4aWMqNxn2V525s4d2B6YryxS/edit?usp=drive_link&ouid=110057766825806701001&rtpof=true&sd=true",
        oer_unit_number: 2,
        all_quill_articles_href: "",
        quill_teacher_guide_href: '',
        activities: activities_with_preview_link(global_tapestry_activities)
      },
      {
        display_name: "Transoceanic Connections (1450-1750 CE)",
        description: "Transoceanic connections transformed societies and the global economy. New goods spread around the world via trade networks like the Columbian Exchange, and European leaders used those same routes to expand their empires across oceans. Meanwhile, land-based empires in Afro-Eurasia both competed and connected with these growing ocean powers. ",
        unit_template_id: 551,
        oer_unit_website: "https://www.oerproject.com/1200-to-the-Present/Unit-3",
        oer_unit_teacher_guide: "https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit3/Unit-3-Guide",
        all_oer_articles: "https://docs.google.com/document/d/1oURXhjxIaxhY6r48c9RJto8Z7bzXkx3y/edit?usp=drive_link&ouid=110057766825806701001&rtpof=true&sd=true",
        all_quill_articles_href: "https://docs.google.com/document/d/1LzcMDsFlbW_gifr-s-I5gY7ajiHOVTbsojM4WJqmV-A/edit",
        oer_unit_number: 3,
        quill_teacher_guide_href: '',
        activities: activities_with_preview_link(transoceanic_connection_activities)
      },
      {
        display_name: "Revolutions (1750-1914 CE)",
        description: "From 1750 to 1914 CE, new ideas about liberty, natural law, and government spread rapidly. These Enlightenment beliefs, along with difficult material conditions, inspired many to fight for change. These upheavals reshaped societies, dismantled old regimes, and established new political systems. ",
        unit_template_id: 587,
        oer_unit_website: "https://www.oerproject.com/1200-to-the-Present/Unit-4",
        oer_unit_teacher_guide: "https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit4/Unit-4-Guide",
        all_oer_articles: "https://docs.google.com/document/d/1amKT62b-New9kEKG4URZ7pAx8AfKzcQ8/edit?usp=drive_link&ouid=110057766825806701001&rtpof=true&sd=true",
        all_quill_articles_href: 'https://docs.google.com/document/d/1ndNVZX8P0F8wzxIS07wBWZgxoTTJY73-fv-WePcQDvo/edit',
        oer_unit_number: 4,
        quill_teacher_guide_href: '',
        activities: activities_with_preview_link(revolution_activities)
      },
      {
        display_name: "Industrialization (1750-1914 CE)",
        description: "Advancements in technology and production sparked the Industrial Revolution. This transformed the world of work and led to the development of new economic theories. Rapid urbanization, growing migration, and new reform movements challenged existing political and social systems, triggering backlash from elites and, in some cases, meaningful change for everyday people. ",
        unit_template_id: 596,
        oer_unit_website: "https://www.oerproject.com/1200-to-the-Present/Unit-5",
        oer_unit_teacher_guide: "https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit5/Unit-5-Guide",
        all_oer_articles: "https://docs.google.com/document/d/1cnifbOcrkCxq_ZgnODUxZdNWzIQMVyoQ/edit?usp=drive_link&ouid=110057766825806701001&rtpof=true&sd=true",
        all_quill_articles_href: 'https://docs.google.com/document/d/1gioQZdIV3ush2QWzSdtrz8sUsDADGAniorXCmBLWghc/edit',
        oer_unit_number: 5,
        quill_teacher_guide_href: '',
        activities: activities_with_preview_link(industrialization_activities)
      },
      {
        display_name: "'New' Imperialism & Resistance (1850-1950 CE)",
        description: "As industrialized nations competed for raw materials and new markets, they expanded their influence and control over parts of Africa, Asia, and other regions. These imperial ambitions led to the establishment of vast colonial empires. At the same time, local populations used many different strategies to resist and challenge these colonizing forces.",
        unit_template_id: 597,
        oer_unit_website: "https://www.oerproject.com/1200-to-the-Present/Unit-6",
        oer_unit_teacher_guide: "https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit6/Unit-6-Guide",
        all_oer_articles: "https://docs.google.com/document/d/18Ou6glUW6QdbpaFxgszFLuq7iuhIUNF8/edit?usp=drive_link&ouid=110057766825806701001&rtpof=true&sd=true",
        oer_unit_number: 6,
        all_quill_articles_href: 'https://docs.google.com/document/d/1K-8Nxau9IBCXgu8vEoIzwwzTmaK6fLiJvb0xO_gUs_M/edit?usp=sharing',
        quill_teacher_guide_href: '',
        activities: activities_with_preview_link(new_imperialism_and_resistance_activities)
      },
      {
        display_name: "Global Conflict (1914-1945 CE)",
        description: "From 1914 to 1945, the world endured two major conflicts ---World War I and World War II---which resulted in immense human suffering, advancements in military technology, and major shifts in international relations. The interwar period began with efforts to prevent further conflict, but this work was hindered by economic instability and the rise of totalitarian regimes.",
        unit_template_id: 591,
        oer_unit_website: "https://www.oerproject.com/1200-to-the-Present/Unit-7",
        oer_unit_teacher_guide: "https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit7/Unit-7-Guide",
        all_oer_articles: "https://docs.google.com/document/d/1nO78eUYRNORQQwnWy9jUmwTbxmk1dNNd/edit?usp=drive_link&ouid=110057766825806701001&rtpof=true&sd=true",
        oer_unit_number: 7,
        all_quill_articles_href: 'https://docs.google.com/document/d/14mnkQ75WILd6WsGch6AfG4XxKaiY_u8LHR9ZQyg2DD8/edit?usp=sharing',
        quill_teacher_guide_href: '',
        activities: activities_with_preview_link(global_conflict_activities)
      },
      {
        display_name: "Cold War and Decolonization (1945-1990 CE)",
        description: "The second half of the 20th century was shaped by the dynamics of the Cold War and decolonization. The capitalist United States and communist Soviet Union rose as dominant powers, competing for global influence. Simultaneously, decolonization movements used a variety of methods, including both non-violent resistance and armed conflict, to achieve independence.",
        unit_template_id: 598,
        oer_unit_website: "https://www.oerproject.com/1200-to-the-Present/Unit-8",
        oer_unit_teacher_guide: "https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit8/Unit-8-Guide",
        all_oer_articles: "https://docs.google.com/document/d/1tHmlCgf8FgIoS0Ipdvj2Zuw3AKDYPU14/edit?usp=drive_link&ouid=110057766825806701001&rtpof=true&sd=true",
        oer_unit_number: 8,
        all_quill_articles_href: 'https://docs.google.com/document/d/1Cg7ShOIbYoMa3NYUSh_l2Fx5B4CiZODEW1_vSVTagCw/edit?usp=sharing',
        quill_teacher_guide_href: '',
        activities: activities_with_preview_link(cold_war_and_decolonization_activities)
      },
      {
        display_name: "Globalization (1990-Present)",
        description: "Coming Spring 2025!",
        unit_template_id: nil,
        oer_unit_website: "https://www.oerproject.com/1200-to-the-Present/Unit-9",
        oer_unit_teacher_guide: "https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit9/Unit-9-Guide",
        all_oer_articles: "https://docs.google.com/document/d/1UN4K3X6LgfhhU8ET0tagon92pYxMebAL/edit?usp=drive_link&ouid=110057766825806701001&rtpof=true&sd=true",
        oer_unit_number: 9,
        all_quill_articles_href: '',
        quill_teacher_guide_href: '',
        activities: activities_with_preview_link(globalization_activities)
      }
    ]
  end

  def global_tapestry_activities
    [
      {
        activity_id: 2750,
        display_name: 'How Did Pirates Disrupt Sea Routes in East Asia?',
        description: 'Students will read and write about how Korean leaders addressed the growing threat of piracy along major trade routes in East Asia.',
        paired_oer_asset_name: 'Archipelago of Trade',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit2/Archipelago-of-Trade'
      },
      {
        activity_id: nil,
        display_name: 'Early Inquisition — Coming Soon!',
        description: 'Students will read and write about the Catholic Church’s response to the rise of the Cathars, a non-Catholic Christian group, in southern France.',
        paired_oer_asset_name: 'Christendom',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit2/Christendom'
      },
      {
        activity_id: nil,
        display_name: 'Mamluk Sultanate — Coming Soon!',
        description: 'Students will read and write about how Shajar al-Durr became the first Muslim woman to lead Egypt and sparked the rise of the Mamluk Sultanate.',
        paired_oer_asset_name: 'The Caliphate',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit2/The-Caliphate'
      }
    ]
  end

  def transoceanic_connection_activities
    [
      {
        activity_id: 2518,
        display_name: "How Did Horses Reshape Indigenous Americans' Ways of Life?",
        description: 'Students will read and write about the impact of growing horse populations on 16th and 17th century Indigenous communities on the North American Plains.',
        paired_oer_asset_name: 'The Columbian Exchange',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit3/The-Columbian-Exchange'
      },
      {
        activity_id: 2517,
        display_name: "How Did Queen Elizabeth I Use Diplomacy to Avoid Economic Decline?",
        description: 'Students will read and write about the successful partnerships that Queen Elizabeth I built with Muslim leaders after she was excommunicated.',
        paired_oer_asset_name: 'A Sublime Empire: Ottoman Rule on Land and Sea',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit3/A-Sublime-Empire'
      },
      {
        activity_id: 2516,
        display_name: 'Why Did a "Hidden Christian" Community Emerge in Tokugawa Japan?',
        description: 'Students will read and write about the political and cultural responses to the spread of Catholicism in Japan during the 1600s.',
        paired_oer_asset_name: 'Oceanic Empires, 1450 to 1750',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit3/Oceanic-Empires-1450-to-1750'
      }
    ]
  end

  def revolution_activities
    [
      {
        activity_id: 2428,
        display_name: 'Why Did Revolutions Erupt Throughout the Atlantic World?',
        description: 'Students will read and write about the ideological and material causes of revolutions in the Atlantic world during the late 18th and early 19th centuries.',
        paired_oer_asset_name: 'The Atlantic Revolutions',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit4/The-Atlantic-Revolutions'
      },
      {
        activity_id: 2519,
        display_name: 'Why Did France Intervene in the American Revolution?',
        description: "Students will read and write about France's motivation for supporting North American colonists in their fight for independence during the American Revolution.",
        paired_oer_asset_name: 'Economic and Material Causes of Revolt',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/AP-World-History/Unit5/Economic-and-Material-Causes-of-Revolt'
      },
      {
        activity_id: 2427,
        display_name: 'How Did Haiti Become the First Independent Black Republic?',
        description: "Students will read and write about how enslaved people led a revolution in Haiti and won the country's independence from France.",
        paired_oer_asset_name: 'Americas in 1750',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1750/Unit1/Americas-in-1750'
      }
    ]
  end

  def industrialization_activities
    [
      {
        activity_id: 2545,
        display_name: 'How Did British Women Workers Fight for Their Rights in the 19th Century?',
        description: "Students will read and write about how groups like the Women's Protective and Provident League (WPPL) helped British women workers organize to improve their pay and conditions.",
        paired_oer_asset_name: 'Responses to Industrialization',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit5/Responses-to-Industrialization'
      },
      {
        activity_id: 2544,
        display_name: 'Why Did Industrial Workers March on the Russian Imperial Palace?',
        description: "Students will read and write about the ways that factory workers in St. Petersburg, Russia fought for better working conditions and the resistance they faced from Russian leaders.",
        paired_oer_asset_name: 'Rise of the Proletariat',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit5/Rise-of-the-Proletariat'
      },
      {
        activity_id: 2546,
        display_name: 'Why Did the Russian Empire Want to Expand its Settlements in Siberia?',
        description: "Students will read and write about how Russian leaders used incentives, transportation, and forced migration to populate Siberia.",
        paired_oer_asset_name: 'Industrialization and Migration',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit5/Industrialization-and-Migration'
      }
    ]
  end

  def new_imperialism_and_resistance_activities
    [
      {
        activity_id: 2571,
        display_name: 'Why Did Ottoman Reformers Think Education Would Help Preserve the Empire?',
        description: "Students will read and write about how Ottoman leaders reimagined their education system during the Tanzimat reform period.",
        paired_oer_asset_name: 'Tools of Imperialism',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit6/Tools-of-Imperialism'
      },
      {
        activity_id: 2552,
        display_name: 'Why Did French Colonial Leaders Try to Recreate Paris in Vietnam?',
        description: "Students will read and write about how French colonial leaders attempted to spread their culture in Vietnam, along with the ways that Vietnamese people resisted this imperialism.",
        paired_oer_asset_name: 'Responses to Industrial Imperialism',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit6/Responses-to-Industrial-Imperialism'
      },
      {
        activity_id: 2553,
        display_name: 'How Did Ethiopia Resist Italian Imperialism During the 19th Century?',
        description: "Students will read and write about how King Menelik II and his army prevented Italy from colonizing Ethiopia in the 1890s. ",
        paired_oer_asset_name: 'The Berlin Conference',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit6/The-Berlin-Conference'
      }
    ]
  end

  def global_conflict_activities
    [
      {
        activity_id: 2490,
        display_name: 'Why Did So Many Underage Soldiers Fight in Great Britain’s Army?',
        description: "Students will read and write about how and why young boys were encouraged to join the British Army during World War I.",
        paired_oer_asset_name: 'World War I: A Total War?',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit7/World-War-I-A-Total-War'
      },
      {
        activity_id: 2482,
        display_name: 'Why Was Racial Equality Excluded From the Treaty of Versailles?',
        description: "Students will read and write about the debate over including Japan's Racial Equality Proposal in the Treaty of Versailles.",
        paired_oer_asset_name: 'Fascist Histories, Part I',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1200/Unit7/Fascist-Histories-Part-I'
      },
      {
        activity_id: 2470,
        display_name: 'How Did the Nazi Party Use the Berlin Olympics as Propaganda?',
        description: "Students will read and write about how the Nazi Party tried to conceal their fascist beliefs and violence ahead of the 1936 Berlin Olympics.",
        paired_oer_asset_name: 'Fascism in Germany',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1750/Unit7/Fascism-in-Germany'
      }
    ]
  end

  def cold_war_and_decolonization_activities
    [
      {
        activity_id: 2491,
        display_name: 'How Did Bananas Lead to a Coup in Guatemala?',
        description: "Students will read and write about the causes and effects of the United States' intervention in Guatemala during the Cold War.",
        paired_oer_asset_name: 'The Cold War Around the World',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1750/Unit8/The-Cold-War-Around-the-World'
      },
      {
        activity_id: 2589,
        display_name: 'Why Did the USSR Race to Send a Woman to Space?',
        description: "Students will read and write about why Soviet leaders wanted to be the first country to send a woman to space during the Cold War.",
        paired_oer_asset_name: 'Arms Race, Space Race',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1750/Unit8/Arms-Race-Space-Race'
      },
      {
        activity_id: 2606,
        display_name: 'How Did Black South African Students Protest Apartheid?',
        description: "Students will read and write about how Black South African students challenged the segregated school system under apartheid.",
        paired_oer_asset_name: 'Apartheid',
        paired_oer_asset_link: 'https://www.oerproject.com/OER-Materials/OER-Media/PDFs/1750/Unit8/Apartheid'
      }
    ]
  end

  def globalization_activities
    []
  end
end
