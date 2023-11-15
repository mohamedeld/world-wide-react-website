import { useReducer, useContext, useEffect, createContext } from "react";

const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  error: "",
  currentCity: {},
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("Unknown action");
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, error, currentCity } = state;
  //   const [cities, setCities] = useState([]);
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [error, setError] = useState("");
  //   const [currentCity, setCurrentCity] = useState({});
  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch("http://localhost:9000/cities");
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload:
            "there was an error while fetching the data ..." + err.message,
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`http://localhost:9000/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "there was an error while fetching the data ..." + err.message,
      });
    }
  }
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`http://localhost:9000/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "there was an error while fetching the data ..." + err.message,
      });
    }
  }

  async function handleDelete(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`http://localhost:9000/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "there was an error while fetching the data ..." + err.message,
      });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        error,
        handleDelete,
        getCity,
        currentCity,
        createCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("ContextCities was used outside the CitiesProvider");
  return context;
}

export { CitiesContext, CitiesProvider, useCities };
