/**
 * Created by wm.liu on 2018/1/7.
 */
let express = require('express');
let app = express();
let fs = require('fs');
let Handlebars = require('handlebars');
let tpl = fs.createReadStream('./tpl.hbs');

app.listen(3001,function () {
    console.log('server start');
    const stream = fs.createWriteStream(`./${Math.random()}.html`);
    stream.on('open', function () {
        console.log('write start');
        fs.readFile('./tpl.hbs',(err,data)=>{
            if (err) throw err;
            let text = data.toString('utf-8');
            let template = Handlebars.compile(text);
            let html = template({js:['//sss.js']});
            stream.write(html);
            stream.end();
        });

    });
    stream.on('finish', function (err,data,cbk) {
        console.log('write end');
    });
    stream.on('error', function (e) {
        console.log(e);
    });
});
app.get('/index', function (req, res, next) {

    next();
});

fs.open("test.txt","w",0644,function(e,fd){
    if(e) throw e;
    fs.write(fd,"first fs!",0,'utf8',function(e){
        if(e) throw e;
        fs.closeSync(fd);
    })
});

var Git = require("nodegit");
var repository,remote;

var signature = Git.Signature.create("masoncat",
    "masoncat@github.com", 123456789, 60);

Git.Repository.open('./.git')
    .then(function (repo) {
        console.log(repo);
        repository = repo;
        return repo.refreshIndex();
    })
    .then(function (index) {
        return index.addByPath('0.693526740235348.html')
            .then(function () {
                return index.write();
            })
            .then(function () {
                return index.writeTree();
            })
    })
    .then(function (oid) {
        console.log(oid);
        return repository.createCommit('HEAD',signature,signature,'test add file',oid);
    })
    .then(function () {
        return Git.Remote.create(repository,"origin",'git@github.com:masoncat/node-learn.git')
            .then(function (remoteRes) {
                remote = remoteRes;
                return remote.push(
                    ["refs/heads/master:refs/heads/master"],
                    {
                        callbacks: {
                            credentials: function(url, userName) {
                                return Git.Cred.sshKeyFromAgent(userName);
                            }
                        }
                    }
                );
            });
    })
    .done(function () {
        console.log('Done!')
    });

// // Clone a given repository into the `./tmp` folder.
// Git.Clone("https://github.com/nodegit/nodegit", "./tmp")
// // Look up this known commit.
//     .then(function(repo) {
//         // Use a known commit sha from this repository.
//         return repo.getCommit("59b20b8d5c6ff8d09518454d4dd8b7b30f095ab5");
//     })
//     // Look up a specific file within that commit.
//     .then(function(commit) {
//         return commit.getEntry("README.md");
//     })
//     // Get the blob contents from the file.
//     .then(function(entry) {
//         // Patch the blob to contain a reference to the entry.
//         return entry.getBlob().then(function(blob) {
//             blob.entry = entry;
//             return blob;
//         });
//     })
//     // Display information about the blob.
//     .then(function(blob) {
//         // Show the path, sha, and filesize in bytes.
//         console.log(blob.entry.path() + blob.entry.sha() + blob.rawsize() + "b");
//
//         // Show a spacer.
//         console.log(Array(72).join("=") + "\n\n");
//
//         // Show the entire file.
//         console.log(String(blob));
//     })
//     .catch(function(err) { console.log(err); });
var getMostRecentCommit = function(repository) {
    return repository.getBranchCommit("master");
};

var getCommitMessage = function(commit) {
    return commit.message();
};

