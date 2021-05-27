function relationalSchema() {
  let fileString = "";
  const tables = [];
  const keys = [];
  let attributes = [];
  const fkeys = [];
  let superclassExists = true;

  const elements = graph.getElements();
  const elems = separateByType(elements);
  elems.entities.forEach(ent => {
    const textVal = ent.attributes.attrs.text.text;  
    tables.push({ id: ent.id, tableName: textVal });

    const neighbours = graph.getNeighbors(ent);
    let keyExists = false
    neighbours.forEach(n => {
      // Extract entity's key/s
      if (n.attributes.type === "tm.Key") {  
        keys.push({ id: ent.id, keyName: n.attributes.attrs.text.text });
        keyExists = true;
      } else if (['tm.Normal', 'tm.Multivalued', 'tm.Derived'].includes(n.attributes.type)) { // Extract entity's attributes
        attributes.push({ id: ent.id, attrName: n.attributes.attrs.text.text });
      }
    });

    // Warn user if the entity has no key attribute
    if (!keyExists) {
      showAlert('warning', `warn-no-key-${ent.id}`, `Entity ${textVal.bold()} does not have a key attributes. Is your schema right?`);
    }
  });

  elems.relationships.forEach(rel => {
    let aggrIncluded = false;

    const relLinks = graph.getConnectedLinks(rel);

    const relatedEntities = [];
    const oneEntities = [];
    let foreignKeys = [];
    const potentialAttributes = [];
    relLinks.forEach(link => {
      const subGraph = graph.getSubgraph([link]);
      // Find the entities that are related only once to the others
      if (link.prop('labels') && link.prop('labels')[0].attrs.text.text === '1') {
        subGraph.forEach(sElem => {
          if (sElem.attributes.type === "tm.Entity" || sElem.attributes.type === 'tm.Weak_Entity') {
            oneEntities.push({ id: sElem.id, name: sElem.attributes.attrs.text.text });
          } else if (sElem.attributes.type === "tm.Aggregation") {
            aggrIncluded = true;
          }
        })
      } else if (link.prop('labels') && link.prop('labels')[0].attrs.text.text !== '') { // Find the entities that are related N times to the others
        subGraph.forEach(sElem => {
          if (sElem.attributes.type === "tm.Entity" || sElem.attributes.type === 'tm.Weak_Entity') {
            relatedEntities.push(sElem.id);

            let newFKeys = JSON.parse(JSON.stringify(keys.filter(k => k.id === sElem.id)));
            newFKeys = newFKeys.map(fk => fk.keyName = `${sElem.attributes.attrs.text.text}_${fk.keyName}`);
            foreignKeys = foreignKeys.concat(newFKeys);
          } else if (sElem.attributes.type === "tm.Aggregation") {
            aggrIncluded = true;
          }
        })
      } else { // Extract relationship's potential attributes
        subGraph.forEach((sElement) => {   
          if (['tm.Normal', 'tm.Multivalued', 'tm.Derived'].includes(sElement.attributes.type)) {
            potentialAttributes.push({ id: rel.id, attrName: sElement.attributes.attrs.text.text });
          }
        });
      }
    });

    // Relationships connected to aggregations are dealt with later on
    if (!aggrIncluded) {
      // If there are one to one connections, add all the entities keys to the first one 
      if (oneEntities.length >= 2) {
        for (let i = 1; i < oneEntities.length; i++) {
          const oneToOneFkeyNames = keys.filter(k => oneEntities[i].id === k.id).map(k => k.keyName);
          oneToOneFkeyNames.forEach(one => {
            fkeys.push({id: oneEntities[0].id, fkeyName: `${oneEntities[i].name}_${one}` });
          })
        }
      }
      
      // If there is at least one entity related once to others, no table for the relationship is created
      if (oneEntities.length) {
        oneEntities.forEach(e => {
          foreignKeys.forEach(fk => { fkeys.push({ id: e.id, fkeyName: fk }); });
          potentialAttributes.forEach(pa => { attributes.push({ id: e.id, attrName: pa.attrName}); });
        })
      } else { // If there is no entity related once to others, a table for the relationship is created
        tables.push({id: rel.id, tableName: rel.attributes.attrs.text.text });
        const keyNames = keys.filter(k => relatedEntities.includes(k.id)).map(k => k.keyName);
        keyNames.forEach(k => { keys.push({ id: rel.id, keyName: k }); });
        attributes = attributes.concat(potentialAttributes);
      }
    }
  })

  elems.isas.forEach(isa => {
    if (!isaElements.find(i => i.id === isa.id)) { isaElements.push({ id: isa.id, isCovering: false }); }

    const currentIsa = isaElements.find(i => i.id === isa.id);
    // Search for a superclass entity
    graph.getConnectedLinks(isa).forEach(link => {
      if (link.prop('labels') && link.prop('labels')[0].attrs.text.text === 'Superclass') {
        currentIsa.entityToInherit = (link.getTargetElement() === isa) ? link.getSourceElement().attributes.attrs.text.text : 
          link.getTargetElement().attributes.attrs.text.text;
      }
    });
    // if the user doesnt provide a superclass, show alert
    if(!currentIsa.entityToInherit){
      showAlert('danger', `danger-no-super-${isa.id}`, `ISA element with the name of  ${isa.attributes.attrs.text.text.toUpperCase().bold()} has no superclass`);
      superclassExists = false;  
    }
    if (!superclassExists) { return; }

    const entityToInheritTable = tables.find(t => t.tableName === currentIsa.entityToInherit);
    
    const neighbours = graph.getNeighbors(isa);
    neighbours.forEach(s => {
      // Add superclass'es keys, fkeys and attributes, if needed, to subclass entities
      if (s.attributes.attrs.text.text !== currentIsa.entityToInherit ) {
        keys.forEach(key => {
          if (key.id === entityToInheritTable.id) {
            keys.push({ id: s.id, keyName: key.keyName });
          }
        })
        fkeys.forEach(fkey => {
          if (fkey.id === entityToInheritTable.id) {
            fkeys.push({ id: s.id, fkeyName: fkey.fkeyName });
          }
        })
        if (currentIsa.isCovering) {
          attributes.forEach(attr => {
            if(attr.id === entityToInheritTable.id) {
              attributes.push({ id: s.id, attrName: attr.attrName });
            }
          })
        }
      }
    })
    // Keep superclass entity table depending on isa being covering or not
    if(currentIsa.isCovering) { tables.splice(tables.indexOf(entityToInheritTable), 1); }
  })

  elems.aggregations.forEach(aggr => {
    const aggrLinks = graph.getConnectedLinks(aggr);
    const redLinks = [], blackLinks = [];

    aggrLinks.forEach(link => {
      if (link.attr("line/stroke") === "red") { redLinks.push(link); }
      else { blackLinks.push(link); }
    });

    let tableReprAggregation;
    let relatedEntities = [];
    let oneEntities = [];
    let foreignKeys = [];
    let potentialAttributes = [];
    redLinks.forEach(link => {
      var subGraph = graph.getSubgraph([link]);
      if (link.prop('labels') && link.prop('labels')[0].attrs.text.text === '1') {
        subGraph.forEach(sElem => {
          if (sElem.attributes.type === "tm.Entity" || sElem.attributes.type === 'tm.Weak_Entity') {
            oneEntities.push({ id: sElem.id, name: sElem.attributes.attrs.text.text });
          }
        })
      } else if (link.prop('labels') && link.prop('labels')[0].attrs.text.text !== '') {
        subGraph.forEach(sElem => {
          if (sElem.attributes.type === "tm.Entity" || sElem.attributes.type === 'tm.Weak_Entity') {
            relatedEntities.push(sElem.id);
  
            let newFKeys = JSON.parse(JSON.stringify(keys.filter(k => k.id === sElem.id)));
            newFKeys = newFKeys.map(fk => fk.keyName = `${sElem.attributes.attrs.text.text}_${fk.keyName}`);
            foreignKeys = foreignKeys.concat(newFKeys);
          }
        })
      } else {
        subGraph.forEach((sElement) => {   
          if (['tm.Normal', 'tm.Multivalued', 'tm.Derived'].includes(sElement.attributes.type)) {
            potentialAttributes.push({ id: aggr.id, attrName: sElement.attributes.attrs.text.text });
          }
        });
      }
    });

    if(oneEntities.length >= 2){
      for (let i = 1; i < oneEntities.length; i++) {
        const oneToOneFkeyNames = keys.filter(k => oneEntities[i].id === k.id).map(k => k.keyName);
        oneToOneFkeyNames.forEach(one => {
          fkeys.push({id: oneEntities[0].id, fkeyName: `${oneEntities[i].name}_${one}` });
        })
      }

      tableReprAggregation = oneEntities[0].id;
    }

    if (oneEntities.length) {
      oneEntities.forEach(e => {
        foreignKeys.forEach(fk => { fkeys.push({ id: e.id, fkeyName: fk }); });
        potentialAttributes.forEach(pa => { attributes.push({ id: e.id, attrName: pa.attrName}); });
      })

      if (!tableReprAggregation) { tableReprAggregation = oneEntities[oneEntities.length - 1].id; }
    } else {
      tables.push({ id: aggr.id, tableName: aggr.attributes.attrs.text.text });
      const keyNames = keys.filter(k => relatedEntities.includes(k.id)).map(k => k.keyName);
      keyNames.forEach(k => { keys.push({ id: aggr.id, keyName: k }); });
      attributes = attributes.concat(potentialAttributes);

      tableReprAggregation = tables[tables.length - 1].id;
    }

    const relsLinkedToAggr = []
    blackLinks.forEach(link => {
      if (link.getTargetElement() === aggr && ['tm.Relationship', 'tm.Identifying_Relationship'].includes(link.getSourceElement().attributes.type)) {
        relsLinkedToAggr.push(link.getSourceElement());
      } else if (link.getSourceElement() === aggr && ['tm.Relationship', 'tm.Identifying_Relationship'].includes(link.getTargetElement().attributes.type)) {
        relsLinkedToAggr.push(link.getTargetElement());
      }
    });

    relsLinkedToAggr.forEach(rel => {
      const relLinks = graph.getConnectedLinks(rel);
      relatedEntities = [], oneEntities = [], foreignKeys = [], potentialAttributes = [];

      relLinks.forEach(link => {
        const subGraph = graph.getSubgraph([link]);
        if (link.prop('labels') && link.prop('labels')[0].attrs.text.text === '1') {
          subGraph.forEach(sElem => {
            if (sElem.attributes.type === "tm.Entity" || sElem.attributes.type === 'tm.Weak_Entity') { 
              oneEntities.push({ id: sElem.id, name: sElem.attributes.attrs.text.text }); 
            } else if (sElem.attributes.type === "tm.Aggregation") {
              const t = tables.find(t => t.id === tableReprAggregation);
              oneEntities.push({ id: t.id, name: t.tableName });
            }
          })
        } else if (link.prop('labels') && link.prop('labels')[0].attrs.text.text !== '') {
          subGraph.forEach(sElem => {
            let addFKeys = undefined;
            if (sElem.attributes.type === "tm.Entity" || sElem.attributes.type === 'tm.Weak_Entity') {
              relatedEntities.push(sElem.id);
              addFKeys = { id: sElem.id, name: sElem.attributes.attrs.text.text };
            } else if (sElem.attributes.type === 'tm.Aggregation') {
              relatedEntities.push(tableReprAggregation);
              const t = tables.find(t => t.id === tableReprAggregation);
              addFKeys = { id: t.id, name: t.tableName };
            }

            if (addFKeys) {
              let newFKeys = JSON.parse(JSON.stringify(keys.filter(k => k.id === addFKeys.id)));
              newFKeys = newFKeys.map(fk => fk.keyName = `${addFKeys.name}_${fk.keyName}`);
              foreignKeys = foreignKeys.concat(newFKeys);
            }
          })
        } else {
          subGraph.forEach((sElement) => {   
            if (['tm.Normal', 'tm.Multivalued', 'tm.Derived'].includes(sElement.attributes.type)) {
              potentialAttributes.push({ id: rel.id, attrName: sElement.attributes.attrs.text.text });
            }
          });
        }
      });

      if(oneEntities.length >= 2){
        for (let i = 1; i < oneEntities.length; i++) {
          const oneToOneFkeyNames = keys.filter(k => oneEntities[i].id === k.id).map(k => k.keyName);
          oneToOneFkeyNames.forEach(one => {
            fkeys.push({id: oneEntities[0].id, fkeyName: `${oneEntities[i].name}_${one}` });
          })
        }
      }

      if (oneEntities.length) {
        oneEntities.forEach(e => {
          foreignKeys.forEach(fk => { fkeys.push({ id: e.id, fkeyName: fk }); });
          potentialAttributes.forEach(pa => { attributes.push({ id: e.id, attrName: pa.attrName}); });
        })
      } else {
        tables.push({id: rel.id, tableName: rel.attributes.attrs.text.text });
        const keyNames = keys.filter(k => relatedEntities.includes(k.id)).map(k => k.keyName);
        keyNames.forEach(k => { keys.push({ id: rel.id, keyName: k }); });
        attributes = attributes.concat(potentialAttributes);
      }
    });
  })

  // Production of the final string containing the tables and their columns
  tables.forEach(table => {
    fileString = fileString + (`${table.tableName}(`);
    let keyString = '', attrString = '', fkeyString = '';
    
    keys.forEach(key => {
      if (table.id === key.id) {
        keyString = keyString + (`${key.keyName}, `)
      }
    })
    fileString = fileString + ((keyString) ? 'KEYS: ' + keyString : '');

    attributes.forEach(atrribute => {
      if (table.id === atrribute.id) {
        attrString = attrString + (`${atrribute.attrName}, `);
      }
    })
    fileString = fileString + ((attrString) ? 'ATTRIBUTES: ' + attrString : '');
    
    fkeys.forEach(fkey => {
      if (table.id === fkey.id) {
        fkeyString = fkeyString + (`${fkey.fkeyName}, `);
      }
    })
    fileString = fileString + ((fkeyString) ? 'FOREIGN KEYS: ' + fkeyString : '');

    fileString = (keyString || attrString || fkeyString) ? fileString.slice(0, -2) : fileString.slice(0, -1);
    fileString = fileString + ((keyString || attrString || fkeyString) ? ')' : '');
    fileString = fileString + "\n";
  })

  // Only if there are superclasses defined for all isa elements procceed to the download
  if (superclassExists) { download(fileString, "text/plain"); }
}

// Downloads .txt file containing the relational schema
function download(data, type) {
  const file = new Blob([data], {type: type});
  var d = new Date();
  const filename = `rel_schema_${d.toISOString().substring(0, 10)}_${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
  var downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", URL.createObjectURL(file));
  downloadAnchorNode.setAttribute("download", filename);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Separates the graph nodes to different tables based on their type
function separateByType(elements) {
  const elems = { entities: [], relationships: [], isas: [], aggregations: [] }
  elements.forEach(e => {
    const typeVal = e.attributes.type;
    switch (typeVal) {
      case "tm.Entity":
      case "tm.Weak_Entity":
        elems.entities.push(e);
        break;
      case "tm.Relationship":
      case "tm.Identifying_Relationship":
        elems.relationships.push(e);
        break;
      case "tm.ISA":
        elems.isas.push(e);
        break;
      case "tm.Aggregation": 
        elems.aggregations.push(e);
        break;
    }
  });

  return elems;
}
