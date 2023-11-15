import { useState, useContext, useEffect, createContext } from "react";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentCity, setCurrentCity] = useState({});
  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:9000/cities");
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.log("error with fetching data");
        setError(err.message);
      } finally {
        setIsLoading(false);
        setError("");
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:9000/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setError("");
    }
  }

  function handleDelete(id) {
    setCities((prevState) => prevState.filter((city) => city.id !== id));
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        error,
        onDelete: handleDelete,
        getCity,
        currentCity,
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
