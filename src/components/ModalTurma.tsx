/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import styles from "../styles/ModalTurma.module.css";
import { RiAddLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { IoClose } from "react-icons/io5";
import { MdClose } from "react-icons/md";

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
  semestreId: number;
}

export default function ModalComponent({ disciplina }: ModalComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [semestre, setSemestre] = useState<{
    id: number;
    semestre: string;
  } | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      formando: false,
      cod: "",
      observacao: "",
    },
  });

  const fetchSemestre = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/colegiado/semestreAtual`
      );
      const data = await response.json();
      setSemestre(data);
    } catch (error) {
      console.error("Erro ao buscar semestre:", error);
    }
  };

  useEffect(() => {
    fetchSemestre();
  }, []);

  // Função para submissão do formulário
  const onSubmit = async (data: FormData) => {
    console.log({
      ...data,
      semestreId: semestre?.id,
      disciplinaToTurmaId: disciplina.id,
    });

    try {
      const response = await fetch("http://localhost:3000/turma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          semestreId: semestre?.id,
          disciplinaToTurmaId: disciplina.id,
        }),
      });

      if (response.ok) {
        form.reset(); // Limpa os campos do formulário após o envio bem-sucedido
        toggleModal(); // Fecha o modal após a submissão bem-sucedida
      } else {
        console.error("Erro ao enviar o formulário");
        alert("Código da Turma já cadastrado");
      }
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const id = disciplina.id;
  const codigo = disciplina.cod;
  const nome = disciplina.nome;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={toggleModal}>
        {isOpen && (
          <div className={styles.modalBackdrop} onClick={toggleModal}></div>
        )}
        <DialogTrigger asChild>
          <button className={styles.addButton} onClick={toggleModal}>
            <RiAddLine size={20} />
          </button>
        </DialogTrigger>
        <DialogContent className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={toggleModal}>
              <MdClose />
            </button>
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
                          {...field}
                          placeholder=""
                          value={codigo}
                          className={styles.formControlCod}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="nome"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className={styles.form}>
                      <FormLabel className={styles.formLabel}>
                        DISCIPLINA
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
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
                <div className={styles.checkmodal}>
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
                            {...field}
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
                </div>

                <FormField
                  name="observacao"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className={styles.form}>
                      <FormLabel className={styles.formLabel}>
                        OBSERVAÇÕES DO COLEGIADO
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          placeholder=""
                          className={styles.formControl}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="disciplina"
                  render={({ field }) => (
                    <input type="hidden" {...field} value={id} />
                  )}
                />
                <FormField
                  control={form.control}
                  name="semestreId"
                  render={({ field }) => (
                    <input type="hidden" {...field} value={semestre?.id} />
                  )}
                />
                <div className={styles.modalFooter}>
                  <button className={styles.buttonSave} type="submit">
                    Enviar Demanda
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
