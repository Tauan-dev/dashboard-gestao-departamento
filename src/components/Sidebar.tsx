import { useState } from "react";
import styles from "../styles/Sidebar.module.css";
import Link from "next/link";
import { IoGridOutline } from "react-icons/io5";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GiOrganigram } from "react-icons/gi";
import { IoMdPerson } from "react-icons/io";
import { useRouter } from "next/router";

export default function Sidebar() {
  const [activeParent, setActiveParent] = useState<string | null>(null);
  const router = useRouter();
  const { colegiadoId } = router.query;

  // Função para definir qual item foi clicado
  const handleParentClick = (parent: string) => {
    setActiveParent(parent === activeParent ? null : parent); // Ativa/desativa o item clicado
    console.log(colegiadoId);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles["icon-wrapper"]}>
          <div className={styles["icon-bar"]}></div>
          <div className={styles["icon-bar"]}></div>
        </div>
        <span>Plataforma Aegis</span>
      </div>

      <nav className={styles.nav}>
        <ul>
          {/* Item Colegiado */}
          <li>
            <div
              onClick={() => handleParentClick("colegiado")}
              className={`${styles.dropdownHeader} ${
                activeParent === "colegiado" ? styles.active : ""
              }`}
            >
              <IoGridOutline />
              Colegiado
            </div>
            <ul
              className={`${styles.dropdownMenu} ${
                activeParent === "colegiado" ? styles.open : ""
              }`}
            >
              {/* <li>
                <Link href="/colegiado/semestre">Semestre</Link>
              </li> */}
              <li>
                <Link href="/colegiado/colegiado">Selecionar Colegiado</Link>
              </li>
              <li>
                <Link href={`/colegiado/${colegiadoId}/professores`}>
                  Professores Indicados
                </Link>
              </li>
            </ul>
          </li>

          {/* Item Departamento */}
          <li>
            <div
              onClick={() => handleParentClick("departamento")}
              className={`${styles.dropdownHeader} ${
                activeParent === "departamento" ? styles.active : ""
              }`}
            >
              <GiOrganigram />
              Departamento
            </div>
            <ul
              className={`${styles.dropdownMenu} ${
                activeParent === "departamento" ? styles.open : ""
              }`}
            >
              <li>
                <Link href="/departamento/createsemestre">Criar Semestre </Link>
              </li>
            </ul>
          </li>

          {/* Item Área */}
          <li>
            <div
              onClick={() => handleParentClick("area")}
              className={`${styles.dropdownHeader} ${
                activeParent === "area" ? styles.active : ""
              }`}
            >
              <FaChalkboardTeacher />
              Área
            </div>
            <ul
              className={`${styles.dropdownMenu} ${
                activeParent === "area" ? styles.open : ""
              }`}
            >
              <li>
                <Link href="/area/area">Selecionar Area</Link>
              </li>
            </ul>
          </li>

          {/* Item Professor */}
          <li>
            <div
              onClick={() => handleParentClick("professor")}
              className={`${styles.dropdownHeader} ${
                activeParent === "professor" ? styles.active : ""
              }`}
            >
              <IoMdPerson />
              Professor
            </div>
            <ul
              className={`${styles.dropdownMenu} ${
                activeParent === "professor" ? styles.open : ""
              }`}
            >
              <li>
                <Link href="/professor/curriculo">Projetos</Link>
              </li>
              <li>
                <Link href="/professor/horarioProf">Horarios</Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
