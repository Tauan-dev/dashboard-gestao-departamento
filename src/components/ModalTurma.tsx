/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import styles from "../styles/ModalTurma.module.css";
import { RiAddLine } from "react-icons/ri";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

interface Disciplina {
  id: number;
  cod: string;
  nome: string;
  cargaHoraria: number;
}

interface ModalComponentProps {
  disciplina: Disciplina;
}

interface FormData {
  codDisciplina: string;
  nome: string;
  cod: string;
  observacao: string;
  formando: boolean;
  disciplina: number;
  semestre: number;
}

export default function ModalComponent({ disciplina }: ModalComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    fetch("http://localhost:3000/turma", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const id = disciplina.id;
  const cod = disciplina.cod;
  const nome = disciplina.nome;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={toggleModal}>
        {isOpen && (
          <div className={styles.modalBackdrop} onClick={toggleModal}></div>
        )}
        <DialogTrigger asChild>
          <button className={styles.addButton} onClick={toggleModal}>
            <RiAddLine />
          </button>
        </DialogTrigger>
        <DialogContent className={styles.modal}>
          <div className={styles.modalContent}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  name="codDisciplina"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className={styles.form}>
                      <FormLabel className={styles.formLabel}>
                        CÓDIGO DA DISCIPLINA
                      </FormLabel>
                      <FormControl>
                        <input
                          placeholder=""
                          value={cod}
                          className={styles.formControlCod}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="codDisciplina"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className={styles.form}>
                      <FormLabel className={styles.formLabel}>
                        DISCIPLINA
                      </FormLabel>
                      <FormControl>
                        <input
                          placeholder=""
                          value={nome}
                          className={styles.formControlDisc}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="cod"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className={styles.form}>
                      <FormLabel className={styles.formLabel}>
                        CÓDIGO DA TURMA
                      </FormLabel>
                      <FormControl>
                        <input
                          placeholder="T01"
                          className={styles.formControl}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="formando"
                  render={({ field }) => (
                    <FormItem className={styles.formcheck}>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className={styles.checkbox}
                        />
                      </FormControl>
                      <FormLabel className={styles.formLabel}>
                        TEM FORMANDO?
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="observacao"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className={styles.form}>
                      <FormLabel className={styles.formLabel}>
                        OBSERVAÇÕES DO COLEGIADO
                      </FormLabel>
                      <FormControl>
                        <input placeholder="" className={styles.formControl} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="disciplina"
                  render={({ field }) => <input type="hidden" value={id} />}
                />
                <button type="submit">Salvar</button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}





