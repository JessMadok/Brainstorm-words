async function getResponse(search) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${search}`);
    const myWord = await response.json();
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
    console.log("AQUI");


    const params = new URLSearchParams(window.location.search);
    console.log(params.get("word"));
    const search = params.get("word");

    const myList = await getResponse(search);
    // console.log(extractWords(myList));
    const words = extractWords(myList);
    const base = {id:0,label:search};

    // create an array with nodes
    const nodes = new vis.DataSet([
        base,...words
    ]);

    // create an array with edges
    // const edges = new vis.DataSet([
    //     { from: 1, to: 3 },
    //     { from: 1, to: 2 },
    //     { from: 2, to: 4 },
    //     { from: 2, to: 5 },
    //     { from: 3, to: 3 },
    // ]);
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

main()