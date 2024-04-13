import React, { useState } from "react";
import { useAuth } from "../context/UserContext";
import "../css/PersonalInfo.css";
import UpdateUser from "../components/UptadeUser";
import { toast, Toaster } from "react-hot-toast";

function PersonalInfo() {
  const { user, deleteUser } = useAuth();
  const [update, setUpdate] = useState(false);
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

  const handleDelete = async (id) => {
    const response = await deleteUser(id);
    if (response === "Usuario Eliminado" || response === "Usuario Restaurado") {
      toast.success(response, {
        style: toastStyle,
      });
    } else {
      toast.error(response.error, {
        style: toastStyle,
      });
    }
  };

  const toggleUpdate = () => {
    setUpdate(!update);
  };

  const formatedDate = user_birth_date.split("T")[0];

  const InfoSection = ({ label, value }) => (
    <p>
      <span className="infoLabel">{label}:</span> {value}
    </p>
  );

  return (
    <section className="information">
      <Toaster />
      <header>
        <h2 className="information__title">Información de usuario</h2>
      </header>
      <section className="information__container">
        <div className="information__sections">
          <InfoSection label="Nombre" value={user_name} />
          <InfoSection label="Segundo Nombre" value={user_middle_name} />
          <InfoSection label="Apellido" value={user_last_name} />
          <InfoSection label="Segundo Apellido" value={user_last_second_name} />
        </div>
        <div className="information__sections">
          <InfoSection label="Username" value={user_username} />
          <InfoSection label="Correo eléctrico" value={user_email} />
        </div>
        <div className="information__sections">
          <InfoSection label="Número de teléfono" value={user_phone} />
          <InfoSection label="Identificación" value={user_identification} />
          <InfoSection label="Fecha de nacimiento" value={formatedDate} />
        </div>
      </section>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        <button className="submit_button" onClick={toggleUpdate}>
          Actualizar Información
        </button>
        <button className="submit_button" onClick={() => handleDelete(user.id)}>
          Borrar Cuenta
        </button>
      </div>
      {update && <UpdateUser toggleUpdate={toggleUpdate} />}
    </section>
  );
}

export default PersonalInfo;
