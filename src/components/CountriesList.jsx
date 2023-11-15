import Spinner from "./Spinner";
import Error from "./Error";
import styles from "./CountryList.module.css";
import { useCities } from "../contexts/CitiesContext";
import Message from "./Message";
import CountryItem from "./CountryItem";
export default function CountriesList() {
  const { cities, isLoading, error } = useCities();
  if (isLoading) return <Spinner />;
  if (error) return <Error error={error} />;
  if (!cities.length)
    return (
      <Message message="add your first city be clicking on a city on the map" />
    );
  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);
  return (
    <ul className={styles.countriesList}>
      {countries.map((country) => {
        return <CountryItem key={country.country} country={country} />;
      })}
    </ul>
  );
}
