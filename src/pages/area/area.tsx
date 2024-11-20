import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/ColegiadoDropdown.module.css"; // Certifique-se de vincular o CSS

interface Area {
  id: number;
  nome: string;
}

export default function AreaDropdown() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchAreas() {
      try {
        const response = await fetch("http://localhost:3000/area");

        if (!response.ok) {
          throw new Error("Erro ao buscar os areas");
        }

        const data = await response.json();
        setAreas(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchAreas();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const areaId = parseInt(event.target.value, 10);
    setSelectedAreaId(areaId);
    router.push(`/area/${areaId}/reuniao`);
  };

  return (
    <div className={styles.dropdown_container}>
      <label htmlFor="colegiado">Selecione uma Area: </label>
      <select
        id="colegiado"
        onChange={handleChange}
        value={selectedAreaId || ""}
      >
        <option value="">Escolha um Area</option>
        {areas.length === 0 ? (
          <option value="">Carregando areas...</option>
        ) : (
          areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.nome}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
