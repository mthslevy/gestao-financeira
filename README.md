# 💰 Dashboard Gestão Financeira

Este projeto é um ecossistema de gestão financeira desenvolvido com tecnologias modernas, focado em visualização de dados (gráficos de evolução e categorias) e segurança de autenticação.

---

## 🚀 Funcionalidades Principais

* **Gestão de Património:** Registo e visualização de receitas, despesas e saldo acumulado.
* **Gráficos Dinâmicos:** Visualização premium da evolução do património e distribuição por categorias (utilizando Recharts).
* **Sistema de Autenticação:** Registo e login de utilizadores com confirmação de e-mail obrigatória via Supabase.
* **Segurança de Dados:** Implementação rigorosa de variáveis de ambiente para proteção de chaves de API.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React.js com TypeScript (Vite).
* **Estilização:** Tailwind CSS.
* **Backend & Base de Dados:** Supabase (PostgreSQL).
* **Gráficos:** Recharts.
* **Versionamento:** Git & GitHub.

---

## 📖 Passo a Passo da Construção

### 1. Configuração do Ambiente e Segurança
A primeira grande preocupação foi a segurança das chaves do Supabase. Criámos um ficheiro `.env` para armazenar a `VITE_SUPABASE_URL` e a `VITE_SUPABASE_ANON_KEY`.
* **GitIgnore:** Configurei o `.gitignore` manualmente para garantir que ficheiros sensíveis e a pasta `node_modules` nunca fossem expostos publicamente.

### 2. Base de Dados e Autenticação
Configurei o Supabase para gerir os utilizadores:
* **Confirmação de E-mail:** Ativei a obrigatoriedade de confirmação de e-mail para acesso ao dashboard.
* **Templates de E-mail:** Personalizei a mensagem de boas-vindas e o link de confirmação (corrigindo o redirecionamento de `localhost` para o domínio real).
* **Políticas de Segurança (RLS):** Garanti que cada utilizador só consegue ver os seus próprios dados financeiros.

### 3. Desenvolvimento do Dashboard
Criei uma interface intuitiva onde:
* O utilizador insere os dados e o gráfico de **Evolução do Património** atualiza-se automaticamente.
* O gráfico de **Categorias** ajuda a identificar para onde está a ir o dinheiro (Essencial, Lazer, Investimentos).

### 4. Publicação e Versionamento
Utilizei o **GitHub Desktop** para subir o código de forma segura:
* **Repositório:** Criado como Público com Licença **MIT**.
* **Verificação:** Confirmei na aba "Changes" que o `.env` estava devidamente ignorado antes do primeiro *Commit*.

---

**Desenvolvido por Matheus Levy**
