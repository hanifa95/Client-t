const API_URL = "https://67077010a0e04071d22a495c.mockapi.io/users";

export const getAllUsers = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const getUserByUid = async (uid) => {
  const users = await getAllUsers();
  return users.find((u) => u.uid === uid);
};

export const createUser = async (user) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return res.json();
};