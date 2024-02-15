import React, { useEffect, useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import axios from "axios";
import { API_URL } from '../config/config';

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

  return (
    <TableContainer component={Paper}>
      <StyledTable>
        <TableHead>
          <TableRow>
            {firstRowHeaders.map(elementData => {
              return <TableCell colSpan={elementData.span} rowSpan={elementData.span === 1 ? 2 : 1}>{elementData.name}</TableCell>
            })}
          </TableRow>
          <TableRow>
            {secondRowHeaders.map(elementData => {
              return <TableCell>{elementData.name}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.detalle.map(rowData => {
            return (
              <TableRow>
                {rowData.map(data => {
                  let information = data && Object.values(data)
                  if (information && typeof parseInt(information[0]) === "number" && parseInt(information) > 100) information = parseInt(information) / 1000
                  if (Array.isArray(information)) information = information[0]
                  if (information === null || information === undefined) information = 0
                  return (<TableCell align={typeof information === 'number' ? 'right' : 'left'}>{(information > 100 ? information.toFixed(2) : information)}</TableCell>)
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}
