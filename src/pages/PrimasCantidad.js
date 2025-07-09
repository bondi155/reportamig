import React, { useState, useEffect } from "react";
import { Form, Container, Col, Row, Card } from "react-bootstrap";
import { Box } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../config/config.js";
import "../css/App.css";
import PlaneSpinner from "../components/planeSpinner.js";
import MesAnioSelector from "../components/MesAnioSelector.js";
import ChartPrimas from "../charts/ChartPrimas.js";
import dayjs from "dayjs";
const PrimasCantidad = () => {
  const hoy = dayjs();
  const [anio, setAnio] = useState(hoy.subtract(1, "month").year());
  const [mes, setMes] = useState(hoy.subtract(1, "month").month() + 1);
  const [isLoading, setIsLoading] = useState(true);
  const [axiosResponse, setAxiosResponse] = useState([]);
  const [categories, setCategories] = useState([]);
  const handleConfirmarSeleccion = ({ anio, mes }) => {
    setAnio(anio);
    setMes(mes);
    // Llama a la función para actualizar el estado o realizar acciones del datepiker
  };

  useEffect(() => {
    const asyncCall = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/getPrimaPorRubro`, {
          params: { anio, mes },
        });
        const { series, xaxis } = response.data[0];
        setAxiosResponse(series);
        setCategories(xaxis.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.toString(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    asyncCall();
  }, [anio, mes]);

  console.log(axiosResponse);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Estas seguro?",
      text: "Si borra este archivo no se podra revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, quiero borrarlo!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${API_URL}/borrarProceso/${id}`);
        axiosResponse(axiosResponse.filter((proceso) => proceso.id !== id));
        Swal.fire(
          "Borrado!",
          "El archivo y todas sus lineas de este mes y año han sido borrados",
          "success"
        );
      }
    });
    try {
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error borrando el archivo de proceso",
      });
    }
  };

  return (
    <>
      <Container className="container-custom">
        <Form>
          <Row className="justify-content-center">
            <Col lg={8} md={12}>
              <Card>
                <Card.Header>
                  <h3>Primas</h3>
                </Card.Header>
                <Card.Body>
                  <Row className="justify-content-center">
                    <Col lg={{ span: 5, offset: 1 }} md={6} sm={6} xs={12}>
                      <MesAnioSelector
                        anioInicial={anio}
                        mesInicial={mes}
                        onFechaCambio={handleConfirmarSeleccion}
                      />
                    </Col>
                    {/* Botón Descargar  */}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
      {isLoading ? (
        <PlaneSpinner />
      ) : (
        <Box
          sx={{
            maxWidth: "75%",
            mt: "6rem",
            width: "100%",
            mx: "auto", // Centra el Box de mui como lo hace un contenedor Bootstrap
          }}
        >
          <ChartPrimas series={axiosResponse} categories={categories} />
        </Box>
      )}
    </>
  );
};

export default PrimasCantidad;
