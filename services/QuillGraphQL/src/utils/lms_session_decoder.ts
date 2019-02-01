const crypto = require('crypto')
const secret = process.env.SESSION_SECRET;
var salt = process.env.SESSION_SALT;
const lmsCookieName = process.env.SESSION_NAME;
export interface DecodedCookie {
  session_id?: string
  _csrf_token?: string
  user_id?: number
  name?: string
  role?: string
  lesson_session?: {
    user_id?: number
    role?: string 
    classroom_unit_id?: number
    classroom_session_id?: string
  }
}

export function createDerivedKey(secret:string, salt:string):Buffer{
  return crypto.pbkdf2Sync(secret, salt, 1000, 64, 'sha1');
}

export const derivedKey = createDerivedKey(secret, salt);

export function parseCookiesString(cookies: string): any {
  const cookiesArray:string[] = cookies.split("; ")
  const cookieHash = {};
  cookiesArray.forEach((cookie) => {
    const kvPair = cookie.split("=")
    cookieHash[kvPair[0]] = kvPair[1]
  })
  return cookieHash
}

export function httpOrSocket(){

}

export function decodeLMSWebsocketSession(cookies:string):DecodedCookie|null {
  const cookie = parseCookiesString(cookies)[lmsCookieName];
  return cookie ? lmsCookieToJSON(cookie) : null;
}

export function lmsCookieToJSON(cookie: string): DecodedCookie {
  var cookieSegments = cookie.split('--');
  // if (cookieSegments.length != 2) {
  //   return next(new Error('invalid cookie format.'));
  // }

  var sessionData = new Buffer(cookieSegments[0], 'base64');
  // var signature = cookieSegments[1];

  var sessionDataSegments = sessionData.toString('utf8').split('--');
  // if (sessionDataSegments.length != 2) {
  //   return next(new Error('invalid cookie format.'));
  // }

  var data = new Buffer(sessionDataSegments[0], 'base64');
  var iv = new Buffer(sessionDataSegments[1], 'base64');

  var decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey.slice(0, 32), iv.slice(0, 16));
  var decryptedData = decipher.update(data, 'binary', 'utf8') + decipher.final('utf8');
  return JSON.parse(decryptedData)
}

function decodeLmsSession(req): DecodedCookie|null {
  if (req == undefined) { return {} }
  const cookie = req.cookies[process.env.SESSION_NAME];

  if (cookie) {
    return lmsCookieToJSON(cookie)
  } else {
    return null
  }

  
}



export default decodeLmsSession