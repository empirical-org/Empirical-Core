export const fetchUserRole = async () => {
  const response = await fetch(`${process.env.DEFAULT_URL}/api/v1/users/current_user_role`);
  const role = await response.json();
  return role;
}
