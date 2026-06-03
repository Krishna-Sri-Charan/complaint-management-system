export const getUser = () => {

  const user =
    localStorage.getItem(
      "cms_user"
    );

  return user
    ? JSON.parse(user)
    : null;
};

export const getToken = () => {

  return localStorage.getItem(
    "cms_token"
  );
};

export const logout = () => {

  localStorage.removeItem(
    "cms_token"
  );

  localStorage.removeItem(
    "cms_user"
  );

  window.location.href = "/";
};