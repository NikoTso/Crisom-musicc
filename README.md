<img width="1568" height="744" alt="image" src="https://github.com/user-attachments/assets/a0f08bb7-25fc-48f9-8eee-15a47cd4021d" /># 🎸 Crimson Echo — Site de Banda com Stack Dockerizada

Site fictício de uma banda de metal, construído como exercício prático de **containerização e orquestração multi-serviço** com Docker. O projeto simula uma aplicação web real: frontend estático servido por Nginx, API REST em Node.js, e persistência em SQLite — tudo rodando em containers isolados que se comunicam via rede interna do Docker Compose.

> Projeto acadêmico (disciplina de DevOps) levado além do escopo mínimo: virou um case real de troubleshooting de ambiente, debugging cross-platform e arquitetura de containers.

---

## 🖼️ Preview

*<img width="1568" height="744" alt="image" src="https://github.com/user-attachments/assets/4fdc3ea7-cadd-4cc0-bafe-13b25b6df777" />
*

---

## 🧱 Arquitetura

```
┌─────────────────┐         ┌──────────────────┐
│   Container web  │  proxy  │  Container api    │
│   Nginx :8080    │ ──────► │  Node/Express :3000│
│   (frontend)     │  /api/* │  (backend + SQLite)│
└─────────────────┘         └──────────────────┘
                                       │
                                       ▼
                              Volume Docker (api_data)
                              persistência do banco
```

- **web** — Nginx servindo HTML/CSS/JS estáticos e atuando como **proxy reverso**, repassando todas as chamadas `/api/*` para o container da API
- **api** — Node.js + Express + `better-sqlite3`, com schema criado e populado automaticamente na primeira execução (seed idempotente)
- **Comunicação entre containers** via rede interna do Compose, usando o nome do serviço (`api`) como hostname — sem expor a API diretamente ao frontend
- **Persistência** garantida por volume Docker nomeado, sobrevivendo a rebuilds e restarts

---

## ⚙️ Stack

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (vanilla, fetch API) |
| Servidor web / proxy | Nginx (Alpine) |
| Backend | Node.js 20, Express |
| Banco de dados | SQLite (`better-sqlite3`) |
| Orquestração | Docker Compose |

---

## 🚀 Funcionalidades

- **Player de músicas** dinâmico, consumindo a lista de faixas direto do banco via API
- **Lista de próximos shows**, também dinâmica
- **Mural de comentários** com leitura e postagem (`GET`/`POST`)
- **Formulário de contato** persistido no banco
- Rota de **health check** (`/api/health`) para verificação de status do serviço

---

## ▶️ Como rodar localmente

Pré-requisito: [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.

```bash
git clone <url-do-repositorio>
cd docker-demo
docker compose up --build
```

- Site: **http://localhost:8080**
- API direta: **http://localhost:3000/api/musicas**

Para parar:
```bash
docker compose down
```

Para reconstruir do zero (limpando cache de imagem):
```bash
docker compose down
docker rmi docker-demo-web docker-demo-api
docker compose build --no-cache
docker compose up -d
```

---

## 🐛 Desafios técnicos enfrentados

Esse projeto não nasceu funcionando de primeira — e os problemas que apareceram acabaram sendo o aprendizado mais valioso do exercício:

- **Dockerfiles trocados**: o Dockerfile do frontend (Nginx) e o da API (Node) estavam invertidos entre as pastas, causando builds que pareciam corretos mas geravam containers com a imagem base errada.
- **Case-sensitivity Windows vs Linux**: arquivos como `Server.js`, `Script.js` e `Nginx.conf` funcionavam normalmente no Windows (que ignora maiúscula/minúscula), mas quebravam dentro do container Linux, que diferencia `server.js` de `Server.js`. Isso gerou erros silenciosos como `Cannot find module` e o Nginx servindo `index.html` no lugar do `script.js` esperado.
- **Cache de build do Docker** mascarando correções — depois de renomear arquivos, builds incrementais continuavam usando layers antigas, exigindo `--no-cache` e remoção manual das imagens para forçar uma reconstrução limpa.
- **Encoding de nomes de arquivo** (acentos corrompidos em `.mp3` após extração de zip), causando 404 nos players de áudio mesmo com a API funcionando perfeitamente.

Resolver isso na prática trouxe entendimento real de como ambientes de containers isolam (e expõem) diferenças entre sistemas operacionais — algo que não aparece estudando só a teoria do Docker.

---

## 📂 Estrutura do projeto

```
docker-demo/
├── Dockerfile              # imagem do frontend (Nginx)
├── docker-compose.yml      # orquestra os 2 serviços
├── api/
│   ├── Dockerfile          # imagem da API (Node)
│   ├── package.json
│   └── server.js
└── site/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── nginx.conf          # proxy reverso /api -> container api
    ├── audio/               # arquivos .mp3 das faixas
    └── imagens/             # capas das faixas
```

---

## 📌 Próximos passos

- [ ] Configurar CORS com lista de origens permitidas (atualmente fixado para um domínio único)
- [ ] Adicionar `.dockerignore` na pasta `api/` para builds mais rápidos
- [ ] Deploy de demo ao vivo (frontend na Vercel + API em Render/Railway)
- [ ] Testes automatizados das rotas da API
