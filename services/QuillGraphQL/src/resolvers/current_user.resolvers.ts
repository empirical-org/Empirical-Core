import { DecodedCookie } from "../utils/lms_session_decoder";

export interface CurrentUserData {
  id: number
  name: string
  role: string
}

export interface AnonymousUser {

}

export default {
  Query: {
    currentUser: (_, args, {user}) => convertCookieToUser(user)
  }
};

function convertCookieToUser(decodedCookie:DecodedCookie): CurrentUserData|AnonymousUser {
  console.log(decodedCookie);
  if (decodedCookie["user_id"]) {
    return {
      id: decodedCookie["user_id"],
      name: decodedCookie["name"],
      role: decodedCookie["role"]
    }
  } else {
    return {}
  }
}