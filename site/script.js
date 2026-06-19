const API_URL = 'https://crisom-musicc.onrender.com/api';
 
async function carregarMusicas() {
  const grid = document.getElementById('musicas-grid');
  try {
    const res = await fetch(`${API_URL}/musicas`);
    const musicas = await res.json();
 
    grid.innerHTML = '';
    musicas.forEach(m => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${m.thumb}" alt="${m.titulo}" class="thumb">
        <h3>${m.titulo}</h3>
        <p>${m.duracao}</p>
        <audio controls src="${m.arquivo}"></audio>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = '<p class="loading">Erro ao carregar músicas. A API está rodando?</p>';
  }
}
 
async function carregarShows() {
  const grid = document.getElementById('shows-grid');
  try {
    const res = await fetch(`${API_URL}/shows`);
    const shows = await res.json();
 
    grid.innerHTML = '';
    shows.forEach(s => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h3>${s.local}</h3><p>${s.data}</p>`;
      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = '<p class="loading">Erro ao carregar shows. A API está rodando?</p>';
  }
}
 
async function carregarComentarios() {
  const lista = document.getElementById('lista-comentarios');
  try {
    const res = await fetch(`${API_URL}/comentarios`);
    const comentarios = await res.json();
 
    lista.innerHTML = '';
    if (comentarios.length === 0) {
      lista.innerHTML = '<p class="loading">Nenhum comentário ainda. Seja o primeiro!</p>';
      return;
    }
    comentarios.forEach(c => {
      const item = document.createElement('div');
      item.className = 'comment-item';
      item.innerHTML = `<strong>${c.nome}</strong><p>${c.mensagem}</p>`;
      lista.appendChild(item);
    });
  } catch (err) {
    lista.innerHTML = '<p class="loading">Erro ao carregar comentários.</p>';
  }
}

document.getElementById('form-comentario').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('com-nome').value;
  const mensagem = document.getElementById('com-mensagem').value;
  const status = document.getElementById('comentario-status');
 
  try {
    const res = await fetch(`${API_URL}/comentarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, mensagem })
    });
    if (!res.ok) throw new Error();
 
    status.textContent = 'Comentário enviado!';
    status.className = 'status-msg success';
    document.getElementById('form-comentario').reset();
    carregarComentarios();
  } catch (err) {
    status.textContent = 'Erro ao enviar comentário.';
    status.className = 'status-msg error';
  }
});
 
document.getElementById('form-contato').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('contato-nome').value;
  const email = document.getElementById('contato-email').value;
  const mensagem = document.getElementById('contato-mensagem').value;
  const status = document.getElementById('contato-status');
 
  try {
    const res = await fetch(`${API_URL}/contato`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, mensagem })
    });
    if (!res.ok) throw new Error();
 
    status.textContent = 'Mensagem enviada com sucesso!';
    status.className = 'status-msg success';
    document.getElementById('form-contato').reset();
  } catch (err) {
    status.textContent = 'Erro ao enviar mensagem.';
    status.className = 'status-msg error';
  }
});
 
carregarMusicas();
carregarShows();
carregarComentarios();