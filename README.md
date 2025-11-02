# 💰 Mesada Divertida — Jogo Educativo de Educação Financeira

**Mesada Divertida** é um jogo web interativo voltado para alunos do 5º ano do Ensino Fundamental I. O objetivo é ensinar conceitos básicos de finanças pessoais de forma lúdica, acessível e divertida.

O projeto foi desenvolvido como um Projeto Integrador com foco em tecnologias educacionais.

## 💡 Problema e Objetivo

**Problema:** A educação financeira é crucial, mas ainda é pouco abordada de forma atraente nas séries iniciais do Ensino Fundamental. A falta de recursos pedagógicos lúdicos limita o engajamento das crianças.

**Objetivo:** Desenvolver um jogo web gamificado que introduza, por meio da simulação de uma mesada virtual e desafios de consumo/economia, os conceitos básicos de finanças pessoais para crianças.

## 🚀 Funcionalidades

* **Simulação de Mesada:** Acompanhamento de uma carteira virtual (`wallet`) com ganhos e gastos em tempo real.
* **Sistema de Pontuação:** Pontos de "Consciência Financeira" (`score`) para gamificação do aprendizado.
* **Quiz Gamificado:** Desafios de múltipla escolha que simulam decisões financeiras do cotidiano infantil.
* **Feedback Imediato:** Feedback visual e sonoro sobre as consequências das escolhas (boas ou ruins).
* **Persistência de Dados:** O progresso (pontuação, saldo e fase) é salvo automaticamente no navegador do usuário via `localStorage`, permitindo continuar o jogo a qualquer momento.
* **Interface Amigável:** Design responsivo e visualmente agradável, adequado ao público infantil.

## 🛠 Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias front-end padrão, sem a necessidade de *frameworks* ou *backend*.

* **HTML5:** Estrutura e marcação do conteúdo.
* **CSS3:** Estilização e responsividade da interface.
* **JavaScript (Vanilla):** Lógica do jogo, manipulação do DOM e gestão do estado.
* **`localStorage`:** Utilizado para salvar o progresso e a pontuação no cache do navegador.
* **Editor:** Notepad++.

## 📁 Estrutura do Projeto

A organização dos arquivos é simples e direta:

```

.
├── assets/
│   ├── images/
│   │   └── logo.png  \# Imagem da logo (referenciada)
│   └── sounds/
│       ├── click.mp3   \# Som de clique (referenciado)
│       ├── fail.mp3    \# Som de erro (referenciado)
│       └── success.mp3 \# Som de acerto (referenciado)
├── index.html          \# Arquivo principal do jogo (estrutura)
├── style.css           \# Folha de estilos (aparência)
└── script.js           \# Lógica do jogo (JavaScript)
└── README.md           \# Este arquivo

````
