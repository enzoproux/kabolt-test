<script>
    import axios from 'axios'

    export default {
        name: 'societies',
        data(){
            return {
                model:{
                    society:{
                        siren: '',
                        name: '',
                        dateCrea: '',
                        adresse: '',
                        codePostal: '',
                        commune: '',
                    }
                }
            }
        },
        mounted(){
            this.getSocietyData(this.$route.params.siren);
        },
        methods:{
            getSocietyData(societySiren){
                axios.get(`http://localhost:3000/societies/${societySiren}`)
            }
        }
    }
</script>


<template>
</template>