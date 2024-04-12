import { useForm } from "react-hook-form";
import "../css/Register.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/UserContext";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

const Register = ({ showLoginForm }) => {
  const { signUp } = useAuth();
  const [maxDate, setMaxDate] = useState("");
  const [state, setState] = useState(1);
  const { register, handleSubmit, getValues } = useForm();

  const getEighteenYearsAgo = () => {
    const today = new Date();
    return new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
  };

  useEffect(() => {
    const today = new Date();
    const maxDateValue = today.toISOString().split("T")[0];
    setMaxDate(maxDateValue);
  }, []);

  const toastStyle = {
    borderRadius: "10px",
    background: "var(--background-color-dark)",
    color: "var(--primary-color)",
    transform: "scale(-1, 1)",
  };

  const onBar = () => {
    showLoginForm();
  };

  const changeStateForward = () => {
    if (state == 1) {
      const values = getValues([
        "user_name",
        "user_middle_name",
        "user_last_name",
        "user_last_second_name",
      ]);

      const numberValues = getValues(["user_phone", "user_identification"]);
      if (values.some((value) => /\d/.test(value))) {
        toast.error("Los nombres no pueden contener números", {
          style: toastStyle,
        });
        return;
      }
      if (!values[0]) {
        toast.error("Por favor ingresa tu Nombre", {
          style: toastStyle,
        });
        return;
      }
      if (!values[2]) {
        toast.error("Por favor ingresa tu Apellido", {
          style: toastStyle,
        });
        return;
      }
      if (!values[3]) {
        toast.error("Por favor ingresa tu Segundo Apellido", {
          style: toastStyle,
        });
        return;
      }
      if (!numberValues[0]) {
        toast.error("Por favor ingresa tu Teléfono", {
          style: toastStyle,
        });
        return;
      }
      if (numberValues[0].length <= 9 || numberValues[0].length > 10) {
        toast.error("Por favor ingresa un número de teléfono válido", {
          style: toastStyle,
        });
        return;
      }
      if (!numberValues[1]) {
        toast.error("Por favor ingresa tu NIT", {
          style: toastStyle,
        });
        return;
      }
      setState(2);
    }
  };

  const changeStateBackwards = () => {
    if (state == 2) {
      setState(1);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    let isValid = true;

    if (data.user_username) {
      const usernameRegex = /^[A-Z][a-z]{6}[0-9]$/;
      if (!usernameRegex.test(data.user_username)) {
        toast.error(
          "El nombre de usuario debe de ser primera letra en mayuscula las seis siguientes en minuscula y la ultima un numero",
          {
            style: toastStyle,
            duration: 5000,
          }
        );
        isValid = false;
      }
    }
    if (data.user_password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres", {
        style: toastStyle,
      });
      isValid = false;
    }
    if (data.user_password !== data.user_password_confirm) {
      toast.error("Las contraseñas no coinciden", {
        style: toastStyle,
      });
      isValid = false;
    }
    const maxDate = getEighteenYearsAgo().toISOString().split("T")[0];
    if (!data.user_birth_date || data.user_birth_date > maxDate) {
      toast.error("Debes tener al menos 18 años para registrarte", {
        style: toastStyle,
      });
      isValid = false;
    }
    delete data.user_password_confirm;
    console.log(data);
    if (isValid) {
      const res = await signUp(data);
      if (typeof res !== "object") {
        toast.error(res, {
          style: toastStyle,
        });
      }
    }
  });

  return (
    <section className="register">
      <Toaster />
      <form onSubmit={onSubmit} className="register__form">
        <section className="login__bars">
          <div className="login__bar" onClick={onBar}></div>
          <div className="login__bar--modifier"></div>
        </section>

        <section
          className={state == 1 ? "register__active" : "register__hidden"}
        >
          {state == 1 && (
            <section className="register__personal">
              <h1>Información Personal</h1>
              <section className="register__inputs">
                <input
                  type="text"
                  {...register("user_name", { required: true })}
                  placeholder="Primer Nombre"
                />

                <input
                  type="text"
                  {...register("user_middle_name", { required: false })}
                  placeholder="Segundo Nombre"
                />

                <input
                  type="text"
                  {...register("user_last_name", { required: true })}
                  placeholder="Apellido"
                />
                <input
                  type="text"
                  {...register("user_last_second_name", { required: true })}
                  placeholder="Segundo Apellido"
                />
                <input
                  type="number"
                  {...register("user_phone", { required: true })}
                  placeholder="Teléfono"
                />
                <input
                  type="number"
                  {...register("user_identification", { required: true })}
                  placeholder="NIT"
                />
              </section>
            </section>
          )}
        </section>

        <section
          className={state == 2 ? "register__active" : "register__hidden"}
        >
          {state == 2 && (
            <section className="register__user">
              <h1>Información de Usuario</h1>
              <input
                className="register__input"
                type="email"
                {...register("user_email", { required: true })}
                placeholder="Correo Electrónico"
              />
              <input
                className="register__input"
                type="text"
                {...register("user_username", { required: true })}
                placeholder="Username"
              />

              <section>
                <input
                  className="register__input"
                  type="date"
                  {...register("user_birth_date", {
                    required: true,
                  })}
                  placeholder="Fecha de Nacimiento"
                />
              </section>
              <section className="register__inputs">
                <input
                  type="password"
                  {...register("user_password", { required: true })}
                  placeholder="Contraseña"
                />

                <input
                  type="password"
                  {...register("user_password_confirm", { required: true })}
                  placeholder="Confirmar Contraseña"
                />
              </section>
            </section>
          )}
        </section>

        <section className="register__arrows">
          <div
            className={
              state == 2 || state == 3 ? "submit_buttn--active" : "submit_buttn"
            }
            onClick={changeStateBackwards}
          >
            <FaArrowLeft />
          </div>
          {state == 2 ? (
            <button type="Submit" className="submit_buttn--active">
              <FaArrowRight />
            </button>
          ) : (
            <div
              className={
                state == 1 || state == 2
                  ? "submit_buttn--active"
                  : "submit_buttn"
              }
              onClick={changeStateForward}
            >
              <FaArrowRight />
            </div>
          )}
        </section>

        <section className="dots">
          <div className={state == 1 ? "dot--active" : "dot"}></div>
          <div className={state == 2 ? "dot--active" : "dot"}></div>
        </section>
        <p className="login__register">
          ¿Ya tienes una cuenta? <span onClick={onBar}>Login</span>
        </p>
      </form>
    </section>
  );
};

export default Register;
