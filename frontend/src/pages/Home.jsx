import { useAuth } from "../context/UserContext";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
function Home() {
  const { user } = useAuth();
  const currentDate = new Date();
  const birthDate = new Date(user?.user_birth_date);
  const nextBirthday = new Date(
    currentDate.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  if (nextBirthday < currentDate) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }

  const timeUntilNextBirthday = nextBirthday.getTime() - currentDate.getTime();
  const daysUntilNextBirthday = Math.ceil(
    timeUntilNextBirthday / (1000 * 60 * 60 * 24)
  );

  return (
    <section className="home">
      <section className="home__container">
        <h1 className="home__title">
          ¡Bienvenido {user?.user_name} {user?.user_middle_name}{" "}
          {user?.user_last_name}!
        </h1>

        <p className="home__subtitle">! Tu cumpleaños es en {daysUntilNextBirthday} días !</p>
      </section>
    </section>
  );
}

export default Home;
