let franc = require('franc');
let langs = require('langs');

let userInput = process.argv[2];

let langCode = franc(userInput);
let langName = langs.where(3, langCode);
if(langName){
    console.log(langName.name);
} else {
    console.log("Could not find a language match, please try again with a larger sample")
}

