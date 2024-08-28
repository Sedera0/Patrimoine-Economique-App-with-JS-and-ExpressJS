import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Possession from '../../../models/possessions/Possession';
import Flux from '../../../models/possessions/Flux';
import Delete from './Delete';

function PossessionTable({ possessions, onEdit, onDelete }) {
  const today = new Date();

  return (
    <Table striped bordered hover>
      <thead>
        <tr className='text-center'>
          <th>ID</th>
          <th>Libelle</th>
          <th>Valeur initiale (Ariary)</th>
          <th>Date de début</th>
          <th>Date de fin</th>
          <th>Amortissement</th>
          <th>Valeur Actuelle (Ariary)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {possessions.map((item) => {
          const possession = item.jour
            ? new Flux(
                item.possesseur,
                item.libelle,
                item.valeurConstante,
                new Date(item.dateDebut),
                item.dateFin ? new Date(item.dateFin) : null,
                item.tauxAmortissement || 0,
                item.jour
              )
            : new Possession(
                item.possesseur,
                item.libelle,
                item.valeur,
                new Date(item.dateDebut),
                item.dateFin ? new Date(item.dateFin) : null,
                item.tauxAmortissement || 0
              );

          const valeurActuelle = possession.getValeur(today);

          return (
            <tr key={item.id} className='text-center'>
              <td>{item.id}</td>
              <td>{item.libelle}</td>
              <td className='text-end'>{item.valeur.toFixed(2)}</td>
              <td>{new Date(item.dateDebut).toLocaleDateString()}</td>
              <td>{item.dateFin ? new Date(item.dateFin).toLocaleDateString() : "-"}</td>
              <td>{item.tauxAmortissement ?? "-"}</td>
              <td className='text-end'>{valeurActuelle.toFixed(2)}</td>
              <td>
                <Button variant="info" onClick={() => onEdit(item.id)} className='btn-sm'>Modifier</Button>{' '}
                <Delete possessionId={item.id} onDelete={onDelete} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default PossessionTable;
