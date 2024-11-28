import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../../styles/Reuniao.module.css";
import Breadcrumbs from "@/components/Breadcumber";
import { BsMortarboard } from "react-icons/bs";
import Image from "next/image";
import Observacao from "../../../components/Obeservacao";
import { GoBell } from "react-icons/go";

interface Horario {
  id: number;
  horario: string;
  dia: string;
}

interface Colegiado {
  id: number;
  sigla: string;
  img: string;
}

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

interface Professor {
  matricula: number;
  nome: string;
  carga_horaria: number;
  img: string;
}

interface Turma {
  id: number;
  cod: string;
  observacao: string;
  formando: boolean;
  disciplina: Disciplina;
  horarios: Horario[];
  professores: Professor[]; // Array de professores para cada turma
}

export default function AlocacoesColegiado() {
  const router = useRouter();
  const { colegiadoId } = router.query;
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null); // Estado para modal de observação
  const [colegiado, setColegiado] = useState<Colegiado | null>(null);

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
    const fetchTurmasProfessores = async () => {
      if (!colegiadoId) return;
      try {
        const response = await fetch(
          `http://localhost:3000/colegiado/${colegiadoId}/turmas-professores`
        );
        const data = await response.json();
        setTurmas(data);
      } catch (error) {
        console.error("Erro ao buscar turmas e professores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurmasProfessores();
  }, [colegiadoId]);

  const handleObservacaoClick = (turma: Turma) => {
    setSelectedTurma(turma);
  };

  const closeObservacao = () => {
    setSelectedTurma(null);
  };

  return (
    <div className={styles.bg}>
      <header>
        <Breadcrumbs />
        <h2>Professores alocados</h2>
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

      <section className={styles.turmaTable}>
        <div className={styles.container}>
          <h2 className={styles.title}>Alocações de Turmas e Professores</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : turmas.length > 0 ? (
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>CÓDIGO</th>
                  <th>DISCIPLINA</th>
                  <th>TURMA</th>
                  <th>CH</th>
                  <th>CHS</th>
                  <th>BACH/LICENC</th>

                  <th>PROFESSORES</th>
                  <th>OBS</th>
                </tr>
              </thead>
              <tbody className={styles.tableReuniao}>
                {turmas.map((turma) => (
                  <tr key={turma.id} className={styles.tableRow}>
                    <td>{turma.disciplina.cod}</td>
                    <td>{turma.disciplina.nome}</td>
                    <td>{turma.cod}</td>
                    <td>{turma.disciplina.cargaHoraria}</td>
                    <td>{turma.disciplina.cargaHorariaSemanal}</td>
                    <td>
                      {turma.disciplina.cursos
                        .map((curso) => curso.tipo)
                        .join(", ")}
                    </td>

                    <td>
                      {turma.professores.length > 0 ? (
                        turma.professores
                          .map((professor) => `${professor.nome} `)
                          .join(", ")
                      ) : (
                        <span>Sem professor alocado</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={styles.obs}
                        onClick={() => handleObservacaoClick(turma)}
                        type="button"
                      >
                        <GoBell size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhuma alocação de professor encontrada para este colegiado.</p>
          )}
        </div>
      </section>

      {selectedTurma && (
        <Observacao turma={selectedTurma} onClose={closeObservacao} />
      )}
    </div>
  );
}
