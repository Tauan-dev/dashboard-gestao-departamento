import React, { useEffect, useState } from "react";
import styles from "../../../styles/Reuniao.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import Breadcrumbs from "@/components/Breadcumber";
import { BsMortarboard } from "react-icons/bs";
import Professor from "@/components/Professor";
import Observacao from "@/components/Obeservacao";
import { PiBellSimple } from "react-icons/pi";

interface Horario {
  id: number;
  horario: string;
  dia: string;
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

interface Turma {
  id: number;
  cod: string;
  observacao: string;
  formando: boolean;
  disciplina: Disciplina;
  horarios: Horario[];
}

export default function ReuniaoArea() {
  const router = useRouter();
  const { areaId } = router.query;
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [areaNome, setAreaNome] = useState<string>("");

  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);

  const fetchTurmasByArea = async (areaId: string | string[] | undefined) => {
    if (!areaId) return;
    try {
      const response = await fetch(`http://localhost:3000/area/${areaId}`);
      const data = await response.json();
      setTurmas(data);

      if (data.length > 0) {
        setAreaNome(data[0].disciplina.area.nome);
      }
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (areaId) {
      fetchTurmasByArea(areaId);
    }
  }, [areaId]);

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
        <h2>Alocação de Professores</h2>
        <div className={styles.corpoDepto}>
          <div className={styles.headerName}>
            <div className={styles.headerTitleDiv}>
              <span className={styles.headerTitle}>AREA</span>
              <span className={styles.headerTitleChildren}>{areaNome}</span>
            </div>
            <div className={styles.icon}>
              <Image
                src={"/default_image_path.png"}
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

      <section className={styles.turmaTable}>
        <div className={styles.container}>
          <h2 className={styles.title}>Reunião de Area</h2>
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
                  <th>BACHARELADO/LICENCIATURA</th>
                  <th>CURSO</th>
                  <th>PROFESSOR</th>
                  <th>OBS</th>
                  <th>ALOCAR</th>
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
                      {turma.disciplina.cursos
                        .map((curso) => curso.nome)
                        .join(", ")}
                    </td>
                    <td>
                      <Professor />
                    </td>
                    <td>
                      <button
                        className={styles.obs}
                        onClick={() => handleObservacaoClick(turma)}
                      >
                        <PiBellSimple />
                      </button>
                    </td>
                    <td>alocar</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhuma turma encontrada para esta área.</p>
          )}
        </div>
      </section>

      {selectedTurma && (
        <Observacao turma={selectedTurma} onClose={closeObservacao} />
      )}
    </div>
  );
}
