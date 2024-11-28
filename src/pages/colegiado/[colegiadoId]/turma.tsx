import React, { useEffect, useState } from "react";
import styles from "../../../styles/Turma.module.css";
import Image from "next/image";
import { BsMortarboard } from "react-icons/bs";
import { RiAddLine } from "react-icons/ri";
import Breadcrumbs from "@/components/Breadcumber";
import Link from "next/link";
import { useRouter } from "next/router";
import { Badge } from "@/components/ui/badge";
import ModalHorario from "@/components/ModalHorario";

// Interfaces definidas para o Colegiado e Turmas
interface Curso {
  id: number;
  nome: string;
  tipo: string;
}

interface Disciplina {
  id: number;
  cod: string;
  nome: string;
  cargaHoraria: number;
  cargaHorariaSemanal: number;
  cursos: Curso[];
}

interface Turma {
  id: number;
  cod: string;
  observacao: string;
  formando: boolean;
  disciplina: Disciplina;
}

interface Colegiado {
  id: number;
  sigla: string;
  img: string;
}

interface Semestre {
  semestre: number;
}

export default function Turma() {
  const [colegiado, setColegiado] = useState<Colegiado | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]); // Define Turma[] para o estado das turmas
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [itemsPerPage] = useState(9); // Definindo 5 itens por página
  const router = useRouter();
  const { colegiadoId } = router.query;
  const [semestre, setSemestre] = useState<Semestre | null>(null); //

  useEffect(() => {
    async function fetchSemestre() {
      try {
        const responseSem = await fetch(
          "http://localhost:3000/colegiado/semestreAtual"
        );
        if (!responseSem.ok) {
          throw new Error("Erro ao buscar o ultimo semestre");
        }

        const dataSem = await responseSem.json();
        setSemestre(dataSem);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchSemestre();
  }, []);

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

  // Função para buscar as turmas
  const fetchTurmas = async (colegiadoId: string | string[] | undefined) => {
    if (!colegiadoId) return;
    try {
      const response = await fetch(
        `http://localhost:3000/colegiado/turma/${colegiadoId}`
      );
      const data: Turma[] = await response.json(); // Tipagem para array de turmas
      setTurmas(data);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
    }
  };

  useEffect(() => {
    if (colegiadoId) {
      fetchColegiado(colegiadoId); // Busca os dados quando o ID estiver disponível
      fetchTurmas(colegiadoId);
    }
  }, [colegiadoId]);

  // Lógica de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = turmas.slice(indexOfFirstItem, indexOfLastItem); // Turmas da página atual

  // Função para mudar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.bg}>
      <header>
        <Breadcrumbs />
        <h2>
          Solicitação de demanda{" "}
          {semestre ? semestre.semestre : "Carregando..."}{" "}
        </h2>
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
                <RiAddLine size={26} />
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
              {currentItems.length ? (
                currentItems.map((turma) => (
                  <tr key={turma.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>{turma.disciplina.cod}</td>
                    <td className={styles.tableCell}>
                      {turma.disciplina.nome}
                    </td>
                    <td className={styles.tableCell}>{turma.cod}</td>
                    <td className={styles.tableCell}>
                      <Badge
                        className={
                          turma.formando
                            ? `${styles.formandoBadgeTrue}`
                            : `${styles.formandoBadgeFalse}`
                        }
                      >
                        {turma.formando ? "TEM" : "NÃO TEM"}
                      </Badge>
                    </td>
                    <td className={styles.tableCell}>
                      <ModalHorario turmaId={turma.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Nenhuma turma encontrada</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <div className={styles.pagination}>
        {Array.from(
          { length: Math.ceil(turmas.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`${styles.pageButton} ${
                currentPage === i + 1 ? styles.activePage : ""
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}
