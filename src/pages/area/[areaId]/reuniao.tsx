import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import styles from "../../../styles/Reuniao.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import Breadcrumbs from "@/components/Breadcumber";
import { BsMortarboard } from "react-icons/bs";
import ProfessorDropdown from "@/components/Professor";
import Observacao from "@/components/Obeservacao";
import { PiBellSimple } from "react-icons/pi";
import ConflictModal from "../../../components/ModalChoque";

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
  const [professoresAlocados, setProfessoresAlocados] = useState<
    Record<number, number>
  >({});
  const [horarioConflito, setHorarioConflito] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarKey, setSnackbarKey] = useState(0); // Estado para gerar nova key

  useEffect(() => {
    const fetchTurmasByArea = async () => {
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

    fetchTurmasByArea();
  }, [areaId]);

  const handleProfessorSelect = (
    turmaId: number,
    professorMatricula: number
  ) => {
    setProfessoresAlocados((prev) => ({
      ...prev,
      [turmaId]: professorMatricula,
    }));
    verificarChoqueDeHorario(turmaId, professorMatricula);
    verificarCargaHorariaSemanal(professorMatricula);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function SlideTransition(props: any) {
    return <Slide {...props} direction="up" />;
  }

  const verificarChoqueDeHorario = (
    turmaId: number,
    professorMatricula: number
  ) => {
    const horariosProfessor = turmas
      .filter((turma) => professoresAlocados[turma.id] === professorMatricula)
      .flatMap((turma) => turma.horarios.map((h) => `${h.dia} ${h.horario}`));

    const horariosAtual = turmas
      .find((turma) => turma.id === turmaId)
      ?.horarios.map((h) => `${h.dia} ${h.horario}`);

    if (
      horariosAtual &&
      horariosAtual.some((h) => horariosProfessor.includes(h))
    ) {
      setHorarioConflito(
        "A turma selecionada entra em conflito com outra turma do mesmo professor"
      );
    }
  };

  const verificarCargaHorariaSemanal = (professorMatricula: number) => {
    const totalCargaHoraria = turmas
      .filter((turma) => professoresAlocados[turma.id] === professorMatricula)
      .reduce((acc, turma) => acc + turma.disciplina.cargaHorariaSemanal, 0);

    if (totalCargaHoraria > 16) {
      setSnackbarMessage(
        `O professor com matrícula ${professorMatricula} excede 16 horas semanais com ${totalCargaHoraria} horas.`
      );
      setSnackbarKey((prevKey) => prevKey + 1); // Incrementa a key para reabrir o Snackbar
      setOpenSnackbar(true);
    }
  };

  const handleObservacaoClick = (turma: Turma) => {
    setSelectedTurma(turma);
  };

  const closeObservacao = () => {
    setSelectedTurma(null);
  };

  const closeModal = () => setHorarioConflito(null);

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    for (const [turmaId, professorMatricula] of Object.entries(
      professoresAlocados
    )) {
      if (professorMatricula) {
        try {
          const response = await fetch("http://localhost:3000/area/professor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              turmaId: Number(turmaId),
              professorId: professorMatricula,
            }),
          });

          if (!response.ok) {
            console.error(
              `Erro ao alocar professor ${professorMatricula} na turma ${turmaId}`
            );
          }
        } catch (error) {
          console.error("Erro ao alocar professor na turma:", error);
        }
      }
    }
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
                width={45}
                height={45}
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
          <h2 className={styles.title}>Reunião de Área</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : turmas.length > 0 ? (
            <form onSubmit={onSubmit}>
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
                        <ProfessorDropdown
                          onSelect={(professorMatricula: number) =>
                            handleProfessorSelect(turma.id, professorMatricula)
                          }
                        />
                      </td>
                      <td>
                        <button
                          className={styles.obs}
                          onClick={() => handleObservacaoClick(turma)}
                          type="button"
                        >
                          <PiBellSimple size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.buttonArea}>
                <button type="submit" className={styles.submitButton}>
                  Enviar Indicações
                </button>
              </div>
            </form>
          ) : (
            <p>Nenhuma turma encontrada para esta área.</p>
          )}
        </div>
      </section>

      <Snackbar
        key={snackbarKey} // Definindo uma nova key para reabrir o Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openSnackbar}
        autoHideDuration={9000}
        onClose={handleCloseSnackbar}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          variant="filled"
          className={styles.snackbar}
          style={{ backgroundColor: "red", color: "white" }} // não colocar style no componente
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {horarioConflito && (
        <ConflictModal
          onClose={closeModal}
          message={horarioConflito}
          title={"Existe um choque de horário"}
          onConfirm={closeModal}
        />
      )}

      {selectedTurma && (
        <Observacao turma={selectedTurma} onClose={closeObservacao} />
      )}
    </div>
  );
}
