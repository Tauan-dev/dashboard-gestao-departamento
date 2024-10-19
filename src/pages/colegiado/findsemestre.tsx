import { useState } from "react";

interface Semestre {
  id: number;
  semestre: string;
}

export default function SemestreDetail() {
  const [semestreId, setSemestreId] = useState<number | null>(null);
  const [semestre, setSemestre] = useState<Semestre | null>(null);

  const fetchSemestre = async () => {
    if (semestreId === null) return;

    try {
      const response = await fetch(
        `http://localhost:3000/colegiado/semestre/${semestreId}`
      );
      const data = await response.json();
      setSemestre(data);
    } catch (error) {
      console.error("Erro ao buscar semestre:", error);
    }
  };

  return (
    <div>
      <h1>Detalhes do Semestre</h1>
      <input
        type="number"
        placeholder="Digite o ID do Semestre"
        onChange={(e) => setSemestreId(Number(e.target.value))}
      />
      <button onClick={fetchSemestre}>Buscar Semestre</button>
      {semestre && (
        <div>
          <h3>ID: {semestre.id}</h3>
          <h3>Semestre: {semestre.semestre}</h3>
        </div>
      )}
    </div>
  );
}
