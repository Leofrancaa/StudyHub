import { defineModule } from "@/lib/content/define";

/**
 * Fontes: Aula08 (avaliação × validação, modelos A/B, acurácia enganosa, matriz de confusão, precision,
 * recall, F1, split, K-Fold e variantes, over/underfitting), MD 07 (métricas de classificação e regressão),
 * MD 14 (R²), MD 15 (viés-variância, validação cruzada).
 * Correções ao material: mais dados raramente resolvem underfitting (Aula08 s23); R² de teste pode ser negativo (MD 14 s16).
 */
export const module07 = defineModule({
  slug: "avaliacao",
  title: "Avaliação de modelos",
  description: "Escolher a métrica certa, validar sem se enganar e diagnosticar over e underfitting.",
  objectives: [
    "Calcular precision, recall, F1 e acurácia a partir da matriz de confusão",
    "Escolher a métrica e o limiar pelo custo do erro no negócio",
    "Validar com o tipo certo de K-Fold e diagnosticar viés e variância",
  ],
  estimatedMinutes: 40,
  questionsPerAttempt: 10,
  slides: [
    {
      id: "abertura",
      tags: [],
      blocks: [
        { type: "heading", eyebrow: "Módulo 7", text: "Não existe métrica sem contexto" },
        { type: "text", md: "Um modelo com 91% de acurácia pode ser pior que outro com 89%. Tudo depende de **qual erro custa mais** e de como você mediu." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Target", title: "Métricas", description: "Matriz de confusão, precision, recall, F1, MAE, RMSE." },
            { icon: "Layers", title: "Validação", description: "Treino, validação, teste e K-Fold do jeito certo." },
            { icon: "Gauge", title: "Diagnóstico", description: "Overfitting, underfitting e o trade-off viés-variância." },
          ],
        },
      ],
    },
    {
      id: "split",
      tags: ["split"],
      blocks: [
        { type: "heading", eyebrow: "Aula 08", text: "Treino, validação e teste" },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "BrainCircuit", title: "Treino (60–80%)", description: "Aprender os parâmetros." },
            { icon: "Search", title: "Validação (10–20%)", description: "Escolher modelo e hiperparâmetros." },
            { icon: "ShieldCheck", title: "Teste (10–20%)", description: "Avaliação final e imparcial." },
          ],
        },
        { type: "callout", variant: "warning", title: "Regra de ouro", md: "O teste fica **trancado** até o fim. Se você o usa repetidamente para decidir, ele deixa de ser teste. Com poucos dados, use validação cruzada no treino e preserve o teste." },
      ],
    },
    {
      id: "acuracia",
      tags: ["acuracia"],
      blocks: [
        { type: "heading", eyebrow: "Aula 08", text: "A acurácia engana" },
        {
          type: "text",
          md: "10.000 transações: **9.900 legítimas** e **100 fraudes**. Um \"modelo\" que responde sempre \"legítima\" acerta 9.900/10.000 = **99% de acurácia** e detecta **0% das fraudes**.\n\nAcurácia = acertos / total. Só é uma boa métrica quando as classes são **balanceadas** e os erros custam **igual**.",
        },
      ],
    },
    {
      id: "matriz",
      tags: ["matriz"],
      blocks: [
        { type: "heading", eyebrow: "A base de quase todas as métricas", text: "Matriz de confusão" },
        {
          type: "code",
          language: "text",
          code: "                 Previsto +    Previsto −\nReal +              TP            FN\nReal −              FP            TN\n\nTP: previu positivo e era positivo\nFP: previu positivo, mas era negativo  (alarme falso)\nFN: previu negativo, mas era positivo  (deixou passar)\nTN: previu negativo e era negativo",
        },
      ],
    },
    {
      id: "precision-recall",
      tags: ["precision-recall"],
      blocks: [
        { type: "heading", eyebrow: "Aula 08", text: "Precision × recall" },
        {
          type: "comparison",
          left: {
            title: "Precision = TP / (TP + FP)",
            points: ["\"Quando diz positivo, acerta?\"", "Alta = poucos alarmes falsos", "Priorize quando o alarme falso é caro", "Ex.: bloquear transação legítima, inspeção humana cara"],
          },
          right: {
            title: "Recall = TP / (TP + FN)",
            points: ["\"Dos positivos reais, quantos achou?\"", "Alta = deixa passar poucos", "Priorize quando perder um positivo é caro", "Ex.: doença grave, fraude, falha crítica"],
          },
        },
      ],
    },
    {
      id: "analogia-fumaca",
      tags: ["precision-recall"],
      blocks: [
        {
          type: "analogy",
          icon: "Lightbulb",
          concept: { title: "Trade-off precision × recall", description: "Aumentar a sensibilidade pega mais positivos e também gera mais alarmes falsos." },
          analogy: { title: "Detector de fumaça", description: "Muito sensível (recall alto) apita com torrada queimada. Pouco sensível (precision alta) nunca dá alarme falso, mas pode calar num incêndio." },
        },
      ],
    },
    {
      id: "f1-limiar",
      tags: ["f1-limiar"],
      blocks: [
        { type: "heading", eyebrow: "Aula 08", text: "F1-score e limiar de decisão" },
        {
          type: "text",
          md: "**F1 = 2 · (P · R) / (P + R)**, média harmônica que pune desequilíbrio. Precision 0,90 e recall 0,50 dão F1 ≈ **0,64**, não 0,70.\n\nO modelo devolve uma **probabilidade**; o **limiar** (padrão 0,5) transforma em classe. Baixar o limiar aumenta o recall e reduz a precision. A **PR-AUC** resume a qualidade em todos os limiares e é útil com classes desbalanceadas.",
        },
        {
          type: "mini-check",
          question: "TP = 40, FP = 10, FN = 20. Qual a precision?",
          options: ["0,67", "0,80", "0,50", "0,40"],
          answerIndex: 1,
          explanation: "Precision = 40 / (40 + 10) = 0,80. O recall seria 40 / (40 + 20) ≈ 0,67.",
        },
      ],
    },
    {
      id: "modelo-a-b",
      tags: ["negocio-metrica"],
      blocks: [
        { type: "heading", eyebrow: "Aula 08 · caso Olist", text: "Qual modelo vai para produção?" },
        {
          type: "code",
          language: "text",
          code: "Métrica      Modelo A   Modelo B\nAccuracy       0,91       0,89\nPrecision      0,72       0,61\nRecall         0,48       0,79\nF1             0,58       0,69\nPR-AUC         0,54       0,71",
        },
        {
          type: "text",
          md: "Se perder um atraso custa caro (cliente insatisfeito, reembolso) e a operação dá conta de revisar mais pedidos, **B** é melhor: acha 79% dos atrasos. Se cada alerta exige uma ação cara e a equipe é pequena, a precision de **A** pesa mais. **Não existe resposta sem contexto de negócio.**",
        },
      ],
    },
    {
      id: "regressao-metricas",
      tags: ["regressao-metricas"],
      blocks: [
        { type: "heading", eyebrow: "MD 07 · MD 14", text: "Métricas de regressão" },
        {
          type: "card-grid",
          columns: 2,
          cards: [
            { icon: "Ruler", title: "MAE", description: "Média do |erro|. Mesma unidade do alvo, fácil de explicar, pesa erros grandes linearmente." },
            { icon: "Calculator", title: "MSE", description: "Média do erro². Pune muito erros grandes; unidade ao quadrado." },
            { icon: "Gauge", title: "RMSE", description: "√MSE: volta à unidade original e ainda pune erros grandes." },
            { icon: "ChartLine", title: "R²", description: "Fração da variância explicada. 1 é perfeito; no teste pode ser NEGATIVO se o modelo for pior que prever a média." },
          ],
        },
        { type: "callout", variant: "warning", title: "Correção ao material", md: "O MD 14 diz que o R² varia entre 0 e 1. Isso só vale no treino de uma regressão linear com intercepto. Em dados novos o R² pode ficar abaixo de zero." },
      ],
    },
    {
      id: "validacao-cruzada",
      tags: ["validacao-cruzada"],
      blocks: [
        { type: "heading", eyebrow: "Aula 08", text: "Validação cruzada (K-Fold)" },
        { type: "text", md: "Divide o treino em **K partes**; treina K vezes, validando cada vez numa parte diferente, e tira a média. Estima melhor o desempenho fora da amostra do que um único split." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Scale", title: "Stratified K-Fold", description: "Mantém a proporção das classes em cada fold. Ideal com desbalanceamento." },
            { icon: "Users", title: "Group K-Fold", description: "Registros do mesmo grupo (cliente, paciente) ficam no mesmo fold." },
            { icon: "Gauge", title: "Time Series Split", description: "Treina no passado e valida no futuro. Embaralhar séries temporais vaza." },
          ],
        },
        {
          type: "code",
          language: "python",
          code: 'cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\nscores = cross_val_score(modelo, X_train, y_train, cv=cv, scoring="average_precision")\nprint(scores.mean(), scores.std())',
        },
      ],
    },
    {
      id: "over-under",
      tags: ["over-under"],
      blocks: [
        { type: "heading", eyebrow: "Aula 08 · MD 15", text: "Overfitting × underfitting" },
        {
          type: "comparison",
          left: { title: "Overfitting (sobreajuste)", points: ["Ótimo no treino, ruim no teste", "Decorou ruído em vez de regras", "Alta variância", "Ex.: KNN com k = 1"] },
          right: { title: "Underfitting (subajuste)", points: ["Ruim no treino e no teste", "Modelo simples demais ou features fracas", "Alto viés", "Ex.: reta para um padrão curvo"] },
        },
      ],
    },
    {
      id: "vies-variancia",
      tags: ["vies-variancia", "over-under"],
      blocks: [
        { type: "heading", eyebrow: "MD 15", text: "O trade-off viés-variância" },
        {
          type: "text",
          md: "Aumentar a complexidade reduz o **viés** e aumenta a **variância**; o ponto ótimo minimiza o erro de teste.\n\n- Contra **overfitting**: mais dados, modelo mais simples, regularização (L1/L2), dropout, early stopping, ensembles.\n- Contra **underfitting**: modelo mais complexo, features melhores, menos regularização, treinar mais.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Correção ao material",
          md: "A Aula 08 lista \"aumentar o conjunto de dados\" como solução de underfitting. Mais exemplos raramente resolvem alto viés: se o modelo não consegue representar o padrão, ele continua errando. Mais dados combatem overfitting.",
        },
      ],
    },
    {
      id: "resumo",
      tags: [],
      blocks: [
        {
          type: "summary",
          points: [
            "Treino aprende, validação escolhe, teste avalia uma vez no fim.",
            "Acurácia engana com classes desbalanceadas. Precision = TP/(TP+FP); recall = TP/(TP+FN); F1 = média harmônica.",
            "Limiar troca precision por recall; a escolha vem do custo do erro no negócio.",
            "MAE, MSE, RMSE e R² (que pode ser negativo no teste).",
            "Stratified, Group e Time Series K-Fold. Overfitting = alta variância; underfitting = alto viés.",
          ],
        },
      ],
    },
  ],
});
