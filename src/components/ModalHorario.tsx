import { useState, useEffect } from "react";
import styles from "../styles/Horario.module.css";
import { MdOutlineAccessTime, MdClose } from "react-icons/md"; // Ícone de fechar adicionado

interface Horario {
  id: number;
  horario: string;
  dia: string;
}

interface ModalHorarioProps {
  turmaId: number; // Id da turma a ser passado para associar os horários
}

export default function ModalHorario({ turmaId }: ModalHorarioProps) {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [selectedHorarios, setSelectedHorarios] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Função para buscar os horários
  const fetchHorarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/turma/todoshorarios");
      const data = await response.json();
      setHorarios(data);
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
    }
  };

  useEffect(() => {
    fetchHorarios(); // Carrega os horários ao montar o componente
  }, []);

  const toggleModal = () => {
    setIsOpen((prevState) => !prevState); // Alterna o estado de abertura/fechamento do modal
  };

  // Função para lidar com a seleção dos horários
  const handleHorarioClick = (horarioId: number) => {
    setSelectedHorarios(
      (prev) =>
        prev.includes(horarioId)
          ? prev.filter((id) => id !== horarioId) // Remove se já estiver selecionado
          : [...prev, horarioId] // Adiciona se não estiver selecionado
    );
  };

  // Submissão para associar os horários selecionados à turma
  const onSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/turma/horario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turmaId,
          horariosIds: selectedHorarios,
        }),
      });

      if (response.ok) {
        alert("Horários alocados com sucesso!");
        setSelectedHorarios([]); // Reseta a seleção de horários
        toggleModal(); // Fecha o modal após a submissão
      } else {
        console.error("Erro ao alocar horários.");
      }
    } catch (error) {
      console.error("Erro ao alocar horários.", error);
    }
  };

  const horariosUnicos = [...new Set(horarios.map((h) => h.horario))]; // Captura horários únicos

  return (
    <>
      <button className={styles.openButton} onClick={toggleModal}>
        <MdOutlineAccessTime />
      </button>

      {isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={toggleModal}>
              <MdClose />
            </button>

            <h2 className={styles.modalTitle}>Alocação de Horário</h2>
            <form onSubmit={onSubmit}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Horário</th>
                      <th>Seg</th>
                      <th>Ter</th>
                      <th>Qua</th>
                      <th>Qui</th>
                      <th>Sex</th>
                      <th>Sáb</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horariosUnicos.map((horarioUnico, index) => (
                      <tr key={index}>
                        <td className={styles.timeColumn}>{horarioUnico} </td>
                        {[
                          "Segunda",
                          "Terça",
                          "Quarta",
                          "Quinta",
                          "Sexta",
                          "Sábado",
                        ].map((dia) => {
                          const horario = horarios.find(
                            (h) => h.dia === dia && h.horario === horarioUnico
                          );
                          return (
                            <td
                              key={dia}
                              className={
                                selectedHorarios.includes(horario?.id ?? 0)
                                  ? styles.selected
                                  : styles.unselected
                              }
                              onClick={() =>
                                horario && handleHorarioClick(horario.id)
                              }
                            >
                              {horario && selectedHorarios.includes(horario.id)
                                ? "●"
                                : ""}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button className={styles.confirmButton} type="submit">
                Confirmar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
