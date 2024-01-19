const { Client } = require("pg")

const pool = new Client({
    user: "postgres",
    host: "viaduct.proxy.rlwy.net",
    database: "railway",
    password: "f26B1GaaDeAGFgCDCdg*4B6331B44gBe",
    port: 29455
})
// const pool = new Client({
//     user: "uzdubuz_id_rsa",
//     host: "clocalhost",
//     database: "uzdubuz_test",
//     password: "o$n;y)_HLGwM",
//     port: 5619
// })
pool.connect(err => {
    if(err) {
        console.log("Connect Error");
    } else {
        console.log("Connect To PostgreSql");
    }
})

module.exports = pool