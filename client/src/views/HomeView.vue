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
      <img src="https://kabolt.io/build/images/logo-white.e45b069f.svg" width="500" alt="kaboltLogo">
      <n-h1 strong style="color:white; margin: 0;">
        Recherche des entreprises basées à Lyon 
      </n-h1>
      <hr style="width: 60%; margin: 50px auto 0 auto;">  
    </div>

    <SocietiesList />
  </main>
</template>
