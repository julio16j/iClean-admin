<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 colorPrimary" >
        Olá, {{usuario.nome}}
      </div>
      <q-separator />
      <div class="q-gutter-y-md">
        <div class="row q-gutter-x-md">
          <div class="col">
            <q-input label="Id Usuário" mask="##########" v-model="filtro.idUsuario" clearable />
          </div>
          <div class="col">
            <q-input label="Nome Usuário" v-model="filtro.nome" clearable />
          </div>
        </div>
        <div class="row q-gutter-x-md items-end">
          <div class="col">
            <q-input label="Data da Limpeza" type="date" stack-label v-model="filtro.dataLimpeza" clearable />
          </div>
          <div class="col">
            <q-select label="Frequencia" v-model="filtro.frequencia" clearable
              :options="optionsFrequencia" map-options emit-value />
          </div>
          <div class="col colorPrimary">
            <q-btn label="Pesquisar" @click="filtrarLimpezas" />
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <q-table
        :data="listaLimpezas"
        :columns="columns"
        title="Limpezas"
        class="colorPrimary"
        row-key="id"
      >
        <template v-slot:top-right>
          <div class="col q-mt-md colorPrimary">
            <q-btn label="Adicionar Limpeza" @click="navigateToCadastrarLimpeza" />
          </div>
        </template>
        <template v-slot:body-cell-data="props">
          <q-td key="data" :props="props">
            {{formatarData(props.row.dataProximaLimpeza)}}
          </q-td>
        </template>
        <template v-slot:body-cell-acoes="props">
          <q-td key="acoes" :props="props">
            <div>
              <q-btn @click="() => excluirLimpeza(props.row.id)" size="10px" icon="fas fa-trash-alt" flat >
                <q-tooltip>
                  Excluir
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<script>
import userService from '../services/userService'
import limpezaService from '../services/limpezaService'
import notificacaoMixin from '../mixins/notificacaoMixin'
import moment from 'moment'
export default {
  name: 'dashboard',
  mixins: [notificacaoMixin],
  mounted () {
    this.getUsuario()
    this.getLimpezas()
  },
  data () {
    return {
      usuario: {},
      filtro: {},
      listaLimpezas: [],
      columns: [
        { name: 'idLimpeza', label: 'Id', field: 'id', sortable: true },
        { name: 'data', label: 'Data Limpeza', field: 'dataProximaLimpeza' },
        { name: 'frequencia', label: 'Frequencia', field: 'frequencia', sortable: true },
        { name: 'nomeUsuario', label: 'Usuário', field: (row) => row.usuario.nome, sortable: true },
        { name: 'acoes', label: 'Ações' }
      ],
      optionsFrequencia: [
        { label: 'Diária', value: 'diaria' },
        { label: 'Semanal', value: 'semanal' },
        { label: 'Mensal', value: 'mensal' },
        { label: 'Sem Frequência', value: 'semFrequencia' }
      ]
    }
  },
  methods: {
    async getUsuario () {
      try {
        const id = localStorage.getItem('usuarioId')
        const response = await userService.getById(id)
        if (response.data) this.usuario = response.data
      } catch (error) {
        this.notificacaoErro(error)
      }
    },
    async getLimpezas () {
      try {
        const response = await limpezaService.listarTodos()
        this.listaLimpezas = response.data
      } catch (error) {
        this.notificacaoErro(error)
      }
    },
    async filtrarLimpezas () {
      try {
        const response = await limpezaService.listarComFiltro(this.filtro)
        this.listaLimpezas = response.data
      } catch (error) {
        this.notificacaoErro(error)
      }
    },
    async excluirLimpeza (limpezaId) {
      try {
        const response = await limpezaService.excluirLimpeza(limpezaId)
        if (response.status === 204) this.removerLimpeza(limpezaId)
      } catch (error) {
        this.notificacaoErro(error)
      }
    },
    formatarData (data) {
      return moment(data, 'YYYY-MM-DD').format('DD/MM/YYYY')
    },
    removerLimpeza (limpezaId) {
      this.listaLimpezas = this.listaLimpezas.filter(ele => ele.id !== limpezaId)
      this.notificacaoSucesso('Limpeza Excluída com Sucesso')
    },
    navigateToCadastrarLimpeza () {
      this.$router.push({ name: 'cadastrarLimpeza' })
    }
  }
}
</script>
