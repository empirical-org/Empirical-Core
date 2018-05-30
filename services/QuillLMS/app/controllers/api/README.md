### API Controllers

These Controllers are from communicating with the LMS from a different origin.
They should be protected by Doorkeeper.

We currently use the base controllers for some of the calls in the site React components.
We should look to consolidate most JSON data responses to the API namespaced controllers.

Controllers should be named ```API::[VERSION_NUMBER]::[RESOURCE_NAME]Controller``` so that the match the regular resource controller without clashing with the existing Controller actions and older versions of the API.
