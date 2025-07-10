import React from 'react';
import { Container, Col, Row, Table } from 'react-bootstrap';
import { Box } from "@mui/material";

function TablaFinanciera({ axiosResponse }) {
  const stickyColumnStyle = {
    position: 'sticky',
    left: 0,
    zIndex: 2,
    backgroundColor: '#eeeeee',
  };

  const getCellStyle = (colIndex, rowIndex) => {
    let style = {
      textAlign:
        colIndex === 1 || rowIndex === 0 || rowIndex === 1 || (colIndex === 5 && rowIndex !== 0)
          ? 'left'
          : 'right',
    };

    if (rowIndex === 0 || colIndex === 5) {
      style = {
        ...style,
        fontWeight: 'bold',
        backgroundColor: '#eeeeee',
      };
    }

    return style;
  };

  // 🛡️ Protección contra falta de datos
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
          <Col>
            <h3 style={{ textAlign: 'center', margin: '20px 0' }}>
              Previsualización del Archivo de Situación Financiera*
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
                  
                  {axiosResponse[0].slice(1).map((item, index) => {
                    const totalCols = Object.keys(item).length;
                    const firstSetKeys = Object.keys(item).slice(2, 5);
                    const lastSetKeys = Object.keys(item).slice(
                      totalCols - 6,
                      totalCols - 2
                    );

                    // Filtra para excluir específicamente la quinta columna (index 3 desde slice(1))
                    const filteredFirstSetKeys = firstSetKeys.filter(
                      (_, idx) => idx !== 3
                    );

                    const keysToShow = filteredFirstSetKeys.concat(lastSetKeys); // Combina los dos sets ajustados

                    return (
                      <tr key={index}>
                        <th
                          scope='row'
                          style={{
                            ...stickyColumnStyle,
                            ...getCellStyle(1, index),
                          }}
                        >
                          {index === 0 ? 'CONCEPTO' : item.col1}
                        </th>
                        {keysToShow.map((colKey, subIndex) => (
                          <td
                            key={subIndex}
                            style={getCellStyle(subIndex + 2, index)}
                          >
                            {index === 0 && subIndex === 3 ? (
                              <div style={{ textAlign: 'left' }}>CONCEPTO</div>
                            ) : (
                              item[colKey]
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col
            lg={12}
            style={{
              overflow: 'auto',
              maxHeight: '60vh',
              fontSize: '0.7rem',
              width: '80%',
              margin: '0 auto',
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

export default TablaFinanciera;
