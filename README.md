# polynym
A simple library and API that accepts any [HandCash](https://handcash.io) `$handle`, [RelayX](https://relayx.io) `1handle` or PayMail address and resolves it to a Bitcoin SV P2PKH address, as well as accepting and returning valid P2PKH addresses. You can also use it as a lookup service on [polynym.io](https://polynym.io) or consume it as a free API over at `https://api.polynym.io/<address or handle>` in any of your projects.

## usage

To get started, run `npm install polynym` in your root directory. Here's an simple example implementation in Node.js:

```
const express = require('express'),
app = express(),
polynym = require('polynym');

app.get('/:id', (req, res) => {
    polynym(req.params.id).then(x => {
        res.json(x);
    }).catch(e=>{
        res.status(400).json(e);
    });
});

app.listen(1337);
```

or using the await/async syntax:

```
const express = require('express'),
app = express(),
polynym = require('polynym');

app.get('/:id', async (req, res) => {
    try {
      x = await polynym(req.params.id);
      res.json(x);
    } catch(e){
      res.status(400).json(e);
    }
});

app.listen(1337);
```

In the above example, a GET request to `http://localhost:1337/$unwriter` would return the Bicoin SV address of unwriter's HandCash $handle: `{"address":"15EwahT55Yn566A7tagq5Mbyhs8txjZpus"}`

## support

To request support for any additional services, please leave a feature request. For all other questions or support, please message me [@deanmlittle](https://twitter.com/deanmlittle) or find me in the Atlantis slack group.
