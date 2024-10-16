import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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

  // Fetch de todos os colegiados
  useEffect(() => {
    async function fetchColegiados() {
      try {
        console.log("Tentando buscar os colegiados...");
        const response = await fetch("http://localhost:3000/colegiado");

        if (!response.ok) {
          throw new Error("Erro ao buscar os colegiados");
        }

        const data = await response.json();
        console.log("Dados recebidos:", data); // Verifica se os dados estão sendo retornados
        setColegiados(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchColegiados();
  }, []);

  // Atualiza a URL quando o colegiado é selecionado
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const colegiadoId = parseInt(event.target.value, 10);
    setSelectedColegiadoId(colegiadoId);
    console.log("Colegiado selecionado:", colegiadoId);
    router.push(`/colegiado/${colegiadoId}/turma`); // Atualiza a rota com o colegiadoId
  };

  return (
    <div>
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
