function resetHighlight() {
  nodeUpdateArray = [];
  for (let nodeId in allNodes) {
    allNodes[nodeId].color = nodeColors[nodeId];
    if (allNodes[nodeId].hiddenLabel !== undefined) {
      allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
      allNodes[nodeId].hiddenLabel = undefined;
    }
    nodeUpdateArray.push(allNodes[nodeId])
  }
  nodes.update(nodeUpdateArray);

  edgeUpdateArray = [];
  for (let edgeId in allEdges) {
    allEdges[edgeId].color = edgeColors[edgeId];
    edgeUpdateArray.push(allEdges[edgeId])
  }
  edges.update(edgeUpdateArray);

  highlightName.innerText = '';
  highlightTag.innerText = '';
  highlightNer.style.setProperty("border", "0px");
  highlightNerTitle.innerText = "";

  highlightTextTitle.innerText = '';
  highlightText.innerText = '';
  highlightText.style.setProperty("border", "0px");
  nodeControl.clear();
}

function changeNetworkVersion(versionNum) {
  //recover current network
  resetHighlight();
  //change network
  if (versionNum === "V1") {
    network.setData({
      nodes: nodes1,
      edges: edges1,
    });
    nodes = nodes1;
    edges = edges1;
    nodeColors = nodeColors1;
    edgeColors = edgeColors1;
    nodesOptions = nodesOptions1;
  } else if (versionNum === "V2") {
    network.setData({
      nodes: nodes2,
      edges: edges2,
    });
    nodes = nodes2;
    edges = edges2;
    nodeColors = nodeColors2;
    edgeColors = edgeColors2;
    nodesOptions = nodesOptions2;
  } else if (versionNum === "V3") {
    network.setData({
      nodes: nodes3,
      edges: edges3,
    });
    nodes = nodes3;
    edges = edges3;
    nodeColors = nodeColors3;
    edgeColors = edgeColors3;
    nodesOptions = nodesOptions3;
  } else if (versionNum === "V4") {
    network.setData({
      nodes: nodes4,
      edges: edges4,
    });
    nodes = nodes4;
    edges = edges4;
    nodeColors = nodeColors4;
    edgeColors = edgeColors4;
    nodesOptions = nodesOptions4;
  }
  nodeControl.clear();
  nodeControl.clearOptions();
  for (let optionId in nodesOptions) {
    nodeControl.addOption(nodesOptions[optionId])
  };

  allNodes = nodes.get({ returnType: "Object" });
  allEdges = edges.get({ returnType: "Object" });
  let edgeUpdateArray = [];
  for (let edgeId in allEdges) {

    if (isEdgelabel && allEdges[edgeId].hasOwnProperty('relation') && allEdges[edgeId].relation.length < edgeLabelSize) {
      allEdges[edgeId].label = allEdges[edgeId].relation;
      allEdges[edgeId].label_ori = allEdges[edgeId].relation;
    };

    if (allEdges[edgeId].edge_type === "news2news" && allEdges[edgeId].hasOwnProperty('sim') && allEdges[edgeId].sim > newsSimThreshold) {
      allEdges[edgeId].hidden = false;
    } else if (allEdges[edgeId].edge_type === "news2news" && allEdges[edgeId].hasOwnProperty('sim') && allEdges[edgeId].sim <= newsSimThreshold) {
      allEdges[edgeId].hidden = true;
    };
    if (allEdges[edgeId].edge_type === "entity2entity" && allEdges[edgeId].hasOwnProperty('sim') && allEdges[edgeId].sim > entitySimThreshold) {
      allEdges[edgeId].hidden = false;
    } else if (allEdges[edgeId].edge_type === "entity2entity" && allEdges[edgeId].hasOwnProperty('sim') && allEdges[edgeId].sim <= entitySimThreshold) {
      allEdges[edgeId].hidden = true;
    };
    edgeUpdateArray.push(allEdges[edgeId])
  }
  edges.update(edgeUpdateArray)
}

function neighbourhoodHighlight(params) {
  // console.log("in nieghbourhoodhighlight");
  allNodes = nodes.get({ returnType: "Object" });
  allEdges = edges.get({ returnType: "Object" });
  // originalNodes = JSON.parse(JSON.stringify(allNodes));
  // if something is selected:
  if (params.nodes.length > 0) {
    // highlightActive = true;
    // var i, j;
    var selectedNode = params.nodes[0];
    if (allNodes[selectedNode].hasOwnProperty('summary')) {
      highlightText.innerText = nodes.get(selectedNode)['summary'];
      highlightTextTitle.innerText = 'Summary:';
      highlightText.style.setProperty("border", "1px solid black")
    } else if (allNodes[selectedNode].hasOwnProperty('label')) {
      if (nodes.get(selectedNode)['label']) {
        highlightText.innerText = nodes.get(selectedNode)['label'];
      } else {
        highlightText.innerText = nodes.get(selectedNode)['hiddenLabel'];
      }
      highlightTextTitle.innerText = 'Label:';
      highlightText.style.setProperty("border", "1px solid black")
    }
    else {
      highlightTextTitle.innerText = '';
      highlightText.innerText = '';
      highlightText.style.setProperty("border", "0px")
    }
    if (allNodes[selectedNode].hasOwnProperty('name')) {
      highlightName.innerText = nodes.get(selectedNode)['name'];
      highlightTag.innerText = nodes.get(selectedNode)['tag'];
      highlightNerTitle.innerText = "Name Entity list:";
      highlightNer.style.setProperty("border", "1px solid black");
    } else {
      highlightName.innerText = '';
      highlightTag.innerText = '';
      highlightNer.style.setProperty("border", "0px");
      highlightNerTitle.innerText = "";
    }

    if (!isAttrExpanded) {
      var target = params.target;
      var toggleSwitch = document.querySelector('#auto-toggle-switch');
      if (!toggleSwitch.contains(target)) {
        var checkbox = toggleSwitch.querySelector('input[type="checkbox"]');
        checkbox.checked = !checkbox.checked;
      }
      mynetwork.style.width = '80%';
      highlightAttr.style.width = '20%';
      highlightAttr.style.overflow = 'scroll';
      isAttrExpanded = !isAttrExpanded;
    }

    // var degrees = 0;
    var edgeUpdateArray = [];

    // mark all nodes as hard to read.
    for (let nodeId in allNodes) {
      // nodeColors[nodeId] = allNodes[nodeId].color;
      allNodes[nodeId].color = "rgba(200,200,200,0.5)";
      if (allNodes[nodeId].hiddenLabel === undefined) {
        allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
        allNodes[nodeId].label = undefined;
      }
    }
    var connectedFromEdges = network.getConnectedEdges(selectedNode, "from");
    var connectedToEdges = network.getConnectedEdges(selectedNode, "to");
    var connectedEdges = connectedFromEdges.concat(connectedToEdges);
    // var allConnectedNodes = [];

    edgeUpdateArray = [];
    // mark all edges as hard to read. # Laurence
    for (let edgeId in allEdges) {
      if (!connectedEdges.includes(edgeId)) {
        // nodeColors[nodeId] = allNodes[nodeId].color;
        allEdges[edgeId].color = "rgba(200,200,200,0.5)";
      } else {
        allEdges[edgeId].color = edgeColors[edgeId];
      }
      edgeUpdateArray.push(allEdges[edgeId])
    }
    edges.update(edgeUpdateArray);

    // the main node gets its own color and its label back.
    // allNodes[selectedNode].color = undefined;
    allNodes[selectedNode].color = nodeColors[selectedNode];
    if (allNodes[selectedNode].hiddenLabel !== undefined) {
      allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
      allNodes[selectedNode].hiddenLabel = undefined;
    }
  } else { //if (highlightActive === true) 
    // console.log("highlightActive was true");
    // reset all nodes
    resetHighlight();
    // highlightActive = false;
  }

  // transform the object into an array
  var updateArray = [];
  if (params.nodes.length > 0) {
    for (let nodeId in allNodes) {
      if (allNodes.hasOwnProperty(nodeId)) {
        // console.log(allNodes[nodeId]);
        updateArray.push(allNodes[nodeId]);
      }
    }
    nodes.update(updateArray);
  } else {
    for (let nodeId in allNodes) {
      if (allNodes.hasOwnProperty(nodeId)) {
        // allNodes[nodeId].color = {};
        updateArray.push(allNodes[nodeId]);
      }
    }
    nodes.update(updateArray);

  }
}

///////
function edgeNeighbourhoodHighlight(params) {
  // console.log("in nieghbourhoodhighlight");
  allNodes = nodes.get({ returnType: "Object" });
  allEdges = edges.get({ returnType: "Object" });
  if (params.nodes.length > 0) {
    return
  }
  // originalNodes = JSON.parse(JSON.stringify(allNodes));
  // if something is selected:
  if (params.edges.length > 0) {
    // highlightActive = true;
    var selectedEdge = params.edges[0];
    var connectedNodes = network.getConnectedNodes(selectedEdge);
    connectedNodes = connectedNodes.map(num => num.toString());
    // mark all nodes as hard to read.
    for (let nodeId in allNodes) {
      if (!connectedNodes.includes(nodeId)) {
        // nodeColors[nodeId] = allNodes[nodeId].color;
        allNodes[nodeId].color = "rgba(200,200,200,0.5)";
        if (allNodes[nodeId].hiddenLabel === undefined) {
          allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
          allNodes[nodeId].label = undefined;
        }
      } else {
        allNodes[nodeId].color = nodeColors[nodeId];
        if (allNodes[nodeId].hiddenLabel !== undefined) {
          allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
          allNodes[nodeId].hiddenLabel = undefined;
        }
      }
    }
    var edgeUpdateArray = [];
    // mark all edges as hard to read. # Laurence
    for (let edgeId in allEdges) {
      if (edgeId !== selectedEdge) {
        // nodeColors[nodeId] = allNodes[nodeId].color;
        allEdges[edgeId].color = "rgba(200,200,200,0.5)";
        if (allEdges[edgeId].hiddenLabel === undefined) {
          allEdges[edgeId].hiddenLabel = allEdges[edgeId].label;
          allEdges[edgeId].label = undefined;
        }
      } else {
        allEdges[edgeId].color = edgeColors[edgeId];
        if (allEdges[edgeId].hiddenLabel !== undefined) {
          allEdges[edgeId].label = allEdges[edgeId].hiddenLabel;
          allEdges[edgeId].hiddenLabel = undefined;
        }
      }
      edgeUpdateArray.push(allEdges[edgeId])
    }
    edges.update(edgeUpdateArray);
  } else {
    resetHighlight();
  }

  // transform the object into an array
  var updateArray = [];
  if (params.edges.length > 0) {
    for (let nodeId in allNodes) {
      if (allNodes.hasOwnProperty(nodeId)) {
        // console.log(allNodes[nodeId]);
        updateArray.push(allNodes[nodeId]);
      }
    }
    nodes.update(updateArray);

  } else {
    // console.log("Nothing was selected");
    for (let nodeId in allNodes) {
      if (allNodes.hasOwnProperty(nodeId)) {
        // console.log(allNodes[nodeId]);
        // allNodes[nodeId].color = {};
        updateArray.push(allNodes[nodeId]);
      }
    }
    nodes.update(updateArray);
  }
}

function filterHighlight(params) {
  allNodes = nodes.get({ returnType: "Object" });
  // if something is selected:
  if (params.nodes.length > 0) {
    filterActive = true;
    let selectedNodes = params.nodes;

    // hiding all nodes and saving the label
    for (let nodeId in allNodes) {
      allNodes[nodeId].hidden = true;
      if (allNodes[nodeId].savedLabel === undefined) {
        allNodes[nodeId].savedLabel = allNodes[nodeId].label;
        allNodes[nodeId].label = undefined;
      }
    }

    for (let i = 0; i < selectedNodes.length; i++) {
      allNodes[selectedNodes[i]].hidden = false;
      if (allNodes[selectedNodes[i]].savedLabel !== undefined) {
        allNodes[selectedNodes[i]].label = allNodes[selectedNodes[i]].savedLabel;
        allNodes[selectedNodes[i]].savedLabel = undefined;
      }
    }

  } else if (filterActive === true) {
    // reset all nodes
    for (let nodeId in allNodes) {
      allNodes[nodeId].hidden = false;
      if (allNodes[nodeId].savedLabel !== undefined) {
        allNodes[nodeId].label = allNodes[nodeId].savedLabel;
        allNodes[nodeId].savedLabel = undefined;
      }
    }
    filterActive = false;
  }

  // transform the object into an array
  var updateArray = [];
  if (params.nodes.length > 0) {
    for (let nodeId in allNodes) {
      if (allNodes.hasOwnProperty(nodeId)) {
        updateArray.push(allNodes[nodeId]);
      }
    }
    nodes.update(updateArray);
  } else {
    for (let nodeId in allNodes) {
      if (allNodes.hasOwnProperty(nodeId)) {
        updateArray.push(allNodes[nodeId]);
      }
    }
    nodes.update(updateArray);
  }
}

function selectNode(nodes) {
  if (nodes[0] !== "") {
    network.selectNodes(nodes);
    neighbourhoodHighlight({ nodes: nodes });
    return nodes;
  }
}

function selectNodes(nodes) {
  network.selectNodes(nodes);
  filterHighlight({ nodes: nodes });
  return nodes;
}
function filterHighlightNodesEdges(params) {
  allNodes = nodes.get({ returnType: "Object" });
  allEdges = edges.get({ returnType: "Object" });
  let edgeUpdateArray = [];
  if (!params) { //&& filterActive === true
    // reset all nodes
    resetHighlight();
    filterActive = false;
  }
  // if something is selected:
  else {
    filterActive = true;
    // hiding all nodes and saving the label
    for (let nodeId in allNodes) {
      // allNodes[nodeId].hidden = true;
      allNodes[nodeId].color = "rgba(200,200,200,0.5)";
      if (allNodes[nodeId].hiddenLabel === undefined) {
        allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
        allNodes[nodeId].label = undefined;
      }
    }
    let selectedNodes = params.nodes;
    for (let i = 0; i < selectedNodes.length; i++) {
      // allNodes[selectedNodes[i]].hidden = false;
      allNodes[selectedNodes[i]].color = nodeColors[selectedNodes[i]];
      if (allNodes[selectedNodes[i]].hiddenLabel !== undefined) {
        allNodes[selectedNodes[i]].label = allNodes[selectedNodes[i]].hiddenLabel;
        allNodes[selectedNodes[i]].hiddenLabel = undefined;
      }
    }

    edgeUpdateArray = [];
    for (let edgeId in allEdges) {
      if (!params.edges.includes(edgeId)) {
        // allEdges[edgeId].hidden = true;
        allEdges[edgeId].color = "rgba(200,200,200,0.5)";
        if (allEdges[edgeId].hiddenLabel === undefined) {
          allEdges[edgeId].hiddenLabel = allEdges[edgeId].label;
          allEdges[edgeId].label = undefined;
        }
      } else {
        // allEdges[edgeId].hidden = false;
        allEdges[edgeId].color = edgeColors[edgeId];
        if (allEdges[edgeId].hiddenLabel !== undefined) {
          allEdges[edgeId].label = allEdges[edgeId].hiddenLabel;
          allEdges[edgeId].hiddenLabel = undefined;
        }
      }
      edgeUpdateArray.push(allEdges[edgeId])
    }
    console.log("edgeUpdateArray", edgeUpdateArray)
    edges.update(edgeUpdateArray);
  }

  // transform the object into an array
  var updateArray = [];
  if (!params) {
    for (let nodeId in allNodes) {
      if (allNodes.hasOwnProperty(nodeId)) {
        updateArray.push(allNodes[nodeId]);
      }
    }
    nodes.update(updateArray);
  }
  else { //if(params.nodes.length > 0)
    for (let nodeId in allNodes) {
      if (allNodes.hasOwnProperty(nodeId)) {
        updateArray.push(allNodes[nodeId]);
      }
    }
    nodes.update(updateArray);
  }
}

function selectNodesEdges(nodes, edges) {
  network.selectNodes(nodes);
  network.selectEdges(edges);
  filterHighlightNodesEdges({ nodes: nodes, edges: edges });
  return [nodes, edges];
}

function highlightFilter(filter) {
  let selectedNodes = []
  let selectedProp = filter['property']
  if (filter['item'] === 'node') {
    let allNodes = nodes.get({ returnType: "Object" });
    for (let nodeId in allNodes) {
      if (allNodes[nodeId][selectedProp] && filter['value'].includes((allNodes[nodeId][selectedProp]).toString())) {
        selectedNodes.push(nodeId)
      }
    }
  }
  else if (filter['item'] === 'edge') {
    let allEdges = edges.get({ returnType: 'object' });
    // check if the selected property exists for selected edge and select the nodes connected to the edge
    for (let edge in allEdges) {
      if (allEdges[edge][selectedProp] && filter['value'].includes((allEdges[edge][selectedProp]).toString())) {
        selectedNodes.push(allEdges[edge]['from'])
        selectedNodes.push(allEdges[edge]['to'])
      }
    }
  }
  selectNodes(selectedNodes)
}

//custom filter for 2 filtering criteria
function subFilter(filter) {
  let selectedNodes = [];
  let selectedEdges = [];
  let selectedProp = filter['property'];
  if (filter['value'].length == 0) {
    return false
  }
  else if (filter['item'] === 'node') {
    let allNodes = nodes.get({ returnType: "Object" });
    for (let nodeId in allNodes) {
      if (allNodes[nodeId][selectedProp] && filter['value'].includes((allNodes[nodeId][selectedProp]).toString())) {
        selectedNodes.push(nodeId);
        selectedEdges = selectedEdges.concat(network.getConnectedEdges(nodeId, "from"));
        selectedEdges = selectedEdges.concat(network.getConnectedEdges(nodeId, "to"));
      }
    }
  }
  else if (filter['item'] === 'edge') {
    let allEdges = edges.get({ returnType: 'object' });
    // check if the selected property exists for selected edge and select the nodes connected to the edge
    for (let edge in allEdges) {
      if (allEdges[edge][selectedProp] && filter['value'].includes((allEdges[edge][selectedProp]).toString())) {
        selectedNodes.push(allEdges[edge]['from']);
        selectedNodes.push(allEdges[edge]['to']);
        selectedEdges.push(allEdges[edge].id);
      }
    }
  }
  return [selectedNodes, selectedEdges];
}

function intersection(selected1, selected2) {
  const nodes1 = new Set(selected1[0]);
  const nodes = Array.from(new Set(selected2[0].filter(item => nodes1.has(item))));
  const edges1 = new Set(selected1[1]);
  const edges = Array.from(new Set(selected2[1].filter(item => edges1.has(item))));
  return [nodes, edges];
}

function highlightFilter2(filter, filter2) {

  var selected1 = subFilter(filter)
  var selected2 = subFilter(filter2)

  if (selected1 && selected2) {
    selected1 = intersection(selected1, selected2);
  }
  else if (selected2) {
    selected1 = selected2;
  } else if (!selected1 && !selected2) {
    selectNodes([]);
    return
  }
  console.log("selected", selected1)

  selectNodesEdges(selected1[0], selected1[1])
}