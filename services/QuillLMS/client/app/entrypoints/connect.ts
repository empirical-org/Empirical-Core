// To see this message, add the following to the `<head>` section in your
// views/layouts/application.html.erb
//
//    <%= vite_client_tag %>
//    <%= vite_javascript_tag 'application' %>

// If using a TypeScript entrypoint file:
//     <%= vite_typescript_tag 'application' %>
//
// If you want to use .jsx or .tsx, add the extension:
//     <%= vite_javascript_tag 'application.jsx' %>

console.log('connect.tsx Vite ⚡️ Rails')
// Example: Load Rails libraries in Vite.
//
// import * as Turbo from '@hotwired/turbo'
// Turbo.start()
//
// import ActiveStorage from '@rails/activestorage'
// ActiveStorage.start()
//
// // Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

// Example: Import a stylesheet in app/frontend/index.css
// import '~/index.css'



import '../bundles/Connect/clientRegistration';
// import '../bundles/Login/startup/clientRegistration';
// import '../bundles/Staff/startup/clientRegistration';




// import LockerApp from '../../Staff/startup/lockerAppClient'
// module.exports = {
//   mode,
//   context: __dirname,
//   entry: {
//     shared: [
//       './app/bundles/Shared/styles/styles.scss'
//     ],
//     app: [
//       './app/bundles/Teacher/startup/clientRegistration'
//     ],
//     home: [
//       './app/bundles/Home/home'
//     ],
//     student: [
//       './app/bundles/Student/startup/clientRegis
