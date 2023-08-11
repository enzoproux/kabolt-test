RouterLink<script>
    import axios from 'axios'
    import {NCard, NInput, NButton, NPagination} from 'naive-ui'

    export default {
        name: 'societies',
        data(){
            return {
                inputValue: '',
                societies: [],
            }
        },
        mounted(){
            this.getSocieties();
        },
        methods :{
            getSocieties(){
                axios.get('http://localhost:3000/society')
                  .then((response) => {
                        this.societies = response.data;
                    })
                  .catch((error) => {
                        console.log(error);
                    });
            },
            getSocietyByName(){
                axios.get(`http://localhost:3000/society/${this.inputValue}`)
                  .then((response) => {
                        this.societies = response.data;
                    })
                  .catch((error) => {
                        if(error.response){
                            if(error.response.status == 404){
                                alert(error.response.data.message);
                            }
                        }
                    });
            }
        },
        components: {
            NCard,
            NInput,
            NButton,
            NPagination
        }
    }
</script>

<template>
    <n-input v-model:value="this.inputValue" @keyup="() => { this.inputValue === '' ? getSocieties() : getSocietyByName() }" type="text" placeholder="Nom de l'entreprise" style="width: 40%; margin: 40px auto; display: block;"/>
    <div style="display: flex; flex-wrap: wrap;">
        <n-card title="Card with Cover" style="flex:1; margin: 10px;" v-for="(society, index) in this.societies" :key="index">
            <template #cover>
            <img src="https://picsum.photos/200">
            </template>

            {{ society.siren }}
            {{ society.nom_complet }}
            {{ society.date_creation }}

            <template #footer>
                <RouterLink :to="{name:'society', params:{siren: society.siren}}">
                    <n-button type="info" color="#2248b6">
                        Détails
                    </n-button>
                </RouterLink>               
            </template>
        </n-card>
    </div>

    <n-pagination v-model:page="page" :page-count="2" style="justify-content: center; margin-top: 30px;"/>
</template>
  
<style scoped>
</style>
  