export const premiumFeatures = ({ independentPracticeActivityCount, diagnosticActivityCount, lessonsActivityCount, }) => ([
  {
    header: 'Writing tools',
    features: [
      {
        basic: true,
        label: `${independentPracticeActivityCount} independent practice activities`,
        school: true,
        teacher: true,
        tooltipText: "Researched-backed, 10-15 minute writing and grammar practice"
      },
      {
        basic: true,
        label: `${diagnosticActivityCount} diagnostic assessments`,
        school: true,
        teacher: true,
        tooltipText: "Baseline assessments that build custom writing practice pathways"
      },
      {
        basic: true,
        label: `${lessonsActivityCount} collaborative full-class lessons`,
        school: true,
        teacher: true,
        tooltipText: "Interactive, teacher-led learning experiences"
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
        tooltipText: "Visual overview of activity completion and performance",
      },
      {
        basic: true,
        label: "Activity analysis report",
        school: true,
        teacher: true,
        tooltipText: "In-depth look at a student's performance on individual activities",
      },
      {
        basic: true,
        label: "Diagnostics report",
        school: true,
        teacher: true,
        tooltipText: "TODO",
      },
      {
        label: "Activity scores report",
        school: true,
        teacher: true,
        tooltipText: "Comprehensive Quill report card that outlines proficiency over time",
      },
      {
        label: "Concepts report",
        school: true,
        teacher: true,
        tooltipText: "In-depth breakdown of each student's proficiency by grammar concept",
      },
      {
        label: "Standards report",
        school: true,
        teacher: true,
        tooltipText: "Common Core standard proficiency at the individual level and full-class level",
      },
      {
        label: "Data export capabilities",
        school: true,
        teacher: true,
        tooltipText: "Export student data as a CSV or PDF",
      },
      {
        label: "Custom reporting",
        school: true,
        tooltipText: "Student data breakdowns tailored to your specific requests",
      },
      {
        label: "Monthly usage reports",
        school: true,
        tooltipText: "Automated reports sent right to your inbox",
      },
      {
        label: "Administrator dashboard",
        school: true,
        tooltipText: "Provides administrators with access to school-wide data and usage information",
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
        tooltipText: "Lets you and your students create your own login credentials for Quill",
      },
      {
        basic: true,
        label: "Google Classroom sync",
        school: true,
        teacher: true,
        tooltipText: "Lets teachers import class rosters from Google Classroom, allows users to log into Quill with Google credentials",
      },
      {
        basic: true,
        label: "Clever Library sync",
        school: true,
        teacher: true,
        tooltipText: "Lets teachers import class rosters from Clever Library, allows users to log into Quill with Clever Library credentials",
      },
      {
        label: "Clever Secure sync at the school or district level",
        school: true,
        tooltipText: "Lets entire schools or districts import class rosters, allows users to log into Quill with Clever credentials",
      },
      {
        label: "Unlimited number of teacher licenses",
        school: true,
        tooltipText: "Provides all teachers in a school or district with access to Premium features",
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
        tooltipText: "30 - 60 minute webinars to help teachers utilize Quill's tools with their students in meaningful and impactful ways",
      },
      {
        basic: true,
        label: "Teacher Center best practice resources",
        school: true,
        teacher: true,
        tooltipText: "Comprehensive overviews of Quill's best practices and implementation tips provided by Quill's instructional experts.",
      },
      {
        label: "Getting started training",
        school: true,
        tooltipText: "Live, hour-long virtual training to help teachers get set up for success on Quill",
      },
      {
        label: "Guided onboarding",
        school: true,
        tooltipText: "Work with a Quill Partnerships Specialist to get everyone set up quickly",
      },
      {
        label: "Two professional development sessions",
        school: true,
        tooltipText: "Comprehensive workshop-style PDs tailored to the needs of teachers",
      },
      {
        label: "Three one-on-one coaching sessions per teacher",
        school: true,
        tooltipText: "Check ins with Quill coaches to help teachers meet their writing instruction goals",
      },
      {
        label: "Priority technical support",
        school: true,
        tooltipText: "Access to a direct support representative to help resolve tech issues swiftly",
      },
    ]
  }
])
