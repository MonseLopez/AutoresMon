import React, { useEffect, useState } from "react";
import axios from "axios";

const Autores = () => {
  const [autores, setAutores] = useState([]);
  const [nombreBusqueda, setNombreBusqueda] = useState("");
  const [nuevoAutor, setNuevoAutor] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
  });

  const API_URL = "https://monseautores.somee.com/api/Autor";


  // Obtener todos los autores
  const obtenerAutores = async () => {
    try {
      const response = await axios.get(API_URL);
      setAutores(response.data);
    } catch (error) {
      console.error("Error al obtener autores:", error);
    }
  };

  // Buscar autor por nombre
  const buscarPorNombre = async () => {
    if (!nombreBusqueda.trim()) {
      alert("Escribe un nombre para buscar");
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/nombre?nombre=${encodeURIComponent(nombreBusqueda)}`);
      if (response.data) {
        setAutores([response.data]);
      } else {
        setAutores([]);
      }
    } catch (error) {
      console.error("Error al buscar autor:", error);
    }
  };

  // Crear nuevo autor
  const crearAutor = async () => {
    if (!nuevoAutor.nombre.trim() || !nuevoAutor.apellido.trim() || !nuevoAutor.fechaNacimiento.trim()) {
      alert("Completa todos los campos para crear un autor");
      return;
    }

    // Convertir la fecha a formato completo ISO con hora
    const fechaConHora = new Date(nuevoAutor.fechaNacimiento).toISOString();

    const nuevoRegistro = {
      nombre: nuevoAutor.nombre,
      apellido: nuevoAutor.apellido,
      fechaNacimiento: fechaConHora
    };

    try {
      await axios.post(API_URL, nuevoRegistro);
      alert("Autor creado exitosamente");
      setNuevoAutor({ nombre: "", apellido: "", fechaNacimiento: "" });
      obtenerAutores();
    } catch (error) {
      console.error("Error al crear autor:", error);
      alert("Ocurrió un error al crear el autor. Revisa consola para más detalles.");
    }
  };

  useEffect(() => {
    obtenerAutores();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Gestión de Autores</h1>

      <section style={{ marginBottom: 20 }}>
        <h3>Buscar Autor por Nombre</h3>
        <input
          type="text"
          value={nombreBusqueda}
          onChange={(e) => setNombreBusqueda(e.target.value)}
          placeholder="Nombre autor"
          style={{ padding: 8, width: 250 }}
        />
        <button onClick={buscarPorNombre} style={{ marginLeft: 10, padding: "8px 12px" }}>
          Buscar
        </button>
        <button onClick={obtenerAutores} style={{ marginLeft: 10, padding: "8px 12px" }}>
          Mostrar Todos
        </button>
      </section>

      <section style={{ marginBottom: 30 }}>
        <h3>Crear Nuevo Autor</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoAutor.nombre}
          onChange={(e) => setNuevoAutor({ ...nuevoAutor, nombre: e.target.value })}
          style={{ padding: 8, width: 200, marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={nuevoAutor.apellido}
          onChange={(e) => setNuevoAutor({ ...nuevoAutor, apellido: e.target.value })}
          style={{ padding: 8, width: 200, marginRight: 10 }}
        />
        <input
          type="date"
          value={nuevoAutor.fechaNacimiento}
          onChange={(e) => setNuevoAutor({ ...nuevoAutor, fechaNacimiento: e.target.value })}
          style={{ padding: 8, marginRight: 10 }}
        />
        <button onClick={crearAutor} style={{ padding: "8px 12px" }}>
          Crear Autor
        </button>
      </section>

      <section>
        <h3>Lista de Autores</h3>
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#eee" }}>
            <tr>
              <th>ID Numérico</th>
              <th>GUID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha de Nacimiento</th>
            </tr>
          </thead>
          <tbody>
            {autores.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No hay autores para mostrar
                </td>
              </tr>
            )}
            {autores.map((autor) => (
              <tr key={autor.autorLibroGuid}>
                <td>{autor.autorLibroId}</td>
                <td>{autor.autorLibroGuid}</td>
                <td>{autor.nombre}</td>
                <td>{autor.apellido}</td>
                <td>{autor.fechaNacimiento ? autor.fechaNacimiento.split("T")[0] : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Autores;
