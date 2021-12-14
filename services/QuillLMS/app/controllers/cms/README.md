### CMS Controllers

Controllers in this directory power the Staff dashboard.
They allow editing of data that is normally locked to a Teacher account.
Anything that allows us to overwrite user data should be namespaced under the /cms/ route.

Make sure to call ```before_action :staff!``` before the actions to lock down access

Controllers should be named ```CMS::[RESOURCE_NAME]Controller``` so that the match the regular resource controller without clashing with the existing Controller actions.
