import { supabase } from './supabaseClient.js'

async function carregarUsuarios() {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, e-mail, nome, função')

  if (error) {
    console.error('Erro ao buscar usuários:', error)
    return
  }

  // Exibindo na tela
  const lista = document.getElementById('listaUsuarios')
  lista.innerHTML = ''

  data.forEach(usuario => {
    const item = document.createElement('li')
    item.textContent = `${usuario.nome} - ${usuario['e-mail']} - ${usuario.função}`
    lista.appendChild(item)
  })
}

carregarUsuarios()
