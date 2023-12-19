const axios = require('axios')
const links = 'https://dichvublack.vn/api/?key=0T4nYItxtdDfJMYL&host=[host]&port=[port]&time=[time]&method=[method]&vip=0';
ip = '192.168.1.1'
port = '22'
time = '60'
method = 'https'

    const apiUrl = links.replace('[host]', ip).replace('[port]', port).replace('[time]', time).replace('[method]', method);
    console.log(apiUrl)
