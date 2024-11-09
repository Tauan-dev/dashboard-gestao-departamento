import React, { useEffect, useState } from "react";
import styles from "../../../styles/Disciplina.module.css";
import Image from "next/image";
import { BsMortarboard } from "react-icons/bs";
import Breadcrumbs from "@/components/Breadcumber";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";
import { useRouter } from "next/router";
import ModalComponent from "@/components/ModalTurma";

interface Disciplina {
  id: number;
  cod: string;
  nome: string;
  cargaHoraria: number;
}

interface Colegiado {
  id: number;
  sigla: string;
  img: string;
}

export default function Disciplina() {
  const router = useRouter();
  const { colegiadoId } = router.query;
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [colegiado, setColegiado] = useState<Colegiado | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [itemsPerPage] = useState(15); // Número de itens por página

  // Função para buscar as disciplinas via API
  const fetchDisciplinas = async (
    colegiadoId: string | string[] | undefined
  ) => {
    if (!colegiadoId) return; // Verifica se o colegiadoId está disponível
    try {
      const response = await fetch(
        `http://localhost:3000/colegiado/${colegiadoId}`
      );
      const data = await response.json();
      setDisciplinas(data[0]?.disciplinas || []); // Certifica que as disciplinas existem no retorno da API
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
    }
  };

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

  useEffect(() => {
    if (colegiadoId) {
      fetchDisciplinas(colegiadoId); // Chama a função ao obter o colegiadoId
    }
  }, [colegiadoId]);

  // Lógica de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = disciplinas.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(disciplinas.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className={styles.bg}>
      <header>
        <Breadcrumbs></Breadcrumbs>
        <h2>Listagem de Disciplinas</h2>
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
                src={
                  colegiado?.img
                    ? `/${colegiado.img}`
                    : "/default_image_path.png"
                }
                alt="Logo"
                width={35}
                height={35}
                style={{ width: "auto", height: "auto" }}
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
            <h2>Tabela de Disciplinas</h2>
            <Link href={`/colegiado/${colegiadoId}/turma`} passHref>
              <button className={styles.addButton}>
                <FaArrowLeftLong size={24}/>
              </button>
            </Link>
          </div>

          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableCell}>CÓDIGO DA DISCIPLINA</th>
                <th className={styles.tableCell}>DISCIPLINA</th>
                <th className={styles.tableCell}>ADICIONAR TURMA</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length ? (
                currentItems.map((disciplina) => (
                  <tr key={disciplina.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{disciplina.cod}</td>
                    <td className={styles.tableCell}>{disciplina.nome}</td>
                    <td>
                      <ModalComponent disciplina={disciplina} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>Nenhuma disciplina encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <div className={styles.pagination}>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Back
        </button>
        <span>{`Página ${currentPage} de ${totalPages}`}</span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}
