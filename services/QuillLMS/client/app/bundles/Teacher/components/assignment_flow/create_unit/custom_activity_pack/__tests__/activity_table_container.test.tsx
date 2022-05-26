import * as React from "react"
import { mount } from "enzyme"

import { activities } from "./data"

import ActivityTableContainer from "../activity_table_container"
import { DEFAULT } from "../shared"

describe("ActivityTableContainer component", () => {
  const props = {
    filteredActivities: activities,
    selectedActivities: [],
    toggleActivitySelection: () => {},
    currentPage: 1,
    setCurrentPage: () => {},
    search: "",
    handleSearch: () => {},
    undoLastFilter: () => {},
    resetAllFilters: () => {},
    setShowMobileFilterMenu: () => {},
    setShowMobileSortMenu: () => {},
    sort: DEFAULT,
    setSort: () => {},
  }

  describe("default", () => {
    const wrapper = mount(<ActivityTableContainer {...props} />)

    it("should render", () => {
      expect(wrapper).toMatchSnapshot()
    })

    it("should not render a lessons banner", () => {
      expect(wrapper.find(".lessons-banner").length).toBe(0)
    })
  })

  describe("showLessonsBanner prop is true and one of the selected activities is a lesson ", () => {
    const selectedActivitiesWithLesson = [
      {
        name: "Lesson 1: And, Or, But, So",
        description:
          "Students learn to combine sentences using and, or, but, and so to create a compound sentence. This is the first of two lessons in the compound sentences lesson pack.",
        flags: "{production}",
        id: 563,
        uid: "-KsK-ymM2op_xype1Fay",
        anonymous_path: "/activity_sessions/anonymous?activity_id=563",
        activity_classification: {
          alias: "Quill Lessons",
          description: "Lead Group Lessons",
          key: "lessons",
          id: 6,
        },
        activity_category: { id: 14, name: "Compound Sentences" },
        activity_category_name: "Compound Sentences",
        activity_category_id: 14,
        standard_level_id: 13,
        standard_level: { id: 13, name: "CCSS: Grade 7" },
        standard_level_name: "CCSS: Grade 7",
        standard_name:
          "7.1b Choose among simple, compound, complex, and compound-complex sentences to signal differing relationships among ideas",
        content_partners: [],
        topics: [],
        readability_grade_level: null,
      },
    ]
    const wrapper = mount(
      <ActivityTableContainer
        {...props}
        selectedActivities={selectedActivitiesWithLesson}
        showLessonsBanner={true}
      />
    )

    it("should render a disclaimer banner", () => {
      expect(wrapper.find(".assigning-activity-disclaimer-banner").length).toBe(1)
    })
  })
})
