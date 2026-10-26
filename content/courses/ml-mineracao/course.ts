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
import { module09 } from "./modules/09-ensembles-xai";
import { quiz09 } from "./modules/09-ensembles-xai.quiz";
import { module10 } from "./modules/10-poucos-rotulos";
import { quiz10 } from "./modules/10-poucos-rotulos.quiz";
import { module11 } from "./modules/11-deep-learning";
import { quiz11 } from "./modules/11-deep-learning.quiz";
import { module12 } from "./modules/12-visao-generativa";
import { quiz12 } from "./modules/12-visao-generativa.quiz";

export const mlMineracao = defineCourse({
  slug: "ml-mineracao",
  title: "Machine Learning e Mineração de Dados",
  tagline: "Do primeiro modelo às redes neurais, com dados de verdade.",
  description:
    "Fundamentos de IA, dados, Data Warehouse, análise exploratória, modelos clássicos, avaliação, ensembles, explicabilidade, Deep Learning e visão computacional. Baseado nas disciplinas de ML e Mineração de Dados do SENAI CIMATEC (2026.2).",
  icon: "BrainCircuit",
  level: "Do básico ao avançado",
  estimatedHours: 15,
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
    { ...module09, quiz: quiz09 },
    { ...module10, quiz: quiz10 },
    { ...module11, quiz: quiz11 },
    { ...module12, quiz: quiz12 },
  ],
});
