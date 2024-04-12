import React, { useEffect, useState } from "react";
import "../css/Update.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/UserContext";
import { toast, Toaster } from "react-hot-toast";

function UpdateUser({ toggleUpdate }) {
  const { register, handleSubmit, setValue } = useForm();
  const { user, updateUser } = useAuth();
  const [button, setButton] = useState(true);
  const {
    user_name,
    user_middle_name,
    user_last_name,
    user_last_second_name,
    user_username,
    user_email,
    user_phone,
    user_identification,
    user_birth_date,
  } = user;

  const toastStyle = {
    borderRadius: "10px",
    background: "var(--background-color-dark)",
    color: "var(--primary-color)",
    transform: "scale(-1, 1)",
  };

  useEffect(() => {
    if (user) {
      setValue("user_name", user_name);
      setValue("user_middle_name", user_middle_name);
      setValue("user_last_name", user_last_name);
      setValue("user_last_second_name", user_last_second_name);
      setValue("user_username", user_username);
      setValue("user_phone", user_phone);
    }
  }, []);

  const onSubmitUser = handleSubmit(async (data) => {
    let isValid = true;
    if (!data.user_name) {
      toast.error("Por favor ingresa tu Nombre", {
        style: toastStyle,
      });
      isValid = false;
      return;
    }
    if(data.user_name.length>20){
      toast.error("El nombre no puede tener más de 20 caracteres", {
        style: toastStyle,
      });
      isValid = false;
      return;
    }
    if (!data.user_middle_name) {
      toast.error("Por favor ingresa tu Segundo Nombre", {
        style: toastStyle,
      });
      isValid = false;
    }
    if(data.user_middle_name.length>20){
      toast.error("El Segundo Nombre no puede tener más de 20 caracteres", {
        style: toastStyle,
      });
      isValid = false;
      return;
    }
    if (!data.user_last_name) {
      toast.error("Por favor ingresa tu Apellido", {
        style: toastStyle,
      });
      isValid = false;
    }
    if(data.user_last_name.length>20){
      toast.error("El Apellido no puede tener más de 20 caracteres", {
        style: toastStyle,
      });
      isValid = false;
      return;
    }
    if (!data.user_last_second_name) {
      toast.error("Por favor ingresa tu Segundo Apellido", {
        style: toastStyle,
      });
      isValid = false;
    }
    if(data.user_last_second_name.length>20){
      toast.error("El Segundo Apellido no puede tener más de 20 caracteres", {
        style: toastStyle,
      });
      isValid = false;
      return;
    }
    if (!data.user_username) {
      toast.error("Por favor ingresa tu Username", {
        style: toastStyle,
      });
      isValid = false;
    }
    if(data.user_username.length<8){
      toast.error("El nombre de Usuario debe ser mayor de 8 caracteres", {
        style: toastStyle,
      });
      isValid = false;
      return;
    }
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
    if (data.user_phone.length <= 9 || data.user_phone.length > 10) {
      toast.error("Por favor ingresa un número de teléfono válido", {
        style: toastStyle,
      });
      return;
    }
    data.user_email = user_email;
    data.user_identification = user_identification;
    data.user_birth_date = user_birth_date;
    if (isValid) {
      setButton(false);
      const res = await updateUser(data);
      if(res.error){
        toast.error(res.error, {
          style: toastStyle,
        });
        setButton(true);
        return;
      }
      setTimeout(() => {
        toggleUpdate(false);
        toast.success(res, {
          style: toastStyle,
        });
      }, 2000);
    }
  });

  return (
    <section>
      <section
        className="backdrop"
        onClick={() => toggleUpdate(false)}
      ></section>
      <section className="update">
        <form onSubmit={onSubmitUser} className="update__form">
          <section className="update__inputs">
            <div>
              <p>Nombre</p>
              <input type="text" {...register("user_name")} />
            </div>
            <div>
              <p>Segundo Nombre</p>
              <input type="text" {...register("user_middle_name")} />
            </div>
            <div>
              <p>Apellido</p>
              <input type="text" {...register("user_last_name")} />
            </div>
            <div>
              <p>Segundo Apellido</p>
              <input type="text" {...register("user_last_second_name")} />
            </div>
            <div>
              <p>Username</p>
              <input type="text" {...register("user_username")} />
            </div>
            <div>
              <p>Teléfono</p>
              <input type="text" {...register("user_phone")} />
            </div>
          </section>

          <section className="update__button">
            {button ? (
              <button type="submit" className="submit_button">
                Actualizar
              </button>
            ) : (
              <p className="submit__text">Actualizando</p>
            )}
            <button
              className="submit_button"
              onClick={() => toggleUpdate(false)}
            >
              Cancelar
            </button>
          </section>
        </form>
      </section>
    </section>
  );
}

export default UpdateUser;
