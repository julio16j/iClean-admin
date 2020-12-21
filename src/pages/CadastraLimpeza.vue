<template>
  <q-page class="flex flex-center">
    <q-card style="width: 500px">
      <q-card-section>
        <div class="row justify-center q-mb-md text-h4 colorPrimary">
          Cadastrar Limpeza
        </div>
        <div class="row justify-center text-subtitle1 colorPrimary">
          Informe os dados da nova Limpeza
        </div>
        <q-form @submit="cadastrar" style="display: flex; justify-content: center" >
          <div style="width: 80%">
            <div>
              <q-input label="Data" type="date" stack-label v-model="form.dataProximaLimpeza"
                :rules="[ val => val && val.length > 0 || '']" />
            </div>
            <div>
              <q-select label="Frequencia" v-model="form.frequencia"
                :options="optionsFrequencia" map-options emit-value
                :rules="[ val => val && val.length > 0 || '']" />
            </div>
            <div>
              <q-select label="Usuario" v-model="form.usuarioId"
                :options="optionsUsuario" :option-label="'nome'" :option-value="'id'" emit-value map-options
                :rules="[ val => val || '']" />
            </div>
            <div class="q-mt-md row justify-between">
              <div class="col colorPrimary">
                <q-btn @click="navigateBack" label="Cancelar" />
              </div>
              <div class="col flex justify-end">
                <q-btn type="submit" label="Confirmar" color="primary" />
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import userService from '../services/userService'
import notificacaoMixin from '../mixins/notificacaoMixin'
import limpezaService from 'src/services/limpezaService'
export default {
  name: 'CadastraLimpeza',
  mixins: [notificacaoMixin],
  mounted () {
    this.obterOptionsUsuario()
  },
  data () {
    return {
      form: {
        dataProximaLimpeza: null,
        frequencia: null,
        usuarioId: null
      },
      optionsFrequencia: [
        { label: 'Diária', value: 'diaria' },
        { label: 'Semanal', value: 'semanal' },
        { label: 'Mensal', value: 'mensal' },
        { label: 'Sem Frequência', value: 'semFrequencia' }
      ],
      optionsUsuario: []
    }
  },
  methods: {
    navigateBack () {
      this.$router.back()
    },
    navigateToDashBoard () {
      this.$router.push({ name: 'dashboard' })
    },
    async obterOptionsUsuario () {
      try {
        const response = await userService.getUsuarioDisponiveis()
        this.optionsUsuario = response.data
      } catch (error) {
        this.notificacaoErro(error.message + '')
      }
    },
    async cadastrar () {
      try {
        const response = await limpezaService.cadastrar(this.form)
        if (response.data) {
          this.notificacaoSucesso('Limpeza Registrada com Sucesso')
          this.navigateToDashBoard()
        }
      } catch (error) {
        this.notificacaoErro(error.data + '')
      }
    }
  }
}
</script>
