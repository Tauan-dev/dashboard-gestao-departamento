import { useState } from "react";
import styles from "../../styles/CreateSemestre.module.css";
interface CreateSemestre {
  semestre: string;
}

export default function CreateSemestre() {
  const [semestre, setSemestre] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSemestre: CreateSemestre = { semestre };

    try {
      const response = await fetch(
        "http://localhost:3000/colegiado/createSemestre",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSemestre),
        }
      );

      if (response.ok) {
        console.log("Semestre criado com sucesso!");
        setSemestre(""); // Limpar campo após criação
      } else {
        console.error("Erro ao criar semestre.");
      }
    } catch (error) {
      console.error("Erro ao criar semestre:", error);
    }
  };

  return (
    <div className={styles["create-semestre-container"]}>
      <h1>Criar Novo Semestre</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Semestre:
          <input
            type="text"
            value={semestre}
            onChange={(e) => setSemestre(e.target.value)}
            required
          />
        </label>
        <button type="submit">Criar</button>
      </form>
    </div>
  );
}
