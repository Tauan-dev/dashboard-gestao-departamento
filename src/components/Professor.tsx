import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import style from "../styles/Professor.module.css";

interface Professor {
  matricula: number;
  nome: string;
  img: string;
}

interface ProfessorDropdownProps {
  onSelect: (professorMatricula: number) => void; // Prop para enviar a matrícula do professor selecionado
}

export default function ProfessorDropdown({
  onSelect,
}: ProfessorDropdownProps) {
  const router = useRouter();
  const { areaId } = router.query;
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

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
    onSelect(professor.matricula); // Chama a função passada via prop com a matrícula do professor
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
                src={`/${selectedProfessor.img}`} // Mostra o professor selecionado
                alt={selectedProfessor.nome}
              />
            </Avatar>
            {selectedProfessor.nome}
          </div>
        ) : (
          <span>Selecionar Professor</span>
        )}
      </div>


      {isOpen && (
        <ul className={style.dropdownList}>
          {professores.map((professor) => (
            <li
              key={professor.matricula}
              className={style.dropdownItem}
              onClick={() => handleSelectProfessor(professor)} 
            >
              <div className={style.professorInfo}>
                <Avatar className={style.avatar}>
                  <AvatarImage
                    className={style.avatarImg}
                    src={`/${professor.img}`}
                    alt={professor.nome}
                  />
                </Avatar>
                {professor.nome}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
