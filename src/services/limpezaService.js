import api from './api'
export default {
  listarTodos () {
    return api.get('limpeza')
  },
  excluirLimpeza (limpezaId) {
    return api.delete('limpeza/' + limpezaId)
  },
  cadastrar (novaLimpezaDTO) {
    return api.post('limpeza', novaLimpezaDTO)
  },
  listarComFiltro (filtro) {
    return api.post('limpeza/filtrar', filtro)
  }
}
