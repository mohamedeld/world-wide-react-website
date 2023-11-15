import { useContext, createContext, useReducer } from "react";

const UserAuthContext = createContext();
const initialState = {
  user: null,
  isAuthenticated: false,
};
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "logout":
      return {
        ...initialState,
      };
    default:
      throw new Error("Unknown action");
  }
}
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function UserAuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }
  }
  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined)
    throw new Error("UserAuthContext was used outside the UserAuthProvider");
  return context;
}

export { UserAuthContext, UserAuthProvider, useUserAuth };
