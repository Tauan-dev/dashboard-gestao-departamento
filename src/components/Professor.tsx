import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import style from "../styles/Professor.module.css";

interface Professor {
  matricula: number;
  nome: string;
  img: string;
}

export default function ProfessorDropdown() {
  const router = useRouter();
  const { areaId } = router.query;
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  ); // Estado para armazenar o professor selecionado
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar se o dropdown está aberto

  // Função para buscar professores via API
  const fetchProfessores = async (areaId: string | string[] | undefined) => {
    if (!areaId) return;
    try {
      const response = await fetch(
        `http://localhost:3000/area/professor/${areaId}`
      );
      const data = await response.json();
      setProfessores(data);
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
    }
  };

  useEffect(() => {
    if (areaId) {
      fetchProfessores(areaId);
    }
  }, [areaId]);

  // Alternar dropdown aberto ou fechado
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Função para selecionar um professor
  const handleSelectProfessor = (professor: Professor) => {
    setSelectedProfessor(professor); // Armazena o professor selecionado
    setIsOpen(false); // Fecha o dropdown após a seleção
  };

  return (
    <div className={style.dropdownContainer}>
      {/* Botão que abre/fecha o dropdown */}
      <div className={style.dropdownHeader} onClick={toggleDropdown}>
        {selectedProfessor ? (
          <div className={style.professorSelected}>
            <Avatar className={style.avatar}>
              <AvatarImage
                className={style.avatarImg}
                src={`/${selectedProfessor.img}.png`} // Mostra o professor selecionado
                alt={selectedProfessor.nome}
              />
            </Avatar>
            {selectedProfessor.nome}{" "}
            {/* Mostra apenas os dois primeiros nomes */}
          </div>
        ) : (
          <span>Selecionar Professor</span>
        )}
      </div>

      {/* Dropdown com a lista de professores */}
      {isOpen && (
        <ul className={style.dropdownList}>
          {professores.map((professor) => (
            <li
              key={professor.matricula}
              className={style.dropdownItem}
              onClick={() => handleSelectProfessor(professor)} // Seleciona o professor ao clicar
            >
              <div className={style.professorInfo}>
                <Avatar className={style.avatar}>
                  <AvatarImage
                    className={style.avatarImg}
                    src={`/${professor.img}.png`}
                    alt={professor.nome}
                  />
                </Avatar>
                {professor.nome} {/* Mostra apenas os dois primeiros nomes */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
