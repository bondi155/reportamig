import React from 'react';
import { Container, Col, Row, Table } from 'react-bootstrap';

function TablaFinanciera({ axiosResponse }) {
  const stickyColumnStyle = {
    position: 'sticky',
    left: 0,
    zIndex: 2,
    backgroundColor: '#dee2e6', // Importante para cubrir otras columnas al desplazar
  };

  const getCellStyle = (colIndex, rowIndex) => {
    let style = {
      textAlign:
        colIndex === 24 || colIndex === 1 || rowIndex === 0 || rowIndex === 1
          ? 'left'
          : 'right',
    };

    // Aplicar negrita y fondo para condiciones específicas
    if (colIndex === 24 || rowIndex === 0 || rowIndex === 1) {
      style = {
        ...style,
        fontWeight: 'bold',
        backgroundColor: '#dee2e6',
      };
    }

    return style;
  };

  return (
    <>
      <Container fluid className='mt-5 mb-5'>
        <Row>
          <Col>
            <div
              style={{
                overflow: 'auto',
                maxHeight: '60vh',
                fontSize: '0.7rem',
                width: '80%',
                margin: '0 auto',
              }}
            >
              <h3>Previsualización del Archivo de Situación Financiera (*)</h3>
              <Table hover bordered responsive>
                <thead>
                  <tr></tr>
                </thead>
                <tbody>
                  {axiosResponse[0].slice(1).map((item, index) => (
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
                      {Array.from({ length: 28 }, (_, i) => i + 2).map(
                        (colIndex) => {
                          // Excluir las columnas de 5 a 21
                          if (colIndex >= 5 && colIndex <= 21) {
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
