# Feature Progress for Issue 3959
*delete this file before merging into master*

- ~app/controllers/api/v1/progress_reports_controller.rb - add method for district_standards_reports~
- ~app/queries/progress_reports/district_standards_reports.rb - write sql query for standards reports~
- ~client/app/actions/district_standards_reports.rb~
- ~client/app/bundles/HelloWorld/components/admin_dashboard/subnav_tabs.jsx - add 'District Standards Reports' to subnav~
- ~**client/app/bundles/HelloWorld/components/progress_reports/district_standards_reports_progress_report.jsx**~
- ~client/app/bundles/HelloWorld/containers/AdminDashboardRouter.jsx - add Route for district standards reports~
- client/app/bundles/HelloWorld/startup/AdminDashboardAppClient.jsx - add new reducer to combined reducer
- client/app/bundles/admin_dashboard/components/standards_reports.jsx
- client/app/bundles/admin_dashboard/components/standards_reports_table.jsx 
- client/app/bundles/admin_dashboard/components/subnav_tabs.jsx - add 'District Standards Reports' to subnav
- client/app/bundles/admin_dashboard/containers/DistrictStandardsReports.jsx
- client/app/bundles/admin_dashboard/containers/__tests__/DistrictStandardsReports.test.jsx
- client/app/reducers/__test__/district_standards_reports.test.js
- client/app/reducers/district_standards_reports.js
- config/routes.rb
