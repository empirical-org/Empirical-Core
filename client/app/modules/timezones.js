/* Timezones are borrowed from Google Calendar */

// eslint-disable-next-line max-len
// [...$0.children].map(el => ({ label: (el.getAttribute('aria-label')|| '').replace(/\(.*?\)(.+)/, '$1').trim(), name: el.getAttribute('data-value'), offset: +(el.getAttribute('aria-label')|| '').replace(/\(.*?(-?[0-9]{2}):([0-9]{2})\).*/, (all, one, two) => +one + (two / 60) * (one > 0 ? 1 : -1)) }))

export default [
  {
    label: 'Niue Time',
    name: 'Pacific/Niue',
    offset: '-11:00',
  },
  {
    label: 'Samoa Standard Time',
    name: 'Pacific/Pago_Pago',
    offset: '-11:00',
  },
  {
    label: 'Cook Islands Standard Time',
    name: 'Pacific/Rarotonga',
    offset: '-10:00',
  },
  {
    label: 'Hawaii-Aleutian Standard Time',
    name: 'Pacific/Honolulu',
    offset: '-10:00',
  },
  {
    label: 'Hawaii-Aleutian Time',
    name: 'America/Adak',
    offset: '-10:00',
  },
  {
    label: 'Tahiti Time',
    name: 'Pacific/Tahiti',
    offset: '-10:00',
  },
  {
    label: 'Marquesas Time',
    name: 'Pacific/Marquesas',
    offset: '-09:30',
  },
  {
    label: 'Alaska Time - Anchorage',
    name: 'America/Anchorage',
    offset: '-09:00',
  },
  {
    label: 'Alaska Time - Juneau',
    name: 'America/Juneau',
    offset: '-09:00',
  },
  {
    label: 'Alaska Time - Nome',
    name: 'America/Nome',
    offset: '-09:00',
  },
  {
    label: 'Alaska Time - Sitka',
    name: 'America/Sitka',
    offset: '-09:00',
  },
  {
    label: 'Alaska Time - Yakutat',
    name: 'America/Yakutat',
    offset: '-09:00',
  },
  {
    label: 'Gambier Time',
    name: 'Pacific/Gambier',
    offset: '-09:00',
  },
  {
    label: 'Pacific Time - Dawson',
    name: 'America/Dawson',
    offset: '-08:00',
  },
  {
    label: 'Pacific Time - Los Angeles',
    name: 'America/Los_Angeles',
    offset: '-08:00',
  },
  {
    label: 'Pacific Time - Metlakatla',
    name: 'America/Metlakatla',
    offset: '-08:00',
  },
  {
    label: 'Pacific Time - Tijuana',
    name: 'America/Tijuana',
    offset: '-08:00',
  },
  {
    label: 'Pacific Time - Vancouver',
    name: 'America/Vancouver',
    offset: '-08:00',
  },
  {
    label: 'Pacific Time - Whitehorse',
    name: 'America/Whitehorse',
    offset: '-08:00',
  },
  {
    label: 'Pitcairn Time',
    name: 'Pacific/Pitcairn',
    offset: '-08:00',
  },
  {
    label: 'Mexican Pacific Standard Time',
    name: 'America/Hermosillo',
    offset: '-07:00',
  },
  {
    label: 'Mexican Pacific Time - Chihuahua',
    name: 'America/Chihuahua',
    offset: '-07:00',
  },
  {
    label: 'Mexican Pacific Time - Mazatlan',
    name: 'America/Mazatlan',
    offset: '-07:00',
  },
  {
    label: 'Mountain Standard Time - Creston',
    name: 'America/Creston',
    offset: '-07:00',
  },
  {
    label: 'Mountain Standard Time - Dawson Creek',
    name: 'America/Dawson_Creek',
    offset: '-07:00',
  },
  {
    label: 'Mountain Standard Time - Fort Nelson',
    name: 'America/Fort_Nelson',
    offset: '-07:00',
  },
  {
    label: 'Mountain Standard Time - Phoenix',
    name: 'America/Phoenix',
    offset: '-07:00',
  },
  {
    label: 'Mountain Time - Boise',
    name: 'America/Boise',
    offset: '-07:00',
  },
  {
    label: 'Mountain Time - Cambridge Bay',
    name: 'America/Cambridge_Bay',
    offset: '-07:00',
  },
  {
    label: 'Mountain Time - Denver',
    name: 'America/Denver',
    offset: '-07:00',
  },
  {
    label: 'Mountain Time - Edmonton',
    name: 'America/Edmonton',
    offset: '-07:00',
  },
  {
    label: 'Mountain Time - Inuvik',
    name: 'America/Inuvik',
    offset: '-07:00',
  },
  {
    label: 'Mountain Time - Ojinaga',
    name: 'America/Ojinaga',
    offset: '-07:00',
  },
  {
    label: 'Mountain Time - Yellowknife',
    name: 'America/Yellowknife',
    offset: '-07:00',
  },
  {
    label: 'Central Standard Time - Belize',
    name: 'America/Belize',
    offset: '-06:00',
  },
  {
    label: 'Central Standard Time - Costa Rica',
    name: 'America/Costa_Rica',
    offset: '-06:00',
  },
  {
    label: 'Central Standard Time - El Salvador',
    name: 'America/El_Salvador',
    offset: '-06:00',
  },
  {
    label: 'Central Standard Time - Guatemala',
    name: 'America/Guatemala',
    offset: '-06:00',
  },
  {
    label: 'Central Standard Time - Managua',
    name: 'America/Managua',
    offset: '-06:00',
  },
  {
    label: 'Central Standard Time - Regina',
    name: 'America/Regina',
    offset: '-06:00',
  },
  {
    label: 'Central Standard Time - Swift Current',
    name: 'America/Swift_Current',
    offset: '-06:00',
  },
  {
    label: 'Central Standard Time - Tegucigalpa',
    name: 'America/Tegucigalpa',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Bahia Banderas',
    name: 'America/Bahia_Banderas',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Beulah, North Dakota',
    name: 'America/North_Dakota/Beulah',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Center, North Dakota',
    name: 'America/North_Dakota/Center',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Chicago',
    name: 'America/Chicago',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Knox, Indiana',
    name: 'America/Indiana/Knox',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Matamoros',
    name: 'America/Matamoros',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Menominee',
    name: 'America/Menominee',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Merida',
    name: 'America/Merida',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Mexico City',
    name: 'America/Mexico_City',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Monterrey',
    name: 'America/Monterrey',
    offset: '-06:00',
  },
  {
    label: 'Central Time - New Salem, North Dakota',
    name: 'America/North_Dakota/New_Salem',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Rainy River',
    name: 'America/Rainy_River',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Rankin Inlet',
    name: 'America/Rankin_Inlet',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Resolute',
    name: 'America/Resolute',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Tell City, Indiana',
    name: 'America/Indiana/Tell_City',
    offset: '-06:00',
  },
  {
    label: 'Central Time - Winnipeg',
    name: 'America/Winnipeg',
    offset: '-06:00',
  },
  {
    label: 'Galapagos Time',
    name: 'Pacific/Galapagos',
    offset: '-06:00',
  },
  {
    label: 'Acre Standard Time - Eirunepe',
    name: 'America/Eirunepe',
    offset: '-05:00',
  },
  {
    label: 'Acre Standard Time - Rio Branco',
    name: 'America/Rio_Branco',
    offset: '-05:00',
  },
  {
    label: 'Colombia Standard Time',
    name: 'America/Bogota',
    offset: '-05:00',
  },
  {
    label: 'Cuba Time',
    name: 'America/Havana',
    offset: '-05:00',
  },
  {
    label: 'Easter Island Time',
    name: 'Pacific/Easter',
    offset: '-05:00',
  },
  {
    label: 'Eastern Standard Time - Atikokan',
    name: 'America/Atikokan',
    offset: '-05:00',
  },
  {
    label: 'Eastern Standard Time - Cancun',
    name: 'America/Cancun',
    offset: '-05:00',
  },
  {
    label: 'Eastern Standard Time - Jamaica',
    name: 'America/Jamaica',
    offset: '-05:00',
  },
  {
    label: 'Eastern Standard Time - Panama',
    name: 'America/Panama',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Detroit',
    name: 'America/Detroit',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Grand Turk',
    name: 'America/Grand_Turk',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Indianapolis',
    name: 'America/Indiana/Indianapolis',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Iqaluit',
    name: 'America/Iqaluit',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Louisville',
    name: 'America/Kentucky/Louisville',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Marengo, Indiana',
    name: 'America/Indiana/Marengo',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Monticello, Kentucky',
    name: 'America/Kentucky/Monticello',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Nassau',
    name: 'America/Nassau',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - New York',
    name: 'America/New_York',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Nipigon',
    name: 'America/Nipigon',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Pangnirtung',
    name: 'America/Pangnirtung',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Petersburg, Indiana',
    name: 'America/Indiana/Petersburg',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Port-au-Prince',
    name: 'America/Port-au-Prince',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Thunder Bay',
    name: 'America/Thunder_Bay',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Toronto',
    name: 'America/Toronto',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Vevay, Indiana',
    name: 'America/Indiana/Vevay',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Vincennes, Indiana',
    name: 'America/Indiana/Vincennes',
    offset: '-05:00',
  },
  {
    label: 'Eastern Time - Winamac, Indiana',
    name: 'America/Indiana/Winamac',
    offset: '-05:00',
  },
  {
    label: 'Ecuador Time',
    name: 'America/Guayaquil',
    offset: '-05:00',
  },
  {
    label: 'Peru Standard Time',
    name: 'America/Lima',
    offset: '-05:00',
  },
  {
    label: 'Amazon Standard Time - Boa Vista',
    name: 'America/Boa_Vista',
    offset: '-04:00',
  },
  {
    label: 'Amazon Standard Time - Manaus',
    name: 'America/Manaus',
    offset: '-04:00',
  },
  {
    label: 'Amazon Standard Time - Porto Velho',
    name: 'America/Porto_Velho',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Standard Time - Barbados',
    name: 'America/Barbados',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Standard Time - Blanc-Sablon',
    name: 'America/Blanc-Sablon',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Standard Time - Curaçao',
    name: 'America/Curacao',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Standard Time - Martinique',
    name: 'America/Martinique',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Standard Time - Port of Spain',
    name: 'America/Port_of_Spain',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Standard Time - Puerto Rico',
    name: 'America/Puerto_Rico',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Standard Time - Santo Domingo',
    name: 'America/Santo_Domingo',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Time - Bermuda',
    name: 'Atlantic/Bermuda',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Time - Glace Bay',
    name: 'America/Glace_Bay',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Time - Goose Bay',
    name: 'America/Goose_Bay',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Time - Halifax',
    name: 'America/Halifax',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Time - Moncton',
    name: 'America/Moncton',
    offset: '-04:00',
  },
  {
    label: 'Atlantic Time - Thule',
    name: 'America/Thule',
    offset: '-04:00',
  },
  {
    label: 'Bolivia Time',
    name: 'America/La_Paz',
    offset: '-04:00',
  },
  {
    label: 'Guyana Time',
    name: 'America/Guyana',
    offset: '-04:00',
  },
  {
    label: 'Venezuela Time',
    name: 'America/Caracas',
    offset: '-04:00',
  },
  {
    label: 'Newfoundland Time',
    name: 'America/St_Johns',
    offset: '-03:30',
  },
  {
    label: 'Amazon Time (Campo Grande)',
    name: 'America/Campo_Grande',
    offset: '-03:00',
  },
  {
    label: 'Amazon Time (Cuiaba)',
    name: 'America/Cuiaba',
    offset: '-03:00',
  },
  {
    label: 'Argentina Standard Time - Buenos Aires',
    name: 'America/Argentina/Buenos_Aires',
    offset: '-03:00',
  },
  {
    label: 'Argentina Standard Time - Catamarca',
    name: 'America/Argentina/Catamarca',
    offset: '-03:00',
  },
  {
    label: 'Argentina Standard Time - Cordoba',
    name: 'America/Argentina/Cordoba',
    offset: '-03:00',
  },
  {
    label: 'Argentina Standard Time - Jujuy',
    name: 'America/Argentina/Jujuy',
    offset: '-03:00',
  },
  {
    label: 'Argentina Standard Time - La Rioja',
    name: 'America/Argentina/La_Rioja',
    offset: '-03:00',
  },
  {
    label: 'Argentina Standard Time - Mendoza',
    name: 'America/Argentina/Mendoza',
    offset: '-03:00',
  },
  {
    label: 'Argentina Standard Time - Rio Gallegos',
    name: 'America/Argentina/Rio_Gallegos',
    offset: '-03:00',
  },
  {
    label: 'Argentina Standard Time - Salta',
    name: 'America/Argentina/Salta',
    offset: '-03:00',
  },
  {
    label: 'Argentina Standard Time - San Juan',
    name: 'America/Argentina/San_Juan',
    offset: '-03:00',
  },
  {
    label: 'Argentina Standard Time - Tucuman',
    name: 'America/Argentina/Tucuman',
    offset: '-03:00',
  },
  {
    label: 'Argentina Standard Time - Ushuaia',
    name: 'America/Argentina/Ushuaia',
    offset: '-03:00',
  },
  {
    label: 'Brasilia Standard Time - Araguaina',
    name: 'America/Araguaina',
    offset: '-03:00',
  },
  {
    label: 'Brasilia Standard Time - Bahia',
    name: 'America/Bahia',
    offset: '-03:00',
  },
  {
    label: 'Brasilia Standard Time - Belem',
    name: 'America/Belem',
    offset: '-03:00',
  },
  {
    label: 'Brasilia Standard Time - Fortaleza',
    name: 'America/Fortaleza',
    offset: '-03:00',
  },
  {
    label: 'Brasilia Standard Time - Maceio',
    name: 'America/Maceio',
    offset: '-03:00',
  },
  {
    label: 'Brasilia Standard Time - Recife',
    name: 'America/Recife',
    offset: '-03:00',
  },
  {
    label: 'Brasilia Standard Time - Santarem',
    name: 'America/Santarem',
    offset: '-03:00',
  },
  {
    label: 'Chile Time',
    name: 'America/Santiago',
    offset: '-03:00',
  },
  {
    label: 'Falkland Islands Standard Time',
    name: 'Atlantic/Stanley',
    offset: '-03:00',
  },
  {
    label: 'French Guiana Time',
    name: 'America/Cayenne',
    offset: '-03:00',
  },
  {
    label: 'Palmer Time',
    name: 'Antarctica/Palmer',
    offset: '-03:00',
  },
  {
    label: 'Paraguay Time',
    name: 'America/Asuncion',
    offset: '-03:00',
  },
  {
    label: 'Punta Arenas Time',
    name: 'America/Punta_Arenas',
    offset: '-03:00',
  },
  {
    label: 'Rothera Time',
    name: 'Antarctica/Rothera',
    offset: '-03:00',
  },
  {
    label: 'St. Pierre & Miquelon Time',
    name: 'America/Miquelon',
    offset: '-03:00',
  },
  {
    label: 'Suriname Time',
    name: 'America/Paramaribo',
    offset: '-03:00',
  },
  {
    label: 'Uruguay Standard Time',
    name: 'America/Montevideo',
    offset: '-03:00',
  },
  {
    label: 'West Greenland Time',
    name: 'America/Godthab',
    offset: '-03:00',
  },
  {
    label: 'Western Argentina Standard Time',
    name: 'America/Argentina/San_Luis',
    offset: '-03:00',
  },
  {
    label: 'Brasilia Time',
    name: 'America/Sao_Paulo',
    offset: '-02:00',
  },
  {
    label: 'Fernando de Noronha Standard Time',
    name: 'America/Noronha',
    offset: '-02:00',
  },
  {
    label: 'South Georgia Time',
    name: 'Atlantic/South_Georgia',
    offset: '-02:00',
  },
  {
    label: 'Azores Time',
    name: 'Atlantic/Azores',
    offset: '-01:00',
  },
  {
    label: 'Cape Verde Standard Time',
    name: 'Atlantic/Cape_Verde',
    offset: '-01:00',
  },
  {
    label: 'East Greenland Time',
    name: 'America/Scoresbysund',
    offset: '-01:00',
  },
  {
    label: 'Coordinated Universal Time',
    name: 'UTC',
    offset: '+00:00',
  },
  {
    label: 'Greenwich Mean Time',
    name: 'Etc/GMT',
    offset: '+00:00',
  },
  {
    label: 'Greenwich Mean Time - Abidjan',
    name: 'Africa/Abidjan',
    offset: '+00:00',
  },
  {
    label: 'Greenwich Mean Time - Accra',
    name: 'Africa/Accra',
    offset: '+00:00',
  },
  {
    label: 'Greenwich Mean Time - Bissau',
    name: 'Africa/Bissau',
    offset: '+00:00',
  },
  {
    label: 'Greenwich Mean Time - Danmarkshavn',
    name: 'America/Danmarkshavn',
    offset: '+00:00',
  },
  {
    label: 'Greenwich Mean Time - Monrovia',
    name: 'Africa/Monrovia',
    offset: '+00:00',
  },
  {
    label: 'Greenwich Mean Time - Reykjavik',
    name: 'Atlantic/Reykjavik',
    offset: '+00:00',
  },
  {
    label: 'Greenwich Mean Time - São Tomé',
    name: 'Africa/Sao_Tome',
    offset: '+00:00',
  },
  {
    label: 'Ireland Time',
    name: 'Europe/Dublin',
    offset: '+00:00',
  },
  {
    label: 'Troll Time',
    name: 'Antarctica/Troll',
    offset: '+00:00',
  },
  {
    label: 'United Kingdom Time',
    name: 'Europe/London',
    offset: '+00:00',
  },
  {
    label: 'Western European Time - Canary',
    name: 'Atlantic/Canary',
    offset: '+00:00',
  },
  {
    label: 'Western European Time - Faroe',
    name: 'Atlantic/Faroe',
    offset: '+00:00',
  },
  {
    label: 'Western European Time - Lisbon',
    name: 'Europe/Lisbon',
    offset: '+00:00',
  },
  {
    label: 'Western European Time - Madeira',
    name: 'Atlantic/Madeira',
    offset: '+00:00',
  },
  {
    label: 'Central European Standard Time - Algiers',
    name: 'Africa/Algiers',
    offset: '+01:00',
  },
  {
    label: 'Central European Standard Time - Tunis',
    name: 'Africa/Tunis',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Amsterdam',
    name: 'Europe/Amsterdam',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Andorra',
    name: 'Europe/Andorra',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Belgrade',
    name: 'Europe/Belgrade',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Berlin',
    name: 'Europe/Berlin',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Brussels',
    name: 'Europe/Brussels',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Budapest',
    name: 'Europe/Budapest',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Ceuta',
    name: 'Africa/Ceuta',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Copenhagen',
    name: 'Europe/Copenhagen',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Gibraltar',
    name: 'Europe/Gibraltar',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Luxembourg',
    name: 'Europe/Luxembourg',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Madrid',
    name: 'Europe/Madrid',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Malta',
    name: 'Europe/Malta',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Monaco',
    name: 'Europe/Monaco',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Oslo',
    name: 'Europe/Oslo',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Paris',
    name: 'Europe/Paris',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Prague',
    name: 'Europe/Prague',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Rome',
    name: 'Europe/Rome',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Stockholm',
    name: 'Europe/Stockholm',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Tirane',
    name: 'Europe/Tirane',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Vienna',
    name: 'Europe/Vienna',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Warsaw',
    name: 'Europe/Warsaw',
    offset: '+01:00',
  },
  {
    label: 'Central European Time - Zurich',
    name: 'Europe/Zurich',
    offset: '+01:00',
  },
  {
    label: 'Morocco Time',
    name: 'Africa/Casablanca',
    offset: '+01:00',
  },
  {
    label: 'West Africa Standard Time - Lagos',
    name: 'Africa/Lagos',
    offset: '+01:00',
  },
  {
    label: 'West Africa Standard Time - Ndjamena',
    name: 'Africa/Ndjamena',
    offset: '+01:00',
  },
  {
    label: 'Western Sahara Time',
    name: 'Africa/El_Aaiun',
    offset: '+01:00',
  },
  {
    label: 'Central Africa Time - Khartoum',
    name: 'Africa/Khartoum',
    offset: '+02:00',
  },
  {
    label: 'Central Africa Time - Maputo',
    name: 'Africa/Maputo',
    offset: '+02:00',
  },
  {
    label: 'Central Africa Time - Windhoek',
    name: 'Africa/Windhoek',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Standard Time - Cairo',
    name: 'Africa/Cairo',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Standard Time - Kaliningrad',
    name: 'Europe/Kaliningrad',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Standard Time - Tripoli',
    name: 'Africa/Tripoli',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Amman',
    name: 'Asia/Amman',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Athens',
    name: 'Europe/Athens',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Beirut',
    name: 'Asia/Beirut',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Bucharest',
    name: 'Europe/Bucharest',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Chisinau',
    name: 'Europe/Chisinau',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Damascus',
    name: 'Asia/Damascus',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Gaza',
    name: 'Asia/Gaza',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Hebron',
    name: 'Asia/Hebron',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Helsinki',
    name: 'Europe/Helsinki',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Kiev',
    name: 'Europe/Kiev',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Nicosia',
    name: 'Asia/Nicosia',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Riga',
    name: 'Europe/Riga',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Sofia',
    name: 'Europe/Sofia',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Tallinn',
    name: 'Europe/Tallinn',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Uzhhorod',
    name: 'Europe/Uzhgorod',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Vilnius',
    name: 'Europe/Vilnius',
    offset: '+02:00',
  },
  {
    label: 'Eastern European Time - Zaporozhye',
    name: 'Europe/Zaporozhye',
    offset: '+02:00',
  },
  {
    label: 'Famagusta Time',
    name: 'Asia/Famagusta',
    offset: '+02:00',
  },
  {
    label: 'Israel Time',
    name: 'Asia/Jerusalem',
    offset: '+02:00',
  },
  {
    label: 'South Africa Standard Time',
    name: 'Africa/Johannesburg',
    offset: '+02:00',
  },
  {
    label: 'Arabian Standard Time - Baghdad',
    name: 'Asia/Baghdad',
    offset: '+03:00',
  },
  {
    label: 'Arabian Standard Time - Qatar',
    name: 'Asia/Qatar',
    offset: '+03:00',
  },
  {
    label: 'Arabian Standard Time - Riyadh',
    name: 'Asia/Riyadh',
    offset: '+03:00',
  },
  {
    label: 'East Africa Time - Juba',
    name: 'Africa/Juba',
    offset: '+03:00',
  },
  {
    label: 'East Africa Time - Nairobi',
    name: 'Africa/Nairobi',
    offset: '+03:00',
  },
  {
    label: 'Kirov Time',
    name: 'Europe/Kirov',
    offset: '+03:00',
  },
  {
    label: 'Moscow Standard Time - Minsk',
    name: 'Europe/Minsk',
    offset: '+03:00',
  },
  {
    label: 'Moscow Standard Time - Moscow',
    name: 'Europe/Moscow',
    offset: '+03:00',
  },
  {
    label: 'Moscow Standard Time - Simferopol',
    name: 'Europe/Simferopol',
    offset: '+03:00',
  },
  {
    label: 'Syowa Time',
    name: 'Antarctica/Syowa',
    offset: '+03:00',
  },
  {
    label: 'Turkey Time',
    name: 'Europe/Istanbul',
    offset: '+03:00',
  },
  {
    label: 'Iran Time',
    name: 'Asia/Tehran',
    offset: '+03:30',
  },
  {
    label: 'Armenia Standard Time',
    name: 'Asia/Yerevan',
    offset: '+04:00',
  },
  {
    label: 'Astrakhan Time',
    name: 'Europe/Astrakhan',
    offset: '+04:00',
  },
  {
    label: 'Azerbaijan Standard Time',
    name: 'Asia/Baku',
    offset: '+04:00',
  },
  {
    label: 'Georgia Standard Time',
    name: 'Asia/Tbilisi',
    offset: '+04:00',
  },
  {
    label: 'Gulf Standard Time',
    name: 'Asia/Dubai',
    offset: '+04:00',
  },
  {
    label: 'Mauritius Standard Time',
    name: 'Indian/Mauritius',
    offset: '+04:00',
  },
  {
    label: 'Réunion Time',
    name: 'Indian/Reunion',
    offset: '+04:00',
  },
  {
    label: 'Samara Standard Time',
    name: 'Europe/Samara',
    offset: '+04:00',
  },
  {
    label: 'Saratov Time',
    name: 'Europe/Saratov',
    offset: '+04:00',
  },
  {
    label: 'Seychelles Time',
    name: 'Indian/Mahe',
    offset: '+04:00',
  },
  {
    label: 'Ulyanovsk Time',
    name: 'Europe/Ulyanovsk',
    offset: '+04:00',
  },
  {
    label: 'Volgograd Standard Time',
    name: 'Europe/Volgograd',
    offset: '+04:00',
  },
  {
    label: 'Afghanistan Time',
    name: 'Asia/Kabul',
    offset: '+04:30',
  },
  {
    label: 'French Southern & Antarctic Time',
    name: 'Indian/Kerguelen',
    offset: '+05:00',
  },
  {
    label: 'Maldives Time',
    name: 'Indian/Maldives',
    offset: '+05:00',
  },
  {
    label: 'Mawson Time',
    name: 'Antarctica/Mawson',
    offset: '+05:00',
  },
  {
    label: 'Pakistan Standard Time',
    name: 'Asia/Karachi',
    offset: '+05:00',
  },
  {
    label: 'Tajikistan Time',
    name: 'Asia/Dushanbe',
    offset: '+05:00',
  },
  {
    label: 'Turkmenistan Standard Time',
    name: 'Asia/Ashgabat',
    offset: '+05:00',
  },
  {
    label: 'Uzbekistan Standard Time - Samarkand',
    name: 'Asia/Samarkand',
    offset: '+05:00',
  },
  {
    label: 'Uzbekistan Standard Time - Tashkent',
    name: 'Asia/Tashkent',
    offset: '+05:00',
  },
  {
    label: 'West Kazakhstan Time - Aqtau',
    name: 'Asia/Aqtau',
    offset: '+05:00',
  },
  {
    label: 'West Kazakhstan Time - Aqtobe',
    name: 'Asia/Aqtobe',
    offset: '+05:00',
  },
  {
    label: 'West Kazakhstan Time - Atyrau',
    name: 'Asia/Atyrau',
    offset: '+05:00',
  },
  {
    label: 'West Kazakhstan Time - Oral',
    name: 'Asia/Oral',
    offset: '+05:00',
  },
  {
    label: 'West Kazakhstan Time - Qyzylorda',
    name: 'Asia/Qyzylorda',
    offset: '+05:00',
  },
  {
    label: 'Yekaterinburg Standard Time',
    name: 'Asia/Yekaterinburg',
    offset: '+05:00',
  },
  {
    label: 'India Standard Time - Colombo',
    name: 'Asia/Colombo',
    offset: '+05:30',
  },
  {
    label: 'India Standard Time - Kolkata',
    name: 'Asia/Kolkata',
    offset: '+05:30',
  },
  {
    label: 'Nepal Time',
    name: 'Asia/Kathmandu',
    offset: '+05:45',
  },
  {
    label: 'Bangladesh Standard Time',
    name: 'Asia/Dhaka',
    offset: '+06:00',
  },
  {
    label: 'Bhutan Time',
    name: 'Asia/Thimphu',
    offset: '+06:00',
  },
  {
    label: 'East Kazakhstan Time - Almaty',
    name: 'Asia/Almaty',
    offset: '+06:00',
  },
  {
    label: 'East Kazakhstan Time - Qostanay',
    name: 'Asia/Qostanay',
    offset: '+06:00',
  },
  {
    label: 'Indian Ocean Time',
    name: 'Indian/Chagos',
    offset: '+06:00',
  },
  {
    label: 'Kyrgyzstan Time',
    name: 'Asia/Bishkek',
    offset: '+06:00',
  },
  {
    label: 'Omsk Standard Time',
    name: 'Asia/Omsk',
    offset: '+06:00',
  },
  {
    label: 'Urumqi Time',
    name: 'Asia/Urumqi',
    offset: '+06:00',
  },
  {
    label: 'Vostok Time',
    name: 'Antarctica/Vostok',
    offset: '+06:00',
  },
  {
    label: 'Cocos Islands Time',
    name: 'Indian/Cocos',
    offset: '+06:30',
  },
  {
    label: 'Myanmar Time',
    name: 'Asia/Yangon',
    offset: '+06:30',
  },
  {
    label: 'Barnaul Time',
    name: 'Asia/Barnaul',
    offset: '+07:00',
  },
  {
    label: 'Christmas Island Time',
    name: 'Indian/Christmas',
    offset: '+07:00',
  },
  {
    label: 'Davis Time',
    name: 'Antarctica/Davis',
    offset: '+07:00',
  },
  {
    label: 'Hovd Standard Time',
    name: 'Asia/Hovd',
    offset: '+07:00',
  },
  {
    label: 'Indochina Time - Bangkok',
    name: 'Asia/Bangkok',
    offset: '+07:00',
  },
  {
    label: 'Indochina Time - Ho Chi Minh City',
    name: 'Asia/Ho_Chi_Minh',
    offset: '+07:00',
  },
  {
    label: 'Krasnoyarsk Standard Time - Krasnoyarsk',
    name: 'Asia/Krasnoyarsk',
    offset: '+07:00',
  },
  {
    label: 'Krasnoyarsk Standard Time - Novokuznetsk',
    name: 'Asia/Novokuznetsk',
    offset: '+07:00',
  },
  {
    label: 'Novosibirsk Standard Time',
    name: 'Asia/Novosibirsk',
    offset: '+07:00',
  },
  {
    label: 'Tomsk Time',
    name: 'Asia/Tomsk',
    offset: '+07:00',
  },
  {
    label: 'Western Indonesia Time - Jakarta',
    name: 'Asia/Jakarta',
    offset: '+07:00',
  },
  {
    label: 'Western Indonesia Time - Pontianak',
    name: 'Asia/Pontianak',
    offset: '+07:00',
  },
  {
    label: 'Australian Western Standard Time - Casey',
    name: 'Antarctica/Casey',
    offset: '+08:00',
  },
  {
    label: 'Australian Western Standard Time - Perth',
    name: 'Australia/Perth',
    offset: '+08:00',
  },
  {
    label: 'Brunei Darussalam Time',
    name: 'Asia/Brunei',
    offset: '+08:00',
  },
  {
    label: 'Central Indonesia Time',
    name: 'Asia/Makassar',
    offset: '+08:00',
  },
  {
    label: 'China Standard Time - Macau',
    name: 'Asia/Macau',
    offset: '+08:00',
  },
  {
    label: 'China Standard Time - Shanghai',
    name: 'Asia/Shanghai',
    offset: '+08:00',
  },
  {
    label: 'Choibalsan Standard Time',
    name: 'Asia/Choibalsan',
    offset: '+08:00',
  },
  {
    label: 'Hong Kong Standard Time',
    name: 'Asia/Hong_Kong',
    offset: '+08:00',
  },
  {
    label: 'Irkutsk Standard Time',
    name: 'Asia/Irkutsk',
    offset: '+08:00',
  },
  {
    label: 'Malaysia Time - Kuala Lumpur',
    name: 'Asia/Kuala_Lumpur',
    offset: '+08:00',
  },
  {
    label: 'Malaysia Time - Kuching',
    name: 'Asia/Kuching',
    offset: '+08:00',
  },
  {
    label: 'Philippine Standard Time',
    name: 'Asia/Manila',
    offset: '+8:00',
  },
  {
    label: 'Singapore Standard Time',
    name: 'Asia/Singapore',
    offset: '+8:00',
  },
  {
    label: 'Taipei Standard Time',
    name: 'Asia/Taipei',
    offset: '+8:00',
  },
  {
    label: 'Ulaanbaatar Standard Time',
    name: 'Asia/Ulaanbaatar',
    offset: '+8:00',
  },
  {
    label: 'Australian Central Western Standard Time',
    name: 'Australia/Eucla',
    offset: '+8:45',
  },
  {
    label: 'East Timor Time',
    name: 'Asia/Dili',
    offset: '+09:00',
  },
  {
    label: 'Eastern Indonesia Time',
    name: 'Asia/Jayapura',
    offset: '+09:00',
  },
  {
    label: 'Japan Standard Time',
    name: 'Asia/Tokyo',
    offset: '+09:00',
  },
  {
    label: 'Korean Standard Time - Pyongyang',
    name: 'Asia/Pyongyang',
    offset: '+09:00',
  },
  {
    label: 'Korean Standard Time - Seoul',
    name: 'Asia/Seoul',
    offset: '+09:00',
  },
  {
    label: 'Palau Time',
    name: 'Pacific/Palau',
    offset: '+09:00',
  },
  {
    label: 'Yakutsk Standard Time - Chita',
    name: 'Asia/Chita',
    offset: '+09:00',
  },
  {
    label: 'Yakutsk Standard Time - Khandyga',
    name: 'Asia/Khandyga',
    offset: '+09:00',
  },
  {
    label: 'Yakutsk Standard Time - Yakutsk',
    name: 'Asia/Yakutsk',
    offset: '+09:00',
  },
  {
    label: 'Australian Central Standard Time',
    name: 'Australia/Darwin',
    offset: '+09:30',
  },
  {
    label: 'Australian Eastern Standard Time - Brisbane',
    name: 'Australia/Brisbane',
    offset: '+10:00',
  },
  {
    label: 'Australian Eastern Standard Time - Lindeman',
    name: 'Australia/Lindeman',
    offset: '+10:00',
  },
  {
    label: 'Chamorro Standard Time',
    name: 'Pacific/Guam',
    offset: '+10:00',
  },
  {
    label: 'Chuuk Time',
    name: 'Pacific/Chuuk',
    offset: '+10:00',
  },
  {
    label: 'Dumont-d’Urville Time',
    name: 'Antarctica/DumontDUrville',
    offset: '+10:00',
  },
  {
    label: 'Papua New Guinea Time',
    name: 'Pacific/Port_Moresby',
    offset: '+10:00',
  },
  {
    label: 'Vladivostok Standard Time - Ust-Nera',
    name: 'Asia/Ust-Nera',
    offset: '+10:00',
  },
  {
    label: 'Vladivostok Standard Time - Vladivostok',
    name: 'Asia/Vladivostok',
    offset: '+10:00',
  },
  {
    label: 'Central Australia Time - Adelaide',
    name: 'Australia/Adelaide',
    offset: '+10:30',
  },
  {
    label: 'Central Australia Time - Broken Hill',
    name: 'Australia/Broken_Hill',
    offset: '+10:30',
  },
  {
    label: 'Bougainville Time',
    name: 'Pacific/Bougainville',
    offset: '+11:00',
  },
  {
    label: 'Eastern Australia Time - Currie',
    name: 'Australia/Currie',
    offset: '+11:00',
  },
  {
    label: 'Eastern Australia Time - Hobart',
    name: 'Australia/Hobart',
    offset: '+11:00',
  },
  {
    label: 'Eastern Australia Time - Melbourne',
    name: 'Australia/Melbourne',
    offset: '+11:00',
  },
  {
    label: 'Eastern Australia Time - Sydney',
    name: 'Australia/Sydney',
    offset: '+11:00',
  },
  {
    label: 'Kosrae Time',
    name: 'Pacific/Kosrae',
    offset: '+11:00',
  },
  {
    label: 'Lord Howe Time',
    name: 'Australia/Lord_Howe',
    offset: '+11:00',
  },
  {
    label: 'Macquarie Island Time',
    name: 'Antarctica/Macquarie',
    offset: '+11:00',
  },
  {
    label: 'Magadan Standard Time',
    name: 'Asia/Magadan',
    offset: '+11:00',
  },
  {
    label: 'New Caledonia Standard Time',
    name: 'Pacific/Noumea',
    offset: '+11:00',
  },
  {
    label: 'Norfolk Island Time',
    name: 'Pacific/Norfolk',
    offset: '+11:00',
  },
  {
    label: 'Ponape Time',
    name: 'Pacific/Pohnpei',
    offset: '+11:00',
  },
  {
    label: 'Sakhalin Standard Time',
    name: 'Asia/Sakhalin',
    offset: '+11:00',
  },
  {
    label: 'Solomon Islands Time',
    name: 'Pacific/Guadalcanal',
    offset: '+11:00',
  },
  {
    label: 'Srednekolymsk Time',
    name: 'Asia/Srednekolymsk',
    offset: '+11:00',
  },
  {
    label: 'Vanuatu Standard Time',
    name: 'Pacific/Efate',
    offset: '+11:00',
  },
  {
    label: 'Anadyr Standard Time',
    name: 'Asia/Anadyr',
    offset: '+12:00',
  },
  {
    label: 'Fiji Time',
    name: 'Pacific/Fiji',
    offset: '+12:00',
  },
  {
    label: 'Gilbert Islands Time',
    name: 'Pacific/Tarawa',
    offset: '+12:00',
  },
  {
    label: 'Marshall Islands Time - Kwajalein',
    name: 'Pacific/Kwajalein',
    offset: '+12:00',
  },
  {
    label: 'Marshall Islands Time - Majuro',
    name: 'Pacific/Majuro',
    offset: '+12:00',
  },
  {
    label: 'Nauru Time',
    name: 'Pacific/Nauru',
    offset: '+12:00',
  },
  {
    label: 'Petropavlovsk-Kamchatski Standard Time',
    name: 'Asia/Kamchatka',
    offset: '+12:00',
  },
  {
    label: 'Tuvalu Time',
    name: 'Pacific/Funafuti',
    offset: '+12:00',
  },
  {
    label: 'Wake Island Time',
    name: 'Pacific/Wake',
    offset: '+12:00',
  },
  {
    label: 'Wallis & Futuna Time',
    name: 'Pacific/Wallis',
    offset: '+12:00',
  },
  {
    label: 'New Zealand Time',
    name: 'Pacific/Auckland',
    offset: '+13:00',
  },
  {
    label: 'Phoenix Islands Time',
    name: 'Pacific/Enderbury',
    offset: '+13:00',
  },
  {
    label: 'Tokelau Time',
    name: 'Pacific/Fakaofo',
    offset: '+13:00',
  },
  {
    label: 'Tonga Standard Time',
    name: 'Pacific/Tongatapu',
    offset: '+13:00',
  },
  {
    label: 'Chatham Time',
    name: 'Pacific/Chatham',
    offset: '+13:45',
  },
  {
    label: 'Apia Time',
    name: 'Pacific/Apia',
    offset: '+14:00',
  },
  {
    label: 'Line Islands Time',
    name: 'Pacific/Kiritimati',
    offset: '+14:00',
  },
];
