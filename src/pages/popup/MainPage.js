import React, { useState } from 'react'
import Dialog from './Dialog'

const MainPage = () => {

  const [hover, setHover] = useState('');
  const [isDialogOpen, setDialogOpen] = useState('');
  //const [dialogAction, setDialogAction] = useState('')
  //const [projSelected, setProjSelected] = useState('')
  const [colorPalettes, setColorPalettes] = useState([])
  let projSelected = '';
  let dialogAction = ''

  const tabSty = {
    overflow: "hidden",
    border: "1px solid #ccc",
    backgroundColor: "#f1f1f1"
  };

  const tabBtnSty = {
    backgroundColor: "inherit",
    float: "left",
    border: "none",
    outline: "none",
    cursor: "pointer",
    padding: "14px 16px",
    width: "50%",
    transition: "0.3s",
  }

  const tabContentSty = {
    display: "none",
    padding: "6px 12px",
    borderTop: "none",
  }

  const buttonStyle = {
    backgroundColor: "#b9bdbc",
    color: "white",
    padding: "14px 20px",
    margin: "8px 0px 0px 0px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    position: 'fixed',
    bottom: '0',
    left: '0'
  }

  const importPaletteSty = {
    backgroundColor: "#b9bdbc",
    color: "white",
    padding: "14px 20px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    marginTop: '15px',
    marginBottom: '0px'
  }

  const cardSty = 'box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s, width: 100%, border-radius: 20px'
  const cardContainer = 'padding: 2px 6px; background-color; "#f9f4f4";border-radius:20px;'
  const h3Sty = 'font-weight: 600; text-transform: uppercase;letter-spacing: 0.1em;'
  const swatchColorSty = 'position: relative;width: 100%;display: block'

  React.useEffect(() => {
    let tabContents = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabContents.length - 1; i++) {
      tabContents[i].style.display = "none";
    }

    if (dialogAction == '') {
      document.getElementById("library").style.display = "block";
      document.getElementById("lib").className += " active";
      document.getElementById("lib").style.background = '#fff'

    }

    document.addEventListener('click', function (e) {
      let dot = e.target.getAttribute('class');
      if (e.target && (e.target.id == 'dvDetails' || (dot != null && dot.indexOf('dot') != -1))) {
        let elements = document.getElementsByClassName('dropdown-content')
        for (let i = 0; i <= elements.length; i++) {
          if (elements[i] != undefined)
            elements[i].style.display = 'none'
        }
        if (e.target.parentElement.children[3] != undefined)
          e.target.parentElement.children[3].style.display = 'block'
      } else if (e.target && e.target.id == "deleteProj") {
        let key = e.target.parentElement.parentElement.previousSibling.innerHTML;
        deleteProject(key)
      } else if (e.target && e.target.id == "moveProj") {
        let key = e.target.parentElement.parentElement.previousSibling.innerHTML;
        e.target.parentElement.style.display = 'none'
        dialogAction = 'move';
        projSelected = key;
        alert('this is from move')
      } else if (e.target && e.target.id == 'deleteLib') {
        let key = e.target.parentElement.parentElement.previousSibling.innerHTML;
        removeProjects(key)
      } else if (e.target && e.target.id == 'addPerson') {
        let key = e.target.parentElement.parentElement.previousSibling.innerHTML;
        projSelected = key;
        dialogAction= 'adding-participant'
        alert('this is addding participant')
      } else if (e.target && e.target.id == 'importPalette') {
        let key = e.target.parentElement.querySelector('#currentUrl').innerHTML
        
        projSelected = key;
        dialogAction = 'import'
        alert('this is import')
      }else if(e.target && e.target.id == 'deletePalette'){
        let paletteKey = e.target.parentElement.parentElement.previousSibling.innerHTML
        let projKey = e.target.nextSibling.innerHTML
        deletePaletteProj(projKey, paletteKey)
      }  else {
        let elements = document.getElementsByClassName('dropdown-content')
        for (let i = 0; i <= elements.length; i++) {
          if (elements[i] != undefined)
            elements[i].style.display = 'none'
        }
      }
    });

    getStoredPalette();

    if (document.getElementById) {
      window.alert = function (txt) {
        createCustomAlert(txt);
      }
    }

  });


  function deleteProject(key) {
    key = key.replace("amp;", "")
    chrome.storage.local.get(['ColorPalette'], function (res) {
      let prevData = res.ColorPalette != undefined ? res.ColorPalette : [];
      if (prevData != null && prevData != undefined && prevData.length > 0) {
        prevData = JSON.parse(prevData)
        prevData = prevData.filter(x => JSON.parse(x).currentUrl != key);
        chrome.storage.local.set({ 'ColorPalette': JSON.stringify(prevData) })
        //setColorPalettes(prevData)
        drawCardInProject(prevData, true)
      }
    })
  }

  function onTabClick(e) {
    let tabContent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i <= tabContent.length - 1; i++) {
      tabContent[i].style.display = "none";
    }
    let tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i <= tablinks.length - 1; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
      tablinks[i].style.background = ''
    }
    document.getElementById(e.target.innerHTML.toLowerCase()).style.display = "block";
    e.currentTarget.className += " active";
    e.currentTarget.style.background = "#fff"
    if (e.currentTarget.id == 'proj') {
      getProjects();
    } else {
      getStoredPalette()
    }
  }

  function getStoredPalette() {
    chrome.storage.local.get(['ColorPalette'], function (res) {
      let prevData = res.ColorPalette != undefined ? res.ColorPalette : [];
      if (prevData != null && prevData != undefined && prevData.length > 0) {
        console.log('prevData', prevData)
        console.log('prevData', typeof prevData)
        prevData = JSON.parse(prevData)
        drawCardInProject(prevData, true)
        //setColorPalettes(prevData)
      }
    })

  }

  function generatePalette() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let currentUrl = tabs[0].url
      chrome.tabs.sendMessage(tabs[0].id, { "command": "get_colors" }, function (response) {
        var colors = response.message;
        console.log('colors', JSON.stringify(colors))
        let prevData = []
        let data = { currentUrl: currentUrl, data: colors }
        drawCardInProject([data])
        chrome.storage.local.get(['ColorPalette'], function (res) {
          prevData = res.ColorPalette != undefined ? res.ColorPalette : [];
          if (prevData != null && prevData != undefined && prevData.length > 0) {
            prevData = JSON.parse(prevData)
          }

          prevData.push(JSON.stringify(data))
          if (prevData.length > 0) {
            chrome.storage.local.set({ 'ColorPalette': JSON.stringify(prevData) })
          }
          //setColorPalettes(prevData)

        })

      });
    });

  }

  function drawCardInProject(data, redraw) {
    let html = !redraw ? document.getElementById('libraryContent').innerHTML : '';
    for (let i = 0; i <= data.length - 1; i++) {
      let element = typeof data[i] == 'string' ? JSON.parse(data[i]) : data[i];
      html = html + '<div class="card" style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s; width: 100%; border-radius: 20px">' +
        '<div class="container" style="padding: 2px 6px; background-color: #dfdfdf;border-radius:20px;">' +
        '<div style="display:inline;"><h3 style="font-weight: 600;letter-spacing: 0.1em;"><b>' + (new URL(element.currentUrl)).hostname + '</b>' +
        '<span style="display:none" id="currentUrl">' + element.currentUrl + '</span><div class="dropdown" id="dvDetails" style="float:right;display:inline;text-align:center; width:40px;height:25px;border-radius:3px;">' +
        '<span class="dot" style="height: 8px;width: 8px;background-color: #000000;border-radius: 50%;display: inline-block;font-weight: bold;"></span>' +
        '<span class="dot" style="height: 8px;width: 8px;background-color: #000000;border-radius: 50%;display: inline-block;font-weight: bold;"></span>' +
        '<span class="dot" style="height: 8px;width: 8px;background-color: #000000;border-radius: 50%;display: inline-block;font-weight: bold;"></span>' +
        '<div id="myDropdown" class="dropdown-content" style="display:none;position: absolute;background-color: #f1f1f1;width: 60px;overflow: auto;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);z-index: 1;"><a id="deleteProj">Delete</a><br/><a id="moveProj">Move</a></div>' +
        '</div></h3></div>' +
        '<ul class="swatch-list" style="padding-left: 10px; list-style-type: none; ' +
        'margin: 0px; padding: 0px; overflow: hidden;margin-bottom:15px;">' +

        '<li class="mainli" style="line-height: 0.02;  float: left; width: 20%;">' +
        '<div class="swatch" style="width: 100%; height: 30px; background: ' + element.data[0].value + '; overflow: hidden;">' +
        '<div class="swatch-color color-grapefruit" style="position: relative;width: 100%;display: block;"></div></div>' +
        '<div class="swatch-info" style="line-height: 0.02;display:none"><p>' + element.data[0].value + '</p></div>' +
        '</li>' +

        '<li class="mainli" style="line-height: 0.02;  float: left; width: 20%;">' +
        '<div class="swatch" style="width: 100%; height: 30px; background: ' + element.data[1].value + ';overflow: hidden;">' +
        '<div class="swatch-color color-grapefruit" style="position: relative;width: 100%;display: block;"></div></div>' +
        '<div class="swatch-info" style="line-height: 0.02;display:none"><p>' + element.data[1].value + '</p></div>' +
        '</li>' +

        '<li class="mainli" style="line-height: 0.02;  float: left; width: 20%;">' +
        '<div class="swatch" style="width: 100%; height: 30px; background: ' + element.data[2].value + '; overflow: hidden">' +
        '<div class="swatch-color color-grapefruit" style="position: relative;width: 100%;display: block;"></div></div>' +
        '<div class="swatch-info" style="line-height: 0.02;display:none"><p>' + element.data[2].value + '</p></div>' +
        '</li>' +

        '<li class="mainli" style="line-height: 0.02;  float: left; width: 20%;">' +
        '<div class="swatch" style="width: 100%; height: 30px; background: ' + element.data[3].value + ';overflow: hidden">' +
        '<div class="swatch-color color-grapefruit" style="position: relative;width: 100%;display: block;"></div></div>' +
        '<div class="swatch-info" style="line-height: 0.02;display:none"><p>' + element.data[3].value + '</p></div>' +
        '</li>' +

        '<li class="mainli" style="line-height: 0.02;  float: left; width: 20%;">' +
        '<div class="swatch" style="width: 100%; height: 30px; background: ' + element.data[4].value + ';overflow: hidden">' +
        '<div class="swatch-color color-grapefruit" style="position: relative;width: 100%;display: block;"></div></div>' +
        '<div class="swatch-info" style="line-height: 0.02;display:none"><p>' + element.data[4].value + '</p></div>' +
        '</li>' +
        '</ul></div></div><br/>'
    }
    document.getElementById('libraryContent').innerHTML = html
    let li = document.querySelectorAll('.swatch-list li.mainli')
    console.log('li in', li)
    li.forEach(item => {
      item.addEventListener('mouseenter', function (e) {
        if (e.target != undefined && e.target.parentElement != undefined && e.target.parentElement.getAttribute('class').indexOf('swatch-list') != -1) {
          e.target.children[1].style.display = 'block'
        }
      })
      item.addEventListener('mouseleave', function (e) {
        if (e.target != undefined && e.target.parentElement != undefined && e.target.parentElement.getAttribute('class').indexOf('swatch-list') != -1) {
          e.target.children[1].style.display = 'none'
        }
      })
      item.addEventListener('click', function (e) {
        if (e.target != undefined && e.target.parentElement != undefined && e.target.parentElement.getAttribute('class').indexOf('mainli') != -1) {
          let value = '';
          if (e.target.getAttribute('class').indexOf('swatch') != -1) {
            value = e.target.parentElement.children[1].children[0].innerHTML
          } else if (e.target.getAttribute('class').indexOf('') != -1) {
            value = e.target.children[0].innerHTML
          }

          let temp = document.createElement('textarea');
          temp.value = value;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
        }
      })
    })

  }

  function openDialog() {
    //setDialogAction('project')
    dialogAction = 'project'
    alert('project')
    
  }


  function createCustomAlert(txt) {
    let d = document;

    if (d.getElementById("modalContainer")) return;

    let mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = d.documentElement.scrollHeight + "px";
    mObj.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
    mObj.style.position = 'absolute'
    mObj.style.width = '100%'
    mObj.style.height = '100%'
    mObj.style.top = '0'
    mObj.style.left = '0'

    let alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    alertObj.style.position = 'relative';
    alertObj.style.width = "300px";
    alertObj.style.minHeight = "120px";
    alertObj.style.marginTop = "50px";
    alertObj.style.marginLeft = "5px";
    alertObj.style.border = "1px solid #666";
    alertObj.style.backgroundColor = "#fff";
    alertObj.style.backgroundRepeat = "no-repeat";
    alertObj.style.backgroundPosition = "20px 30px";

    if (d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
    alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth) / 2 + "px";
    alertObj.style.visiblity = "visible";

    let h1 = alertObj.appendChild(d.createElement("h1"));
    let title = '';
    if(dialogAction == 'import'){
      title = d.createTextNode("Import Palette")
    }else if(dialogAction == 'adding-participant'){
      title = d.createTextNode("Add participant")
    }else if(dialogAction == 'project'){
      title = d.createTextNode("Add New Project")  
    }else if(dialogAction == 'move'){
      title = d.createTextNode("Move Color Palette")  
    }
    
    h1.appendChild(title);

    if (dialogAction != 'import' && dialogAction != 'move') {
      let msg = alertObj.appendChild(d.createElement("input"));
      msg.id = "input"
      msg.style.font = "1em verdana,arial";
      msg.style.paddingLeft = "5px";
      //msg.appendChild(d.createTextNode(txt));
      //msg.innerHTML = txt;
    } else if (dialogAction == 'import' || dialogAction == 'move') {
      let selectList = alertObj.appendChild(d.createElement("Select"))
      selectList.id = "paletteSelect"
      selectList.style.font = "1em verdana,arial";
      selectList.style.paddingLeft = "5px";
      selectList.style.marginLeft = "50px"

      let optionF = document.createElement("option");
      optionF.value = 'select';
      optionF.text = 'Select';
      selectList.appendChild(optionF)

      if(dialogAction == 'import'){
        chrome.storage.local.get(['ColorPalette'], function (res) {
          let prevData = res.ColorPalette != undefined ? res.ColorPalette : [];
          if (prevData != null && prevData != undefined && prevData.length > 0) {
            prevData = JSON.parse(prevData)

            for (let i = 0; i <= prevData.length - 1; i++) {
              let option = document.createElement("option");
              let value = JSON.parse(prevData[i]).currentUrl;
              option.value = value;
              option.text = (new URL(value)).hostname;
              selectList.appendChild(option)
            }

          }
        })
      }else if(dialogAction == 'move'){

        chrome.storage.local.get(['Projects'], function (res) {
          let prevData = res.Projects != undefined ? res.Projects : [];
          if (prevData != null && prevData != undefined && prevData.length > 0) {
            prevData = JSON.parse(prevData)

            for (let i = 0; i <= prevData.length - 1; i++) {
              let option = document.createElement("option");
              let value = JSON.parse(prevData[i]).name;
              option.value = value;
              option.text = value;
              selectList.appendChild(option)
            }

          }
        })
      }


    }

    let divEl = alertObj.appendChild(d.createElement("div"))
    divEl.style.position = "absolute"
    divEl.style.bottom = "20px"
    divEl.style.right = "50px"

    let btn = divEl.appendChild(d.createElement("a"));
    btn.id = "closeBtn";
    btn.style.position = "relative";
    btn.style.margin = "5px auto";
    btn.style.padding = "7px";
    btn.style.border = "none";
    btn.style.width = "70px";
    btn.style.font = "0.7em verdana,arial";
    btn.style.textTransform = "uppercase";
    btn.style.textAlign = "center";
    btn.style.color = "#FFF"
    btn.style.backgroundColor = "red";
    btn.style.borderRadius = "3px";
    btn.style.textDecoration = "none";

    btn.appendChild(d.createTextNode('Cancel'));
    btn.href = "#";
    btn.focus();
    btn.onclick = function () { removeCustomAlert(); return false; }

    divEl.append(document.createTextNode('\u00A0\u00A0'));
    let btnSave = divEl.appendChild(d.createElement("a"));
    btnSave.id = "saveBtn";
    btnSave.style.position = "relative";
    btnSave.style.margin = "5px auto";
    btnSave.style.padding = "7px";
    btnSave.style.border = "none";
    btnSave.style.font = "0.7em verdana,arial";
    btnSave.style.textTransform = "uppercase";
    btnSave.style.textAlign = "center";
    btnSave.style.color = "#FFF"
    btnSave.style.backgroundColor = "#357EBD";
    btnSave.style.borderRadius = "3px";
    btnSave.style.textDecoration = "none";


    btnSave.href = "#";
    btnSave.focus();
   if (dialogAction == 'adding-participant') {
      btnSave.onclick = function () { addParticipant(); return false; }
      btnSave.appendChild(d.createTextNode('Add'));
    } else if (dialogAction == 'import') {
      btnSave.onclick = function () { importPalette(); return false; }
      btnSave.appendChild(d.createTextNode('Import'));
    }else if(dialogAction == 'project'){
      btnSave.onclick = function () { saveProject(); return false; }
      btnSave.appendChild(d.createTextNode('Save'));
    }else if(dialogAction == 'move'){
      btnSave.onclick = function() {moveColorPalette(); return false;}
      btnSave.appendChild(d.createTextNode('Move'));
    } 
    
    
    alertObj.style.display = "block";

  }

  function removeCustomAlert() {
    document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
  }

  function moveColorPalette(){
    var selectedProj = document.getElementById('paletteSelect').value;
    let colorPalette = ''
    chrome.storage.local.get(['ColorPalette'], function (res) {
      let prevData = res.ColorPalette != undefined ? res.ColorPalette : [];
      if (prevData != null && prevData != undefined && prevData.length > 0) {
        prevData = JSON.parse(prevData)
        colorPalette = prevData.filter(x => JSON.parse(x).currentUrl == projSelected)[0]
        /* prevData = prevData.filter(x => JSON.parse(x).currentUrl != projSelected);
        chrome.storage.local.set({ 'ColorPalette': JSON.stringify(prevData) })
        drawCardInProject(prevData, true) */
      }
    })

    chrome.storage.local.get(['Projects'], function (res) {
      let prevData = res.Projects != undefined ? res.Projects : [];
      if (prevData != null && prevData != undefined && prevData.length > 0) {
        prevData = JSON.parse(prevData)
      }
      let project = prevData.filter(x => JSON.parse(x).name == selectedProj)[0];
      if (project != undefined)
        project = JSON.parse(project);
      //JSON.parse(project).colorPalettes.push(colorPalette)
      prevData = prevData.filter(x => JSON.parse(x).name != selectedProj)
      project.colorPalettes.push(colorPalette)
      prevData.push(JSON.stringify(project))

      chrome.storage.local.set({ 'Projects': JSON.stringify(prevData) })
      removeCustomAlert()

    })

  }

  function importPalette() {
    var selectedPalette = document.getElementById('paletteSelect').value;
    var colorPalette;
    var d;


    chrome.storage.local.get(['ColorPalette'], function (res) {
      let prevData = res.ColorPalette != undefined ? res.ColorPalette : [];
      if (prevData != null && prevData != undefined && prevData.length > 0) {
        prevData = JSON.parse(prevData)
        colorPalette = prevData.filter(x => JSON.parse(x).currentUrl == selectedPalette)[0]
       /*  prevData = prevData.filter(x => JSON.parse(x).currentUrl != selectedPalette);
        chrome.storage.local.set({ 'ColorPalette': JSON.stringify(prevData) }) */
      }
    })

    chrome.storage.local.get(['Projects'], function (res) {
      let prevData = res.Projects != undefined ? res.Projects : [];
      if (prevData != null && prevData != undefined && prevData.length > 0) {
        prevData = JSON.parse(prevData)
      }
      let project = prevData.filter(x => JSON.parse(x).name == projSelected)[0];
      if (project != undefined)
        project = JSON.parse(project);
      //JSON.parse(project).colorPalettes.push(colorPalette)
      prevData = prevData.filter(x => JSON.parse(x).name != projSelected)
      project.colorPalettes.push(colorPalette)
      prevData.push(JSON.stringify(project))

      chrome.storage.local.set({ 'Projects': JSON.stringify(prevData) })
      drawProjects(prevData, true)
      removeCustomAlert()

    })
  }

  function deletePaletteProj(projKey, paletteKey){
    paletteKey.replace("amp","")
    chrome.storage.local.get(['Projects'], function (res) {
      let prevData = res.Projects != undefined ? res.Projects : [];
      if (prevData != null && prevData != undefined && prevData.length > 0) {
        prevData = JSON.parse(prevData)
      }
      let project = prevData.filter(x => JSON.parse(x).name == projKey)[0];
      let index = prevData.indexOf(project)
      if (project != undefined)
        project = JSON.parse(project);
      
      project.colorPalettes = project.colorPalettes.filter(x => JSON.parse(x).currentUrl != paletteKey)
      prevData[index] = JSON.stringify(project)

      chrome.storage.local.set({ 'Projects': JSON.stringify(prevData) })
      drawProjects(prevData, true)

    })
  }

  function getProjects() {
    chrome.storage.local.get(['Projects'], function (res) {
      let prevData = res.Projects != undefined ? res.Projects : [];
      if (prevData != null && prevData != undefined && prevData.length > 0) {
        prevData = JSON.parse(prevData)
      }

      if (prevData.length > 0) {
        drawProjects(prevData, true)
      }
    })
  }

  function saveProject() {

    let projName = document.getElementById('input').value
    if (projName) {
      let data = { name: projName, colorPalettes: [], participants: '' }
      chrome.storage.local.get(['Projects'], function (res) {
        let prevData = res.Projects != undefined ? res.Projects : [];
        if (prevData != null && prevData != undefined && prevData.length > 0) {
          prevData = JSON.parse(prevData)
        }

        prevData.push(JSON.stringify(data))
        if (prevData.length > 0) {
          chrome.storage.local.set({ 'Projects': JSON.stringify(prevData) })
          drawProjects([data], false)
          removeCustomAlert()
        }
      })

    }
  }

  function removeProjects(key) {
    key = key.replace("amp;", "")
    chrome.storage.local.get(['Projects'], function (res) {
      let prevData = res.Projects != undefined ? res.Projects : [];
      if (prevData != null && prevData != undefined && prevData.length > 0) {
        prevData = JSON.parse(prevData)
        prevData = prevData.filter(x => JSON.parse(x).name != key);
        chrome.storage.local.set({ 'Projects': JSON.stringify(prevData) })
        drawProjects(prevData, true)
      }
    })
  }

  function drawProjects(data, redraw) {
    let html = !redraw ? document.getElementById('projectContent').innerHTML : '';
    for (let i = 0; i <= data.length - 1; i++) {
      let row = typeof data[i] == 'string' ? JSON.parse(data[i]) : data[i]
      let libraryPalettes = '';
      let colorPalettes = typeof row.colorPalettes == 'string' ? JSON.parse(row.colorPalettes) : row.colorPalettes
      for (let j = 0; j <= colorPalettes.length - 1; j++) {

        let element = typeof colorPalettes[j] == 'string' ? JSON.parse(colorPalettes[j]) : colorPalettes[j];
        libraryPalettes = libraryPalettes + '<div class="card" style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s; width: 100%; border-radius: 20px">' +
          '<div class="container" style="padding: 2px 6px; background-color: #dfdfdf;border-radius:20px;">' +
          '<div style="display:inline;"><h3 style="font-weight: 600;letter-spacing: 0.1em;"><b>' + (new URL(element.currentUrl)).hostname + '</b>' +
          '<span style="display:none" id="currentUrl">' + element.currentUrl + '</span><div class="dropdown" id="dvDetails" style="float:right;display:inline;text-align:center; width:40px;height:25px;border-radius:3px;">' +
          '<span class="dot" style="height: 8px;width: 8px;background-color: #000000;border-radius: 50%;display: inline-block;font-weight: bold;"></span>' +
          '<span class="dot" style="height: 8px;width: 8px;background-color: #000000;border-radius: 50%;display: inline-block;font-weight: bold;"></span>' +
          '<span class="dot" style="height: 8px;width: 8px;background-color: #000000;border-radius: 50%;display: inline-block;font-weight: bold;"></span>' +
          '<div id="myDropdown" class="dropdown-content" style="display:none;position: absolute;background-color: #f1f1f1;width: 60px;overflow: auto;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);z-index: 1;">'+
          '<a id="deletePalette">Delete</a><span style="display: none">' + row.name + '</span></div></div></h3></div>' +
          '<ul class="swatch-list" style="padding-left: 10px; list-style-type: none; ' +
          'margin: 0px; padding: 0px; overflow: hidden;margin-bottom:15px;">' +
          '<li class="mainli" style="line-height: 0.02;  float: left; width: 20%;">' +
          '<div class="swatch" style="width: 100%; height: 30px; background: ' + element.data[0].value + '; overflow: hidden;">' +
          '<div class="swatch-color color-grapefruit" style="position: relative;width: 100%;display: block;"></div></div>' +
          '<div class="swatch-info" style="line-height: 0.02;display:none"><p>' + element.data[0].value + '</p></div>' +
          '</li>' +
          '<li class="mainli" style="line-height: 0.02;  float: left; width: 20%;">' +
          '<div class="swatch" style="width: 100%; height: 30px; background: ' + element.data[1].value + ';overflow: hidden;">' +
          '<div class="swatch-color color-grapefruit" style="position: relative;width: 100%;display: block;"></div></div>' +
          '<div class="swatch-info" style="line-height: 0.02;display:none"><p>' + element.data[1].value + '</p></div>' +
          '</li>' +
          '<li class="mainli" style="line-height: 0.02;  float: left; width: 20%;">' +
          '<div class="swatch" style="width: 100%; height: 30px; background: ' + element.data[2].value + '; overflow: hidden">' +
          '<div class="swatch-color color-grapefruit" style="position: relative;width: 100%;display: block;"></div></div>' +
          '<div class="swatch-info" style="line-height: 0.02;display:none"><p>' + element.data[2].value + '</p></div>' +
          '</li>' +
          '<li class="mainli" style="line-height: 0.02;  float: left; width: 20%;">' +
          '<div class="swatch" style="width: 100%; height: 30px; background: ' + element.data[3].value + ';overflow: hidden">' +
          '<div class="swatch-color color-grapefruit" style="position: relative;width: 100%;display: block;"></div></div>' +
          '<div class="swatch-info" style="line-height: 0.02;display:none"><p>' + element.data[3].value + '</p></div>' +
          '</li>' +
          '<li class="mainli" style="line-height: 0.02;  float: left; width: 20%;">' +
          '<div class="swatch" style="width: 100%; height: 30px; background: ' + element.data[4].value + ';overflow: hidden">' +
          '<div class="swatch-color color-grapefruit" style="position: relative;width: 100%;display: block;"></div></div>' +
          '<div class="swatch-info" style="line-height: 0.02;display:none"><p>' + element.data[4].value + '</p></div>' +
          '</li>' +
          '</ul></div></div><br/>'
      }

      html = html + '<div class="card" style="box-shadow: rgb(0 0 0 / 20%) 0px 4px 8px 0px;background-color: ivory;">' +
        '<div style="display: inline"><h3 style="font-weight: 600; letter-spacing: 0.1em"><b>' + row.name + '</b><span style="display: none" id="currentUrl">' + row.name + '</span>' +
        '<div class="dropdown" id="dvDetails" style="float: right;display: inline;text-align: center;width: 40px;height: 25px;border-radius: 3px;">' +
        '<span class="dot" style="height: 8px;width: 8px; background-color: #000000;border-radius: 50%;display: inline-block;font-weight: bold;">' +
        '</span><span class="dot"style="height: 8px;width: 8px;background-color: #000000;border-radius: 50%;display: inline-block;font-weight: bold;">' +
        '</span><span class="dot"style="height: 8px;width: 8px;background-color: #000000;border-radius: 50%;display: inline-block;font-weight: bold;"></span>' +
        '<div id="myDropdown" class="dropdown-content" style="display: none;background-color: #f1f1f1;width: 150px;height: 50px;overflow: auto;box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);z-index: 1;float: right;line-height: 1.5;">' +
        '<a style="cursor: pointer;" id="deleteLib">Delete</a><br/><a style="cursor: pointer;" id="addPerson">Add participants</a></div></div></h3></div><div><b>Participants:&nbsp;&nbsp;</b>' + row.participants + '</div><br/>' +
        libraryPalettes + '<button id="importPalette" style="background-color: #b9bdbc;color:white;padding: 14px 20px;border:none;cursor: pointer;width: 100%;margin-top: 15px;margin-bottom: 0px">Import library palette</button></div>';
    }

    document.getElementById('projectContent').innerHTML = html
  }

  function addParticipant() {

    var participant = document.getElementById('input').value;
    var colorPalette;

    chrome.storage.local.get(['Projects'], function (res) {
      let prevData = res.Projects != undefined ? res.Projects : [];
      if (prevData != null && prevData != undefined && prevData.length > 0) {
        prevData = JSON.parse(prevData)
      }
      let project = prevData.filter(x => JSON.parse(x).name == projSelected)[0];
      let index = prevData.indexOf(project)
      if (project != undefined)
        project = JSON.parse(project);
      
      //prevData = prevData.filter(x => JSON.parse(x).name != projSelected)
      project.participants = project.participants != "" ? project.participants+","+participant : participant
      prevData[index] = JSON.stringify(project)

      chrome.storage.local.set({ 'Projects': JSON.stringify(prevData) })
      drawProjects(prevData, true)
      removeCustomAlert()

    })
  }

  return (
    <div style={{ position: "relative", width: "100%", "height": "100%" }}>
      <div style={tabSty} className="tab">
        <button id="lib" style={tabBtnSty} className="tablinks active" onClick={onTabClick}>Library</button>
        <button id="proj" style={tabBtnSty} className="tablinks" onClick={onTabClick}>Project</button>

      </div>
      <div id="library" className="tabcontent" style={tabContentSty}>
        <div id="libraryContent" style={{marginBottom:'50px'}}></div>
        <button style={buttonStyle} onClick={generatePalette} >Generate for current website</button>
      </div>
      <div id="project" className="tabcontent" style={tabContentSty}>
        <div id="projectContent" style={{marginBottom:'50px'}}>
        </div>
        <button style={buttonStyle} onClick={openDialog} >Add New Project</button>


      </div>
    </div>
  )
}

export default MainPage
