import "../css/Footer.css";
function Footer() {
  const actualYear = new Date().getFullYear();

  return (
    <section className="footer">
      <p>
        © {actualYear} Samuel Ignacio Arango Ramírez & Alejandro Franco Correa
      </p>
    </section>
  );
}

export default Footer;
