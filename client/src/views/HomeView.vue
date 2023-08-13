<script>
  import SocietiesList from '../components/SocietiesList.vue'
  import {NH1} from 'naive-ui'

  export default {
    components: {
      SocietiesList,
      NH1
    }
  }
</script>

<template>
  <main>

    <div style="text-align: center;">
      <n-h1 strong style="margin: 0;">
        Recherche d'entreprises
      </n-h1>
      <hr>  
    </div>

    <SocietiesList />
  </main>
</template>

<style scoped>
  hr{
    width: 20%; 
    margin: 20px auto 50px auto;
  }
</style>
