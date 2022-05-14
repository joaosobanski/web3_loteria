import React, { Component } from "react";

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th>Apostador</th>
      </tr>
    </thead>
  );
};

const TableBody = (props) => {
  const rows = props.apostadoresData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row}</td>
      </tr>
    );
  });

  return <tbody>{rows}</tbody>;
};

export const Table = (props) => {
  const { apostadoresData } = props;

  return (
    <table>
      <TableHeader />
      <TableBody apostadoresData={apostadoresData} />
    </table>
  );
};
