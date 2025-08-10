import * as React from 'react';
import { useState } from 'react';
import ResponsiveAppBar from '../pages/ResponsiveAppBar';
import TablePage from "../pages/TablePage"
import './HomePage.css';

export default function HomePage() {
  const pages = ['Cadastro', 'Busca Geral'];
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

  const [selectedPage, setSelectedPage] = useState('Busca Geral');

  return (
    <div className="home-container">
      <ResponsiveAppBar
        pages={pages}
        settings={settings}
        selectedPage={selectedPage}
        onPageChange={setSelectedPage}
      />
      {selectedPage === 'Busca Geral' && <TablePage />}
      {selectedPage === 'Cadastro' && (
        <div>
          <h2>Página Cadastro</h2>
        </div>
      )}
    </div>
  );
}
