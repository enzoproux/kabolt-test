import moment from 'moment'

export const utilsMixin = {
    methods: {
        getFormatedDate(date) {
            return moment(date).format('DD/MM/YYYY');
        }
    }
}