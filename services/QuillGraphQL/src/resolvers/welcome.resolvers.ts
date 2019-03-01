export default {
  Query: {
    welcome: (_, { yourNickname }, {user}) => {
      console.log(user);
     
      return `Welcome, ${user.name || "here"}!`
    }
  }
};