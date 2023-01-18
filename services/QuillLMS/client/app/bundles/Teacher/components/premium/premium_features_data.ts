export const premiumFeatures = ({ independentPracticeActivityCount, diagnosticActivityCount, lessonsActivityCount, }) => ([
  {
    header: 'Writing tools',
    features: [
      {
        basic: true,
        label: `${independentPracticeActivityCount} independent practice activities`,
        school: true,
        teacher: true,
        tooltipText: "Research-backed, 10-15 minute independent practice activities covering a variety of concepts"
      },
      {
        basic: true,
        label: `${diagnosticActivityCount} diagnostic assessments`,
        school: true,
        teacher: true,
        tooltipText: "Baseline assessments that generate weeks of recommended follow-up practice"
      },
      {
        basic: true,
        label: `${lessonsActivityCount} collaborative full-class lessons`,
        school: true,
        teacher: true,
        tooltipText: "Teacher-led learning activities for whole class instruction, with built-in customizable slides and lesson plans"
      },
    ]
  },
  {
    header: 'Data reports',
    features: [
      {
        basic: true,
        label: "Activity summary report",
        school: true,
        teacher: true,
        tooltipText: "Provides a visual overview of student's proficiency range, percentage score, and activity completion",
      },
      {
        basic: true,
        label: "Activity analysis report",
        school: true,
        teacher: true,
        tooltipText: "Follow a student's thought pattern by reviewing any activity's prompts, student's responses, and feedback received",
      },
      {
        basic: true,
        label: "Diagnostics report",
        school: true,
        teacher: true,
        tooltipText: "Assign personalized learning plans according to student's diagnostic results and review student's responses and score",
      },
      {
        label: "Activity scores report",
        school: true,
        teacher: true,
        tooltipText: "Easily access each student's activity scores, in a downloadable PDF or CSV format",
      },
      {
        label: "Concepts report",
        school: true,
        teacher: true,
        tooltipText: "Analyze each student's proficiency in a range of grammar concepts",
      },
      {
        label: "Standards report",
        school: true,
        teacher: true,
        tooltipText: "See which Common Core standards your Quill activities have covered and the proficiency status of each student",
      },
      {
        label: "Data export capabilities",
        school: true,
        teacher: true,
        tooltipText: "Download student data according to your specific needs, in PDF or CSV format",
      },
      {
        label: "Custom reporting",
        school: true,
        tooltipText: "Manage your student scores and customize the reports to fit your grading needs",
      },
      {
        label: "Monthly usage reports",
        school: true,
        tooltipText: "Email updates delivered monthly to your inbox, providing you an easy overview of student Quill usage",
      },
      {
        label: "Administrator dashboard",
        school: true,
        tooltipText: "Provides administrators with school-wide data and full access to teachers' dashboards",
      },
    ]
  },
  {
    header: 'Rostering',
    features: [
      {
        basic: true,
        label: "Manual rostering",
        school: true,
        teacher: true,
        tooltipText: "Have full control over your students' log in credentials and how students sign up for your class.",
      },
      {
        basic: true,
        label: "Google Classroom sync",
        school: true,
        teacher: true,
        tooltipText: "Sync your rosters with Google Classroom sections to allow students to log into Quill with Google credentials and send announcements when you post assignments.",
      },
      {
        basic: true,
        label: "Clever Library sync",
        school: true,
        teacher: true,
        tooltipText: "A single sign on option where teachers can add the Quill app to students' Clever dashboards and sync their rosters.",
      },
      {
        label: "Clever Secure sync at the school or district level",
        school: true,
        tooltipText: "A single sign on option that lets schools or districts automatically sync teacher's Clever rosters with their Quill classes.",
      },
      {
        label: "Unlimited number of teacher licenses",
        school: true,
        tooltipText: "All teachers in the school or district receive premium access for consistent implementation in writing courses.",
      },
    ]
  },
  {
    header: 'Professional development and support',
    features: [
      {
        basic: true,
        label: "Spotlight webinars",
        school: true,
        teacher: true,
        tooltipText: "30 - 60 minute webinars to take a deep-dive into Quill features to help teachers leverage all features of Quill successfully.",
      },
      {
        basic: true,
        label: "Teacher Center best practice resources",
        school: true,
        teacher: true,
        tooltipText: "Access 160+ best practices and implementation articles as needed to improve your understanding and implementation of Quill.",
      },
      {
        label: "Priority technical support",
        school: true,
        tooltipText: "Support tickets identified with priority user status to resolve tech issues swiftly.",
      },
      {
        label: "Quill Academy",
        school: true,
      },
      {
        label: "Getting started training",
        schoolText: "Included with District Premium",
        tooltipText: "Work with your assigned Senior Instructional Coach for a live, hour-long virtual training to get teachers set up for success on Quill.",
      },
      {
        label: "Guided onboarding",
        schoolText: "Included with District Premium",
        tooltipText: "Work with your assigned Senior Instructional Coach to get all users on your license set up quickly.",
      },
      {
        label: "Two professional development sessions",
        schoolText: "Included with District Premium",
        tooltipText: "Assigned Senior Instructional Coach delivers PDs tailored to the needs of teachers.",
      },
    ]
  }
])
