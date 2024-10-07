import React from "react";
import styles from "../../styles/Turma.module.css";
import Image from "next/image";
import { BsMortarboard } from "react-icons/bs";
import { RiAddLine } from "react-icons/ri";
import Breadcrumbs from "@/components/Breadcumber";

export default function Turma() {
  const data = [
    {
      disciplina: "Algoritmos",
      codigo: "CET023",
      turma: "A",
      formando: "Sim",
    },
    {
      disciplina: "Estrutura de Dados",
      codigo: "CET021",
      turma: "B",
      formando: "Não",
    },
  ];

  return (
    <div className={styles.bg}>
      <header>
        <Breadcrumbs></Breadcrumbs>
        <h2>Solicitação de demanda</h2>
        <div className={styles.corpoDepto}>
          <div className={styles.headerName}>
            <div className={styles.headerTitleDiv}>
              <span className={styles.headerTitle}>COLEGIADO</span>
              <span className={styles.headerTitleChildren}>
                Ciências da Computação
              </span>
            </div>
            <div className={styles.icon}>
              <Image src="/colcic.png" alt="Logo" width={35} height={35} />
            </div>
          </div>
          <div className={styles.headerName}>
            <div className={styles.headerTitleDiv}>
              <span className={styles.headerTitle}> DEPARTAMENTO</span>
              <span className={styles.headerTitleChildren}> DEC</span>
            </div>

            <div className={styles.icon}>
              <BsMortarboard className={styles.iconDepto} />
            </div>
          </div>
        </div>
      </header>

      <section className={styles.turmTable}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>Turmas</h2>
            <button className={styles.addButton}>
              <RiAddLine />
            </button>
          </div>

          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableCell}>CÓDIGO DA DISCIPLINA</th>
                <th className={styles.tableCell}>DISCIPLINA</th>
                <th className={styles.tableCell}>TURMA</th>
                <th className={styles.tableCell}>FORMANDO</th>
                <th className={styles.tableCell}>HORÁRIO</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableCell}>{row.codigo}</td>
                  <td className={styles.tableCell}>{row.disciplina}</td>
                  <td className={styles.tableCell}>{row.turma}</td>
                  <td className={styles.tableCell}>{row.formando}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className={styles.pagination}>
        <button className={styles.paginationButton}>Back</button>
        <button className={styles.paginationButton}>1</button>
        <button className={styles.paginationButton}>2</button>
        <button className={styles.paginationButton}>Next</button>
      </div>
    </div>
  );
}
