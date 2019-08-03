const axios = require('axios');

function resolveType(id){
    const types = [{
        name: 'HandCash',
        regex: new RegExp(/^[$][\a-zA-Z0-9\-_.]{4,50}$/)
    },
    {
        name: 'P2PKH',
        regex: new RegExp(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/)
    },
    {
        name: 'RelayX',
        regex: new RegExp(/^[1][\a-zA-Z0-9]*$/)
    },
    {
        name: 'PayMail',
        regex: new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
    }];
    for(let type of types) {
        if(id.match(type.regex)){
            return type.name;
        }
    };
    return 'invalid';
}

//RelayX
async function callRelayX(id) {
    id = id.toLowerCase();
    return axios.get('https://www.relayx.io/api/receivingAddress/' + id);
}

//HandCash
async function callHandCash(id) {
    id = id.toLowerCase();
    id = id.replace('$','');
    return axios.get('https://api.handcash.io/api/receivingAddress/' + id);
}

//PayMail
async function callPayMail(id) {
    return axios.get('https://api.polynym.io/getAddress/' + id);
}

module.exports = {
    resolveAddress: async function(id){
        return new Promise(async(resolve, reject) => {
            const type = resolveType(id);
            if(type=='P2PKH'){
                resolve({address: id});
            } else if(type=='HandCash'){
                try { 
                    let x = await callHandCash(id);
                    resolve({address: x.data.receivingAddress});
                } catch(e){
                    reject({ error: '$handle not found' });
                }
            } else if(type=='RelayX'){
                try { 
                    let x = await callRelayX(id);
                    if(x.data.receivingAddress){
                        resolve({address: x.data.receivingAddress});
                    } else {
                        reject({ error: '1handle not found' });
                    }
                } catch(e){
                    reject(e)
                }
            } else if(type=='PayMail'){
                try {
                    let x = await callPayMail(id);
                    resolve({address: x.data.address});
                } catch(e){
                    reject({ error: 'PayMail not found' });
                }
            } else {
                reject({ error: 'Unable to resolve to address' });
            }    
        });
    }
};
