import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";

function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
  function handleDelete(id) {
    setCities((prevState) => prevState.filter((city) => city.id !== id));
  }
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="product" element={<Product />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="app" element={<AppLayout />}>
            <Route
              index
              element={
                <CityList
                  cities={cities}
                  isLoading={isLoading}
                  error={error}
                  onHandleDelete={handleDelete}
                />
              }
            />
            <Route
              path="cities"
              element={
                <CityList
                  cities={cities}
                  isLoading={isLoading}
                  error={error}
                  onHandleDelete={handleDelete}
                />
              }
            />
            <Route path="countries" element={<p>List of countries</p>} />
            <Route path="form" element={<p>forms</p>} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
