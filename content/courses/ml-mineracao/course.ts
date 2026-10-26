import { defineCourse } from "@/lib/content/define";
import { module01 } from "./modules/01-o-que-e-ia";
import { quiz01 } from "./modules/01-o-que-e-ia.quiz";

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
  modules: [{ ...module01, quiz: quiz01 }],
  upcoming: [
    { title: "Dados: qualidade, ciclo de vida e LGPD", description: "Dimensões de qualidade, representatividade, governança e anotação." },
    { title: "Data Warehouse, ETL e OLAP", description: "OLTP × OLAP, esquema estrela e floco de neve, ETL e operações OLAP." },
    { title: "Processo: CRISP-DM e pipeline de IA", description: "KDD, CRISP-DM e como estruturar um projeto de ML." },
    { title: "Análise exploratória e visualização", description: "Estatística descritiva, hipóteses e o gráfico certo para cada pergunta." },
    { title: "Preparação de dados e features", description: "Limpeza, encoding, normalização, seleção de atributos e data leakage." },
    { title: "Avaliação de modelos", description: "Matriz de confusão, precision, recall, validação cruzada e viés-variância." },
    { title: "Algoritmos clássicos", description: "KNN, Naive Bayes, regressão linear, regressão logística e árvores." },
    { title: "Ensembles e explicabilidade", description: "Bagging, Random Forest, boosting, stacking e SHAP." },
    { title: "Aprender com poucos rótulos", description: "Não supervisionado, semi-supervisionado, active learning e self-supervised." },
    { title: "Deep Learning", description: "Perceptron, funções de ativação, loss, gradiente e backpropagation." },
    { title: "Visão computacional e IA generativa", description: "CNNs, tarefas de visão e fundamentos de IA generativa." },
  ],
});
