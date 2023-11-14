import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Error from "./Error";
import styles from "./CityList.module.css";
import Message from "./Message";
export default function CityList({ cities, isLoading, error, onHandleDelete }) {
  if (isLoading) return <Spinner />;
  if (error) return <Error error={error} />;
  if (!cities.length)
    return (
      <Message message="add your first city be clicking on a city on the map" />
    );
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => {
        return (
          <CityItem key={city.id} city={city} onHandleDelete={onHandleDelete} />
        );
      })}
    </ul>
  );
}
