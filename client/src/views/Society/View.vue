<script>
    import axios from 'axios'
    import { utilsMixin } from '../../mixins/utilsMixin'
    import {NH1, NDivider} from 'naive-ui'

    export default {
        mixins: [utilsMixin],
        data(){
            return {
                apiUrl : process.env.API_SETTINGS.url,
                societyRoute : process.env.API_SETTINGS.routes.society,
                googleMapKey : process.env.GOOGLE_MAP.key,
                society:{},
                headquarter:{}
            }
        },
        mounted(){
            this.getSocietyData(this.$route.params.siren);
        },
        methods:{
            getSocietyData(societySiren){
                axios.get(`${this.apiUrl}/${this.societyRoute}/${societySiren}`)
                .then((response) => {
                        this.society = response.data.results.society;
                        this.headquarter = response.data.results.society.headquarter;
                    })
                .catch((error) => {
                        if(error.response){
                            if(error.response.status == 404){
                                alert(error.response.data.message);
                            }
                        }
                    })
            }
        },
        components: {
            NH1,
            NDivider
        }
    }
</script>


<template>
     <n-h1> {{ this.society.socialName }} </n-h1>

    <img src="https://picsum.photos/1000/300" style="margin-bottom:50px">

    <div style="text-align: center;">
        <n-divider title-placement="center">
            Nom complet
        </n-divider>
        {{ this.society.name }}
        <n-divider title-placement="center">
            Siren
        </n-divider>
        {{ this.society.siren }}
        <n-divider title-placement="center">
            Date de création
        </n-divider>
        {{ getFormatedDate(this.society.creationDate) }}
        <n-divider title-placement="center">
            Siège social
        </n-divider>
        
        Siret : {{ this.headquarter.siret }} 
        <br>
         {{ this.headquarter.address }}
        <br>
        {{ this.headquarter.town }}
        <br> <br><br>
        <img :src="`https://maps.googleapis.com/maps/api/staticmap?center=${this.headquarter.address},CA&zoom=16&size=2000x1000&key=${this.googleMapKey}`">
   </div>


</template>

<style>
    .n-h1{
        text-align: center;
    }

    .n-divider *{
        font-size: 1.5em!important;
    }
</style>

<style scoped>
    @media screen and (max-width: 1100px) {
        img {
            width: 100%;
        }
    }
</style>