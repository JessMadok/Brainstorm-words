async function getResponse(search) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`);
    const myWord = await response.json();
    if (myWord.title == "No Definitions Found"){
        location.href = 'not_found.html';
        return 0;
    }
    return myWord;
}

function extractWords(data){
    let indice = 1;
    const output = [];
    data.forEach(element => {
        element.meanings.forEach(element =>{
            element.synonyms.forEach(element => {
                output.push({id:indice, label:element})
                indice++;
            })
        });
    });
    return output;
}

async function main() {


    const params = new URLSearchParams(window.location.search);
    const search = params.get("word");

    const myList = await getResponse(search);
    const words = extractWords(myList);
    const base = {id:0,label:search};

    // create an array with nodes
    const nodes = new vis.DataSet([
        base,...words
    ]);

    const myEdges = []
    words.forEach(element =>{
        myEdges.push({
            from:0, to:element.id
        })
    });
    const edges = new vis.DataSet(myEdges);

    // create a network
    const container = document.getElementById("mynetwork");
    const data = {
        nodes: nodes,
        edges: edges,
    };
    const options = {};
    const network = new vis.Network(container, data, options);
}

main();