// src/pages/TablePage.tsx
import * as React from 'react';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface User {
  id: string;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  paymentMethod: string;
  date: string;
  user: User;
}

interface ColumnData {
  label: string;
  render: (row: Product) => React.ReactNode;
  numeric?: boolean;
  width?: number;
}

const columns: ColumnData[] = [
  { width: 80, label: 'ID', render: (row) => row.id, numeric: true },
  { width: 150, label: 'Produto', render: (row) => row.name },
  { width: 250, label: 'Descrição', render: (row) => row.description },
  { width: 100, label: 'Preço', render: (row) => `R$ ${row.price.toFixed(2)}`, numeric: true },
  { width: 150, label: 'Método Pagamento', render: (row) => row.paymentMethod },
  {
    width: 150,
    label: 'Data Criação',
    render: (row) => dayjs.utc(row.date).format('DD/MM/YYYY'),
  },
  
  { width: 150, label: 'Usuário', render: (row) => row.user?.name || '—' },
];

const VirtuosoTableComponents: TableComponents<Product> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column, index) => (
        <TableCell
          key={index}
          variant="head"
          align={column.numeric ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{ backgroundColor: 'background.paper', fontWeight: 'bold' }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index: number, row: Product) {
  return (
    <>
      {columns.map((column, index) => (
        <TableCell
          key={index}
          align={column.numeric ? 'right' : 'left'}
        >
          {column.render(row)}
        </TableCell>
      ))}
    </>
  );
}

export default function TablePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/product") 
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, []);

  return (
    <Paper style={{ height: 500, width: '95%', margin: '2% auto' }}>
      <TableVirtuoso
        data={products}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
