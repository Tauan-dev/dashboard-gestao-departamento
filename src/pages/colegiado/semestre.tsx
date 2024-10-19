import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface Semestre {
  id: number;
  semestre: string;
}

export default function SemestreDropdown() {
  const [semestres, setSemestres] = useState<Semestre[]>([]);
  const [selectedSemestreId, setSelectedSemestreId] = useState<number | null>(
    null
  );
  const router = useRouter();

  // Fetch de todos os semestres
  useEffect(() => {
    async function fetchSemestres() {
      try {
        console.log("Buscando semestres...");
        const response = await fetch(
          "http://localhost:3000/colegiado/semestre"
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar os semestres");
        }

        const data = await response.json();
        console.log("Dados de semestres recebidos:", data);
        setSemestres(data);
      } catch (error) {
        console.error("Erro ao buscar semestres:", error);
      }
    }

    fetchSemestres();
  }, []);

  // Atualiza a URL quando o semestre é selecionado
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const semestreId = parseInt(event.target.value, 10);
    setSelectedSemestreId(semestreId);
    console.log("Semestre selecionado:", semestreId);
    router.push(`/colegiado/semestre/${semestreId}/turmas`); // Atualiza a rota com o semestreId
  };

  return (
    <div>
      <label htmlFor="semestre">Selecione um Semestre: </label>
      <select
        id="semestre"
        onChange={handleChange}
        value={selectedSemestreId || ""}
      >
        <option value="">Escolha um semestre</option>
        {semestres.length === 0 ? (
          <option value="">Carregando semestres...</option>
        ) : (
          semestres.map((semestre) => (
            <option key={semestre.id} value={semestre.id}>
              {semestre.semestre}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
