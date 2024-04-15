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
  nodeControl.clear();
  resetFilterSelection(true);
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

function createWindow(params) {
  let selectedType;
  let selected;
  let windowID;
  var headerColor;
  if (params.nodes.length > 0) {
    selected = params.nodes[0];
    selectedType = 'node'
  } else if (params.edges.length > 0) {
    selected = params.edges[0];
    selectedType = 'edge'
  } else {
    return
  }

  var elementExists = document.getElementById("window" + selected) !== null;
  if (elementExists) {
    // console.log("elementExists")
    windowID = document.getElementById("window" + selected);
    fadeIn(windowID);
  } else {
    // console.log("not elementExists")
    if (selectedType === 'node') {
      headerColor = "yellow"

      titleText = nodes.get(selected)['title'];
      if (allNodes[selected].hasOwnProperty('summary')) {
        mainText = "Summary:" + nodes.get(selected)['summary']
      } else {
        mainText = nodes.get(selected)['title']
      }

      if (allNodes[selected].hasOwnProperty('summary')) {
        highlightText = nodes.get(selected)['summary'];
        highlightTextTitle = 'Summary:';
      } else if (allNodes[selected].hasOwnProperty('label')) {
        if (nodes.get(selected)['label']) {
          highlightText = nodes.get(selected)['label'];
        } else {
          highlightText = nodes.get(selected)['hiddenLabel'];
        }
        highlightTextTitle = 'Label:';
      }
      else {
        highlightTextTitle = '';
        highlightText = '';
      }
      if (allNodes[selected].hasOwnProperty('name')) {
        highlightName = nodes.get(selected)['name'];
        highlightTag = nodes.get(selected)['tag'];
        highlightNerTitle = "Name Entity list:";
        highlightTextHeight = '120px';
        highlightNerHeight = '70px';
      } else {
        highlightName = '';
        highlightTag = '';
        highlightNerTitle = "";
        highlightTextHeight = '220px';
        highlightNerHeight = '0px';
      }
    } else if (selectedType == 'edge') {
      var headerColor = "blue"
      var connectedNodes = network.getConnectedNodes(selected);
      connectedNodes = connectedNodes.map(num => num.toString());
      titleText = 'Edge: ('+ nodes.get(connectedNodes[0])['title'] + ') —— (' + nodes.get(connectedNodes[1])['title'] + ")";

      if (edges.get(selected)['relation']) {
        highlightTextTitle = 'Relation:';
        highlightText = edges.get(selected)['relation'];
      } else if (edges.get(selected)['sim']) {
        highlightTextTitle = 'Similarity:';
        highlightText = edges.get(selected)['sim'];
      } else {
        highlightTextTitle = '';
        highlightText = '';
      }
      highlightName = '';
      highlightTag = '';
      highlightNerTitle = "";
      highlightTextHeight = '220px';
      highlightNerHeight = '0px';
    }

    windowID = document.createElement("div");
    windowID.innerHTML = `
          <div class="${headerColor}">
            <p class="windowTitle">${titleText}</p>
          </div>
          <div class="mainWindow" id="highlight-attr">
            <span id="highlight-text-title">${highlightTextTitle}</span>
            <div id="highlight-text" style="height:${highlightTextHeight};">${highlightText}</div>
  
            <span id="highlight-ner-title">${highlightNerTitle}</span>
            <div id="highlight-ner" style="height:${highlightNerHeight};">
                <div id="highlight-name">${highlightName}</div>
                <div id="highlight-tag">${highlightTag}</div>
            </div>
          </div>`;

    document.getElementById("windowGroup").appendChild(windowID);
    windowID.id = "window" + selected;
    windowID.className += " window";
    windowID.style = "display: initial;"
    windowID.style = "position: absolute;";
    windowID.style = "top: 80px;";

    let headerID = windowID.firstElementChild;
    headerID.id = "window" + selected + "header";
    let createCloseButton = document.createElement("b");
    createCloseButton.id = "closeButton" + selected;
    createCloseButton.innerHTML = "×";
    document.getElementById("window" + selected + "header").appendChild(createCloseButton);
    fadeIn(windowID);
  }

  document.getElementById("closeButton" + selected).onclick = function () {
    windowID.remove();
  };
  dragElement(selected, selectedType, windowID);
}

function dragElement(selected, selectedType, elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if ("ontouchstart" in document.documentElement) {
    var pos1touch = 0,
      pos2touch = 0,
      pos3touch = 0,
      pos4touch = 0;
  }
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    document.getElementById(elmnt.id + "header").ontouchstart = dragMouseDown;
  }

  function dragMouseDown(e) {
    if (!"ontouchstart" in document.documentElement) {
      e.preventDefault();
    }
    pos3 = e.clientX;
    pos4 = e.clientY;
    if ("ontouchstart" in document.documentElement) {
      try {
        pos3touch = e.touches[0].clientX;
        pos4touch = e.touches[0].clientY;
      } catch (error) { }
    }
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementDrag;
    activeWindow(document.getElementById(elmnt.id));
    if (selectedType === 'node') {
      highlightNodesList([selected]);
      var connectedFromEdges = network.getConnectedEdges(selected, "from");
      var connectedToEdges = network.getConnectedEdges(selected, "to");
      var connectedEdges = connectedFromEdges.concat(connectedToEdges);
      highlightEdgesList(connectedEdges);
    }
    else if (selectedType === 'edge') {
      var connectedNodes = network.getConnectedNodes(selected);
      connectedNodes = connectedNodes.map(num => num.toString());
      highlightNodesList(connectedNodes);
      highlightEdgesList([selected]);
    }
  }

  function elementDrag(e) {
    e.preventDefault();
    if ("ontouchstart" in document.documentElement) {
      pos1touch = pos3touch - e.touches[0].clientX;
      pos2touch = pos4touch - e.touches[0].clientY;
      pos3touch = e.touches[0].clientX;
      pos4touch = e.touches[0].clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2touch) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1touch) + "px";
    } else {
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
  }
}

function fadeIn(elmnt) {
  elmnt.style.opacity = 0;
  elmnt.style.display = "initial";
  elmnt.style.opacity = "0.9";
  activeWindow(elmnt);
}

function activeWindow(elmnt) {
  const active = document.getElementsByClassName("window");
  for (let i = active.length - 1; i > -1; i--) {
    active[i].classList.remove("windowActive");
    elmnt.className += " windowActive";
  }
}

function nodeNeighbourhoodHighlight(params) {
  // console.log("in nieghbourhoodhighlight", params);
  // if something is selected:
  if (params.nodes.length > 0) {
    createWindow(params);

    var selectedNode = params.nodes[0];
    highlightNodesList(params.nodes);

    var connectedFromEdges = network.getConnectedEdges(selectedNode, "from");
    var connectedToEdges = network.getConnectedEdges(selectedNode, "to");
    var connectedEdges = connectedFromEdges.concat(connectedToEdges);
    highlightEdgesList(connectedEdges);
  } else {
    // console.log("highlightActive was true");
    // reset all nodes
    nodeControl.clear();
    resetFilterSelection(true);
  }
}

function edgeNeighbourhoodHighlight(params) {
  // console.log("in nieghbourhoodhighlight");
  // originalNodes = JSON.parse(JSON.stringify(allNodes));
  var selectedEdge = params.edges[0];
  createWindow(params);

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

function selectNodesEdges(nodes, edges) {
  highlightNodesList(nodes);
  highlightEdgesList(edges);
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
  nodeControl.clear();

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