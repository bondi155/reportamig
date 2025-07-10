import React from 'react';
import { Container, Col, Row, Table } from 'react-bootstrap';
import { Box } from "@mui/material";
function TablaEstadoResultados({ axiosResponse }) {
  const stickyColumnStyle = {
    position: 'sticky',
    left: 0,
    zIndex: 2,
    backgroundColor: '#eeeeee', // Importante para cubrir otras columnas al desplazar
    width: '150px', // Puedes ajustar este valor según necesites
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const getCellStyle = (colIndex, rowIndex) => {
    let style = {
      textAlign: 'right', // Alineación por defecto a la derecha
    };

    // Alineación específica para la primera columna y la columna total
    if (colIndex === 1 || colIndex === 24) {
      style.textAlign = 'left';
    }

    // Aplicar negrita y fondo para la primera fila
    if (rowIndex === 0) {
      style = {
        ...style,
        fontWeight: 'bold',
        backgroundColor: '#eeeeee',
      };
    }

    return style;
  };

  if (!axiosResponse || !Array.isArray(axiosResponse[0])) {
      return (
        <Container fluid className='mt-5 mb-5'>
          <Row>
            <Col>
            <Box
      sx={{
        mt: "6rem",
        textAlign: "center",
        fontSize: "1.2rem",
        color: "#555",
      }}
    >
      Para visualizar información, seleccione el mes, año y haga clic en el botón <strong>'Confirmar'</strong>.
    </Box>
            </Col>
          </Row>
        </Container>
      );
    }
  

  return (
    <>
      <Container fluid className='mt-5 mb-5'>
        <Row>
          <Col lg={{ span: 10, offset: 1 }}>
            <h3 style={{ textAlign: 'center', margin: '20px 0' }}>
              Previsualización del Archivo de Estado de Resultados*
            </h3>{' '}
            <div
              style={{
                overflow: 'auto',
                maxHeight: '60vh',
                fontSize: '0.7rem',
                width: '80%',
                margin: '0 auto',
              }}
            >
              <Table hover bordered responsive>
                <thead>
                  <tr></tr>
                </thead>
                <tbody>
                  {axiosResponse[0].map((item, index) => (
                    <tr key={index}>
                      <th
                        scope='row'
                        style={{
                          ...stickyColumnStyle,
                          ...getCellStyle(1, index),
                        }}
                      >
                        {item.col1}
                      </th>
                      {Array.from({ length: 5 }, (_, i) => i + 2).map(
                        (colIndex) => {
                          if (colIndex >= 3 && colIndex <= 20) {
                            return null;
                          }
                          return (
                            <td
                              key={colIndex}
                              style={getCellStyle(colIndex, index)}
                            >
                              {item[`col${colIndex}`]}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col
            lg={{ span: 8, offset: 2 }}
            style={{
              overflow: 'auto',
              maxHeight: '60vh',
              fontSize: '0.7rem',
              width: '60%',
            }}
          >
            <p>
              <strong>
                {' '}
                * Es necesario descargar el archivo Excel para consultar los
                datos de las empresas, dado que no estarán visibles en la vista
                previa.
              </strong>
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TablaEstadoResultados;
