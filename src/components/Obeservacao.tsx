import React from "react";
import styles from ".././styles/Observacoes.module.css";
import { IoClose } from "react-icons/io5";
interface Horario {
  id: number;
  horario: string;
  dia: string;
}

interface Turma {
  id: number;
  cod: string;
  observacao: string;
  formando: boolean;
  disciplina: Disciplina;
  horarios: Horario[];
}

interface Disciplina {
  id: number;
  cod: string;
  nome: string;
  cargaHoraria: number;
  cargaHorariaSemanal: number;
}

interface SidebarProps {
  turma: Turma;
  onClose: () => void;
}

export default function Observacao({ turma, onClose }: SidebarProps) {
  return (
    <div className={styles.sidebar}>
      <button className={styles.closeButton} onClick={onClose}>
        <IoClose />
      </button>
      <h2 className={styles.title}>Observação</h2>
      <p className={styles.cod}>#{turma.disciplina.cod}</p>
      <div className={styles.board}>
        <div className={styles.obsboard1}>
          <p className={styles.observacao}>{turma.observacao}</p>
          {turma.formando && (
            <span className={styles.formandoBadge}>Formando</span>
          )}
        </div>
        <div className={styles.obsboard2}>
          <div className={styles.horarios}>
            <h3>Horários:</h3>
            {turma.horarios.length > 0 ? (
              turma.horarios.map((h) => (
                <div key={h.id} className={styles.horario}>
                  {h.dia}: {h.horario}
                </div>
              ))
            ) : (
              <p>Sem horários</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
