const express = require('express');
const router = express.Router();
const path = require('path');
const fs= require('fs');


function findJsonFiles(directory) {

    const folders = fs.readdirSync(directory).filter(item => {
        return item.indexOf('.') == -1;
    });

    let arrayPaths = [];

    folders.map(item => {

        let filePath = path.join(directory, item, 'get.json');

        if (fs.existsSync(filePath)) {
            arrayPaths.push(filePath);
        }

    });

    return arrayPaths;
}

router.get(['/users', '/posts'], (req, res, next) => {

    let directory = path.join(__dirname, 'api', req.path);

    const arrayPaths = findJsonFiles(directory);

    let jsonContent = [];

    arrayPaths.map(item => {
        let fileContent = JSON.parse(fs.readFileSync(`${item}`));
        fileContent = fileContent[0];
        jsonContent.push(fileContent);
    });

    return res.json( jsonContent );

});

router.get(['/users/*', '/posts/*'], (req, res, next) => {

    const directory = path.join(__dirname, 'api', req.path);
    const targetFile = path.join(directory, 'get.json');

    console.log(targetFile);
    // possible to try stat
    if(!fs.existsSync(targetFile)) {
        return res.status(404).json( [{"status": "fail"}] );
    }

    const fileContent = JSON.parse(fs.readFileSync(`${targetFile}`));

    return res.json(fileContent);
});

router.delete(['/users/*', '/posts/*'], (req, res, next) => {

    const directory = path.join(__dirname, 'api', req.path);
    const file = path.join(directory, 'get.json');

    fs.stat(file, function (err) {
        if (err) {
            return res.status(404).json( [{"status": "fail"}] );
        }

        fs.unlinkSync(`${file}`);
        fs.rmdirSync(`${directory}`);

        return res.json( [{"status": "success"}] );
    });

});

router.post(['/users', '/posts'], (req, res, next) => {

    if(!(req.body && req.body[0] && (req.body[0].postId || req.body[0].id))) {
        return res.status(409).json( [{"status": "fail"}] );
    }

    const directory = path.join(__dirname, 'api', req.path);

    const requestArrayBody = req.body;
    const requestBody = requestArrayBody[0];
    const requestBodyId = requestBody.postId || requestBody.id;

    const filePath = path.join(directory, requestBodyId);

    if(!fs.existsSync(filePath)) {
        fs.mkdirSync(`${filePath}`);
        fs.writeFileSync(`${path.join(filePath, 'get.json')}`, JSON.stringify(requestBody));
        return res.json( [{"status": "success"}] );
    } else {
        return res.status(409).json( [{"status": "fail"}] );
    }

});


router.put('/:directoryFolder/:requestFolder', (req, res, next) => {
    if (!(req.body && req.body[0] && (req.body[0].postId || req.body[0].id))) {
        return res.status(409).json( [{"status": "fail"}] );
    }

    const requestPath = path.join(__dirname, 'api', req.path);

    const requestArrayBody = req.body;
    const requestBody = requestArrayBody[0];
    const requestFolder = req.params.requestFolder;
    const directoryFolder = req.params.directoryFolder;
    const requestBodyId = requestBody.postId || requestBody.id;

    if (fs.existsSync(requestPath) && (requestBodyId === requestFolder)) {

        fs.writeFileSync(`${path.join(requestPath, 'get.json')}`, JSON.stringify(requestBody));

        return res.json( [{"status": "success"}] );
    } else {
        return res.status(409).json( [{"status": "fail"}] );
    }

});

module.exports = router;
