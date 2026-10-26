import { defineCourse } from "@/lib/content/define";
import { module01 } from "./modules/01-o-que-e-ia";
import { quiz01 } from "./modules/01-o-que-e-ia.quiz";
import { module02 } from "./modules/02-dados-qualidade";
import { quiz02 } from "./modules/02-dados-qualidade.quiz";
import { module03 } from "./modules/03-data-warehouse";
import { quiz03 } from "./modules/03-data-warehouse.quiz";
import { module04 } from "./modules/04-processo";
import { quiz04 } from "./modules/04-processo.quiz";
import { module05 } from "./modules/05-eda-visualizacao";
import { quiz05 } from "./modules/05-eda-visualizacao.quiz";
import { module06 } from "./modules/06-preparacao-features";
import { quiz06 } from "./modules/06-preparacao-features.quiz";
import { module07 } from "./modules/07-avaliacao";
import { quiz07 } from "./modules/07-avaliacao.quiz";
import { module08 } from "./modules/08-algoritmos-classicos";
import { quiz08 } from "./modules/08-algoritmos-classicos.quiz";

export const mlMineracao = defineCourse({
  slug: "ml-mineracao",
  title: "Machine Learning e Mineração de Dados",
  tagline: "Do primeiro modelo às redes neurais, com dados de verdade.",
  description:
    "Fundamentos de IA, dados, Data Warehouse, análise exploratória, modelos clássicos, avaliação, ensembles, explicabilidade, Deep Learning e visão computacional. Baseado nas disciplinas de ML e Mineração de Dados do SENAI CIMATEC (2026.2).",
  icon: "BrainCircuit",
  level: "Do básico ao avançado",
  estimatedHours: 40,
  theme: { from: "#7c3aed", to: "#0e7490" },
  modules: [
    { ...module01, quiz: quiz01 },
    { ...module02, quiz: quiz02 },
    { ...module03, quiz: quiz03 },
    { ...module04, quiz: quiz04 },
    { ...module05, quiz: quiz05 },
    { ...module06, quiz: quiz06 },
    { ...module07, quiz: quiz07 },
    { ...module08, quiz: quiz08 },
  ],
  upcoming: [
    { title: "Ensembles e explicabilidade", description: "Bagging, Random Forest, boosting, stacking e SHAP." },
    { title: "Aprender com poucos rótulos", description: "Não supervisionado, semi-supervisionado, active learning e self-supervised." },
    { title: "Deep Learning", description: "Perceptron, funções de ativação, loss, gradiente e backpropagation." },
    { title: "Visão computacional e IA generativa", description: "CNNs, tarefas de visão e fundamentos de IA generativa." },
  ],
});
