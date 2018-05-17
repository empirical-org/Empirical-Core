#Users Endpoints

## #index
GET `/api/v1/users`

Returns a hash of the following format:
`{user: current_user, text: 'Hi'}`

## #current_user_and_coteachers
GET `/api/v1/users/current_user_and_coteachers`

Returns a hash of the following format:

`{user: current_user, coteachers: Array({name: coteacher.name, id: coteacher.id})}`
