import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/ColegiadoDropdown.module.css"; // Certifique-se de vincular o CSS

interface Colegiado {
  id: number;
  nome: string;
}

export default function ColegiadoDropdown() {
  const [colegiados, setColegiados] = useState<Colegiado[]>([]);
  const [selectedColegiadoId, setSelectedColegiadoId] = useState<number | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    async function fetchColegiados() {
      try {
        const response = await fetch("http://localhost:3000/colegiado");

        if (!response.ok) {
          throw new Error("Erro ao buscar os colegiados");
        }

        const data = await response.json();
        setColegiados(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchColegiados();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const colegiadoId = parseInt(event.target.value, 10);
    setSelectedColegiadoId(colegiadoId);
    router.push(`/colegiado/${colegiadoId}/turma`);
  };

  return (
    <div className={styles.dropdown_container}>
      <label htmlFor="colegiado">Selecione um Colegiado: </label>
      <select
        id="colegiado"
        onChange={handleChange}
        value={selectedColegiadoId || ""}
      >
        <option value="">Escolha um colegiado</option>
        {colegiados.length === 0 ? (
          <option value="">Carregando colegiados...</option>
        ) : (
          colegiados.map((colegiado) => (
            <option key={colegiado.id} value={colegiado.id}>
              {colegiado.nome}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
