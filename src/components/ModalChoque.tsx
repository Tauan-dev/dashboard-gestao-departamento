import React from "react";
import styles from "../styles/ModalChoque.module.css"; // Crie um arquivo CSS para estilizar o modal

interface ConflictModalProps {
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConflictModal: React.FC<ConflictModalProps> = ({
  title,
  message,
  onClose,
  onConfirm,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.msg}>{message}</p>
        <p className={styles.spam}>Deseja continuar mesmo assim?</p>
        <div></div>
        <div className={styles.modalActions}>
          <button className={styles.buttonCancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.buttonConform} onClick={onConfirm}>
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
