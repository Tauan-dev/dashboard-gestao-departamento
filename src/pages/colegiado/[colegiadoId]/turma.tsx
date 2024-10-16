import React, { useEffect, useState } from "react";
import styles from "../../../styles/Turma.module.css";
import Image from "next/image";
import { BsMortarboard } from "react-icons/bs";
import { RiAddLine } from "react-icons/ri";
import Breadcrumbs from "@/components/Breadcumber";
import Link from "next/link";
import { useRouter } from "next/router";

interface Colegiado {
  id: number;
  sigla: string;
  img: string;
}

export default function Turma() {
  const [colegiado, setColegiado] = useState<Colegiado | null>(null);
  const router = useRouter();
  const { colegiadoId } = router.query;

  // Função para buscar os dados do colegiado
  const fetchColegiado = async (colegiadoId: string | string[] | undefined) => {
    if (!colegiadoId) return; // Certifique-se de que o ID está disponível
    try {
      const response = await fetch(
        `http://localhost:3000/colegiado/curso/${colegiadoId}`
      );
      const data = await response.json();
      setColegiado(data); // Salva os dados do colegiado
    } catch (error) {
      console.error("Erro ao buscar dados do colegiado:", error);
    }
  };

  useEffect(() => {
    if (colegiadoId) {
      fetchColegiado(colegiadoId); // Busca os dados quando o ID estiver disponível
    }
  }, [colegiadoId]);

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
                {colegiado ? colegiado.sigla : "Carregando"}
              </span>
            </div>
            <div className={styles.icon}>
              <Image
                src={`/${colegiado?.img}`}
                alt="Logo"
                width={35}
                height={35}
              />
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
            <Link href={`/colegiado/${colegiadoId}/disciplina`} passHref>
              <button className={styles.addButton}>
                <RiAddLine />
              </button>
            </Link>
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
