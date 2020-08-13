import qs from 'qs'

const parsedQueryParams: () => { [key:string]: any, } = () => qs.parse(window.location.search.replace('?', ''))

export default parsedQueryParams
