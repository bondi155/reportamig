import React, { useEffect, useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import numeral from 'numeral';

const sortData = (data, fieldIndex, direction) => {
  let sortedData = [];
  if (Array.isArray(data)) {
    sortedData = data.sort((a, b) => {
      if (
        (Number.isFinite(parseInt(Object.values(a[fieldIndex])[0])) && Number.isFinite(parseInt(Object.values(b[fieldIndex])[0])))
        ||
        (Number.isFinite(parseFloat(Object.values(a[fieldIndex])[0])) && Number.isFinite(parseFloat(Object.values(b[fieldIndex])[0])))
      ) {
        return direction === "asc"
          ? parseFloat(Object.values(a[fieldIndex])[0]) - parseFloat(Object.values(b[fieldIndex])[0])
          : parseFloat(Object.values(b[fieldIndex])[0]) - parseFloat(Object.values(a[fieldIndex])[0])
      } else {
        return direction === "asc"
          ? Object.values(a[fieldIndex])[0].toLowerCase().localeCompare(Object.values(b[fieldIndex])[0].toLowerCase())
          : -1 * Object.values(a[fieldIndex])[0].toLowerCase().localeCompare(Object.values(b[fieldIndex])[0].toLowerCase())
      }
    });
  }
  return sortedData;
}

const StyledTable = styled(Table)({
  thead: {
    tr: {
      th: {
        fontFamily: 'inherit',
        color: 'black',
        padding: '0 16px',
        textAlign: 'center',
        verticalAlign: 'middle',
        borderBottom: '1px solid black',
        whiteSpace: 'nowrap',
      },
      '.none': {
        border: 'none',
      }
    },
  },
  tbody: {
    tr: {
      td: {
        fontFamily: 'inherit',
        padding: '4px 16px',
        whiteSpace: 'nowrap',
      },
    },
  },
});

export default function SecondGridEval(props) {
  const { headers, data } = props
  const firstRowHeaders = []
  const secondRowHeaders = [];
  const [orderedData, setOrderedData] = useState([])
  const [orderFieldIndex, setOrderFieldIndex] = useState();
  const [orderDirection, setOrderDirection] = useState('asc');

  for (const key in headers) {
    if (headers[key].hasOwnProperty("name")) {
      firstRowHeaders.push({ name: headers[key]["name"], span: Object.keys(headers[key]).length - 1 })
      for (const objectkey in headers[key]) {
        if (objectkey !== "name") secondRowHeaders.push({ name: headers[key][objectkey] })
      }
    }
    if (!headers[key].hasOwnProperty("name")) {
      firstRowHeaders.push({ name: headers[key], span: 1 })
    }
  }

  const sortingHandler = (indexToHandle) => {
    if (indexToHandle === orderFieldIndex) {
      orderDirection === 'asc'
        ? setOrderDirection('desc')
        : setOrderDirection('asc')
    } else {
      setOrderFieldIndex(indexToHandle)
      setOrderDirection('asc')
      data && data.detalle && setOrderedData(sortData(data.detalle, indexToHandle, 'desc'))
    }
  }

  useEffect(() => {
    data && data.detalle && setOrderedData(data.detalle)
  }, [data])

  useEffect(() => {
    data && data.detalle && setOrderedData(sortData(data.detalle, orderFieldIndex, orderDirection))
  }, [orderFieldIndex, orderDirection])

  return (
    <TableContainer component={Paper}>
      <StyledTable>
        <TableHead>
          <TableRow>
            {firstRowHeaders.map((elementData, index) => {
              return index <= 1
                ? (
                  <TableCell colSpan={elementData.span} rowSpan={elementData.span === 1 ? 2 : 1} style={{ color: '#002248' }}>
                    <TableSortLabel active={orderFieldIndex === index} direction={orderDirection} onClick={() => sortingHandler(index)}>
                      {elementData.name}
                    </TableSortLabel>
                  </TableCell>
                )
                : (
                  <TableCell colSpan={elementData.span} rowSpan={elementData.span === 1 ? 2 : 1} style={{ color: '#002248' }}>
                    {elementData.name}
                  </TableCell>
                )
            })}
          </TableRow>
          <TableRow>
            {secondRowHeaders.map((elementData, index) => {
              return (
                <TableCell style={{ color: '#002248' }}>
                  <TableSortLabel active={orderFieldIndex === index + 2} direction={orderDirection} onClick={() => sortingHandler(index + 2)}>
                    {elementData.name}
                  </TableSortLabel>
                </TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {orderedData && orderedData.map(rowData => {
            return (
              <TableRow>
                {rowData.map((data, indexData) => {
                  let information = data && Object.values(data)
                  if (Array.isArray(information)) information = information[0]
                  if (information === null || information === undefined) information = 0
                  return (<TableCell align={indexData !== 1 ? 'right' : 'left'}>{(information > 100 ? numeral(information).format('0,0.00') : information)}</TableCell>)
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}
