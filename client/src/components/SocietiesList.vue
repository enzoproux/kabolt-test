RouterLink<script>
    import axios from 'axios'
    import { utilsMixin } from '../mixins/utilsMixin'
    import {NCard, NInput, NButton, NPagination, NSpin, NH3, NText, NH1} from 'naive-ui'

    export default {
        mixins: [utilsMixin],
        data(){
            return {
                requestLimit : process.env.REQUEST_LIMIT,
                apiUrl : process.env.API_SETTINGS.url,
                societyRoute : process.env.API_SETTINGS.routes.society,
                inputValue: '',
                showSpinner: false,
                societies: [],
                rowCount: 0,
            }
        },
        mounted(){
            this.getSocieties();
        },
        methods :{
            getSocieties(page = 1){
                this.showSpinner = true;

                axios.get(`${this.apiUrl}?page=${page}`)
                    .then((response) => {
                            this.societies = response.data.results.societies;
                            this.rowCount = response.data.results.rowCount;
                        })
                    .catch((error) => {
                            console.log(error);
                        })
                    .finally(() => {
                        this.showSpinner = false;
                    });
            },
            getSocietyByName(page = 1){
                this.showSpinner = true;
              
                axios.get(`${this.apiUrl}/${this.societyRoute}?name=${this.inputValue}&page=${page}`)
                    .then((response) => {
                            this.societies = response.data.results.societies;
                            this.rowCount = response.data.results.rowCount;
                        })
                    .catch((error) => {
                            console.log(error);
                        })
                    .finally(() => {
                        this.showSpinner = false;
                    });
            },
            switchPage(page){
                if(this.inputValue == ''){
                    this.getSocietyByName(page);
                }else{
                    this.getSocieties(page);
                }
            }
        },
        components: {
            NCard,
            NInput,
            NButton,
            NPagination,
            NSpin,
            NH3,
            NText,
            NH1
        }
    }
</script>

<template>
    <div class="searchBlock">
        <div style="text-align: center;">
            <n-text strong style="margin: 0; color: white; font-size: 3rem;">
                Recherche d'entreprises
            </n-text>
            <hr>  
        </div>

        <n-input v-model:value="this.inputValue" @keyup="() => { this.inputValue === '' ? getSocieties() : getSocietyByName() }" type="text" placeholder="Nom de l'entreprise"/>
    
        <n-h3 strong v-if="this.showSpinner == false && this.societies.length == 0" style="color: white;">
            Aucune société trouvée
        </n-h3>
    </div>

    <n-spin v-if="this.showSpinner" size="large" class="spin"/>

   

    <div v-if="this.showSpinner == false && this.societies.length > 0" class="cardsContainer">
        <n-card :title="society.socialName" v-for="(society, index) in this.societies" :key="index">
            <template #cover>
                <img src="https://picsum.photos/200/200">
            </template>

            <br>
            <div>
                <n-text strong> Siren </n-text> <n-text strong> {{ society.siren }} </n-text>
            </div>
            <br>
            <div>
                <n-text strong> Création le </n-text> <n-text strong> {{ getFormatedDate(society.creationDate) }} </n-text>
            </div>

            <template #footer>
                <RouterLink :to="{name:'society', params:{siren: society.siren}}">
                    <n-button type="info" color="#2248b6" size="large">
                        Détails
                    </n-button>
                </RouterLink>               
            </template>
        </n-card>
    </div>
    
    <n-pagination v-if="this.rowCount > 0" @click="() => { Math.ceil(rowCount/requestLimit) > 1 ? switchPage(page) : '' }" v-model:page="page" :page-count="Math.ceil(rowCount/requestLimit)" size="large"/>
</template>
  
<style>
    .n-card__footer{
        padding-top: 20px!important;
    }
    
    .n-card__content div{
        width:80%; 
        display: flex; 
        flex-wrap: wrap; 
        margin: 0!important;
        justify-content: space-between;
    }

    .n-card-header{
        padding-bottom: 0!important;
        text-align: center;
    }

    .n-pagination{
        justify-content: center; 
        margin-top: 30px;
    }

    .n-h3{
       text-align: center;
    }

    .n-input{
        --n-text-color : white!important;
        --n-placeholder-color : white!important;
        width: 40%!important; 
        margin: 40px auto;
        display: block;
        background-color: transparent !important;
        border: none!important;
    }
    .n-input, .n-input:focus, .n-input:active, .n-input:hover {
        --n-border-hover: 1px solid white!important;
        --n-border-focus: 1px solid white!important;
        --n-loading-color: white!important;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px!important;
        outline-color: white!important;
        --n-caret-color: white!important;
    }

    .n-card{
        border-radius: 20px;
        max-width: 250px;
        flex-basis: 250px;
    }
    .n-card-cover img{
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }

    .n-button{
        border-radius: 5px;
    }

    .n-button *{
        font-weight: bold;
    }

    .n-card, .n-button, .n-input{
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }

    .n-pagination .n-pagination-item:not(.n-pagination-item--disabled).n-pagination-item--active {
        color:#2248b6;
        border-color: #2248b6;
    }
    .n-pagination .n-pagination-item:not(.n-pagination-item--disabled):hover {
        color:#2248b6;
    }
</style>
  
<style scoped>
    .searchBlock{
        background-color: #2248b6;
        padding: 80px 0 50px 0;
    }

    hr{
        width: 20%; 
        margin: 20px auto 50px auto;
    }

    .cardsContainer{
        display: flex; 
        flex-wrap: wrap; 
        gap: 50px; 
        justify-content: center; 
        padding: 70px 0;
    }

    @media screen and (max-width: 800px) {
        .n-input{
            width: 60%!important; 
        }
    }

    @media screen and (max-width: 525px) {
        .n-input{
            width: 90%!important; 
        }
    }
</style>