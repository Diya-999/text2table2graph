function highlightNodesList(nodesList) {
  allNodes = nodes.get({ returnType: "Object" });
  let nodeUpdateArray = [];
  for (let nodeId in allNodes) {
    if (!nodesList.includes(nodeId)) {
      allNodes[nodeId].color = "rgba(200,200,200,0.5)";
      if (allNodes[nodeId].node_type === "entity") {
        allNodes[nodeId].image = "entity_trans.png";
      } else if (allNodes[nodeId].node_type === "news") {
        allNodes[nodeId].image = "news_trans.png";
      }
      if (allNodes[nodeId].hiddenLabel === undefined) {
        allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
        allNodes[nodeId].label = undefined;
      }
    } else {
      allNodes[nodeId].color = nodeColors[nodeId];
      if (allNodes[nodeId].node_type === "entity") {
        allNodes[nodeId].image = "entity.png";
      } else if (allNodes[nodeId].node_type === "news") {
        allNodes[nodeId].image = "news.png";
      }
      if (allNodes[nodeId].hiddenLabel !== undefined) {
        allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
        allNodes[nodeId].hiddenLabel = undefined;
      }
    }
    nodeUpdateArray.push(allNodes[nodeId]);
  }
  nodes.update(nodeUpdateArray);
}

function highlightEdgesList(edgesList) {
  let edgeUpdateArray = [];
  for (let edgeId in allEdges) {
    if (!edgesList.includes(edgeId)) {
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
}

function resetHighlight() {
  nodeUpdateArray = [];
  for (let nodeId in allNodes) {
    allNodes[nodeId].color = nodeColors[nodeId];
    if (allNodes[nodeId].node_type === "entity") {
      allNodes[nodeId].image = "entity.png";
    } else if (allNodes[nodeId].node_type === "news") {
      allNodes[nodeId].image = "news.png";
    }
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
}

function changeNetworkVersion(versionNum) {
  //recover current network
  resetHighlight();
  var optionsChange = {
    "configure": {
      "enabled": true,
      "filter": [
        "physics"
      ]
    },
    "edges": {
      "color": {
        "inherit": true
      },
      "width": 4,
      "font": {
        "size": 10
      },
      "smooth": {
        "enabled": true,
        'type': 'continuous'
      }
    },
    "interaction": {
      "dragNodes": true,
      "hideEdgesOnDrag": false,
      "hideNodesOnDrag": false,
      "selectConnectedEdges": false
    },
    "physics": {
      "enabled": true,
      "stabilization": {
        "enabled": true,
        "fit": true,
        "iterations": 1000,
        "onlyDynamicEdges": false,
        "updateInterval": 50
      },
      "solver": "barnesHut",
      "timestep": 0.5,
      "barnesHut": {
        "damping": 0.09,
        "avoidOverlap": 0.5
      },
      "forceAtlas2Based": {
        "damping": 0.09,
        "avoidOverlap": 0.5
      }
    }
  };
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
    optionsChange.physics.solver = 'barnesHut';
    optionsChange.physics.timestep = 0.5;
    optionsChange.physics.barnesHut.damping = 0.09;
    network.setOptions(optionsChange);
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
    optionsChange.physics.solver = 'barnesHut';
    optionsChange.physics.timestep = 0.5;
    optionsChange.physics.barnesHut.damping = 0.09;
    network.setOptions(optionsChange);
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
    optionsChange.physics.solver = 'barnesHut';
    optionsChange.physics.timestep = 0.5;
    optionsChange.physics.barnesHut.damping = 0.09;
    network.setOptions(optionsChange);
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
    optionsChange.physics.solver = 'barnesHut';
    optionsChange.physics.timestep = 0.5;
    optionsChange.physics.barnesHut.damping = 0.09;
    network.setOptions(optionsChange);
  } else if (versionNum === "V5") {
    network.setData({
      nodes: nodes5,
      edges: edges5,
    });
    nodes = nodes5;
    edges = edges5;
    nodeColors = nodeColors5;
    edgeColors = edgeColors5;
    nodesOptions = nodesOptions5;
    optionsChange.physics.solver = 'forceAtlas2Based';
    optionsChange.physics.timestep = 0.1;
    optionsChange.physics.forceAtlas2Based.damping = 1;
    network.setOptions(optionsChange);
  } else if (versionNum === "V6") {
    network.setData({
      nodes: nodes6,
      edges: edges6,
    });
    nodes = nodes6;
    edges = edges6;
    nodeColors = nodeColors6;
    edgeColors = edgeColors6;
    nodesOptions = nodesOptions6;
    optionsChange.physics.solver = 'forceAtlas2Based';
    optionsChange.physics.timestep = 0.1;
    optionsChange.physics.forceAtlas2Based.damping = 1;
    network.setOptions(optionsChange);
  }
  nodeControl.clear();
  nodeControl.clearOptions();
  nodeControl.addOptions(nodesOptions, user_created = false)
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


function showHighlightNodeInfo(selectedNode) {
  allNodes = nodes.get({ returnType: "Object" });
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
    var toggleSwitch = document.querySelector('#auto-toggle-switch');
    var checkbox = toggleSwitch.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    mynetwork.style.width = '80%';
    highlightAttr.style.width = '20%';
    isAttrExpanded = !isAttrExpanded;
  }
}
function showHighlightEdgeInfo(edgeId) {
  if (edges.get(edgeId)['relation']) {
    highlightTextTitle.innerText = 'Relation:';
    highlightText.innerText = edges.get(edgeId)['relation'];
    highlightText.style.setProperty("border", "1px solid black");
  } else if (edges.get(edgeId)['sim']) {
    highlightTextTitle.innerText = 'Similarity:';
    highlightText.innerText = edges.get(edgeId)['sim'];
    highlightText.style.setProperty("border", "1px solid black");
  } else {
    highlightTextTitle.innerText = '';
    highlightText.innerText = '';
    highlightText.style.setProperty("border", "0px");
  }
  highlightName.innerText = '';
  highlightTag.innerText = '';
  highlightNer.style.setProperty("border", "0px");
  highlightNerTitle.innerText = "";
  if (!isAttrExpanded) {
    var toggleSwitch = document.querySelector('#auto-toggle-switch');
    var checkbox = toggleSwitch.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    mynetwork.style.width = '80%';
    highlightAttr.style.width = '20%';
    isAttrExpanded = !isAttrExpanded;
  }
}

function nodeNeighbourhoodHighlight(params) {
  // console.log("in nieghbourhoodhighlight", params);
  // if something is selected:
  if (params.nodes.length > 0) {
    createNodeWindow(params);

    var selectedNode = params.nodes[0];
    showHighlightNodeInfo(selectedNode);

    highlightNodesList(params.nodes);

    var connectedFromEdges = network.getConnectedEdges(selectedNode, "from");
    var connectedToEdges = network.getConnectedEdges(selectedNode, "to");
    var connectedEdges = connectedFromEdges.concat(connectedToEdges);
    highlightEdgesList(connectedEdges);
  } else {
    // console.log("highlightActive was true");
    // reset all nodes
    resetHighlight();
  }
}

function edgeNeighbourhoodHighlight(params) {
  // console.log("in nieghbourhoodhighlight");
  // originalNodes = JSON.parse(JSON.stringify(allNodes));
  var selectedEdge = params.edges[0];
  showHighlightEdgeInfo(selectedEdge);

  var connectedNodes = network.getConnectedNodes(selectedEdge);
  connectedNodes = connectedNodes.map(num => num.toString());
  highlightNodesList(connectedNodes);
  highlightEdgesList(params.edges);
}

function selectNode(nodes) {
  if (nodes[0] !== "") {
    nodeNeighbourhoodHighlight({ nodes: nodes });
    return nodes;
  }
}

function filterHighlightNodesEdges(params) {
  if (!params) { //&& filterActive === true
    // reset all nodes
    resetHighlight();
    filterActive = false;
  }
  // if something is selected:
  else {
    highlightNodesList(params.nodes);
    highlightEdgesList(params.edges);
    filterActive = true;
  }
}

function selectNodesEdges(nodes, edges) {
  filterHighlightNodesEdges({ nodes: nodes, edges: edges });
  return [nodes, edges];
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
    commonSelected = intersection(selected1, selected2);
  }
  else if (selected2) {
    commonSelected = selected2;
  } else if (selected1) {
    commonSelected = selected1;
  } else if (!selected1 && !selected2) {
    resetHighlight();
    return
  }
  console.log("selected", commonSelected)

  selectNodesEdges(commonSelected[0], commonSelected[1])
}