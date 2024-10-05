import { useState } from "react";
import styles from "../styles/Sidebar.module.css";
import Link from "next/link";
import { IoGridOutline } from "react-icons/io5";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GiOrganigram } from "react-icons/gi";
import { IoMdPerson } from "react-icons/io";
import { useRouter } from "next/router"; // Importando useRouter

export default function Sidebar() {
  const router = useRouter(); // Hook do Next.js para pegar a rota atual
  const [activeParent, setActiveParent] = useState<string | null>(null);

  // Função para verificar se a rota está ativa
  const isActive = (route: string) => {
    return router.pathname.includes(route);
  };

  // Função para alternar o dropdown
  const handleParentClick = (parent: string) => {
    setActiveParent(parent === activeParent ? null : parent); // Ativa/desativa o item clicado
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles["icon-wrapper"]}>
          <div className={styles["icon-bar"]}></div>
          <div className={styles["icon-bar"]}></div>
        </div>
        <span>Tenho que inventar algum nome</span>
      </div>

      <nav className={styles.nav}>
        <ul>
          {/* Item Colegiado */}
          <li>
            <div
              onClick={() => handleParentClick("colegiado")}
              className={`${styles.dropdownHeader} ${
                isActive("/colegiado") ? styles.active : ""
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
              <li>
                <Link href="/colegiado/turmas">Turmas</Link>
              </li>
              <li>
                <Link href="/colegiado/campaign">Campaign 02</Link>
              </li>
              <li>
                <Link href="/colegiado/meeting">Meeting 03</Link>
              </li>
            </ul>
          </li>

          {/* Item Departamento */}
          <li>
            <div
              onClick={() => handleParentClick("departamento")}
              className={`${styles.dropdownHeader} ${
                isActive("/departamento") ? styles.active : ""
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
                <Link href="/departamento/organizacao">Organização</Link>
              </li>
              <li>
                <Link href="/departamento/pesquisas">Pesquisas</Link>
              </li>
            </ul>
          </li>

          {/* Item Área */}
          <li>
            <div
              onClick={() => handleParentClick("area")}
              className={`${styles.dropdownHeader} ${
                isActive("/area") ? styles.active : ""
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
                <Link href="/area/desenvolvimento">Desenvolvimento</Link>
              </li>
              <li>
                <Link href="/area/inovacao">Inovação</Link>
              </li>
            </ul>
          </li>

          {/* Item Professor */}
          <li>
            <div
              onClick={() => handleParentClick("professor")}
              className={`${styles.dropdownHeader} ${
                isActive("/professor") ? styles.active : ""
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
                <Link href="/professor/curriculo">Currículo</Link>
              </li>
              <li>
                <Link href="/professor/publicacoes">Publicações</Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div className={styles.logout}>
        <Link href="/logout">Logout</Link>
      </div>
    </div>
  );
}
