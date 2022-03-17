import React from 'react'
import { useNavigate } from "react-router-dom";

const Dialog = () => {
  
  let navigate = useNavigate();

  React.useEffect(() => {
   
  })

  function createCustomAlert(txt) {
    let d = document;
  
    if(d.getElementById("modalContainer")) return;
  
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
    alertObj.style.width ="300px";
    alertObj.style.minHeight = "100px";
    alertObj.style.marginTop = "50px";
    alertObj.style.border ="1px solid #666";
    alertObj.style.backgroundColor="#fff";
    alertObj.style.backgroundRepeat="no-repeat";
    alertObj.style.backgroundPosition="20px 30px";

    if(d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
    alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth)/2 + "px";
    alertObj.style.visiblity="visible";
  
    let h1 = alertObj.appendChild(d.createElement("h1"));
    h1.appendChild(d.createTextNode(""));
  
    let msg = alertObj.appendChild(d.createElement("p"));
    msg.style.font="1.5em verdana,arial";
    msg.style.height="50px";
    msg.style.paddingLeft="5px";
    msg.style.marginLeft="55px";
    //msg.appendChild(d.createTextNode(txt));
    msg.innerHTML = txt;
  
    let btn = alertObj.appendChild(d.createElement("a"));
    btn.id = "closeBtn";
    btn.style.display="block";
	  btn.style.position="relative";
	  btn.style.margin="5px auto";
	  btn.style.padding="7px";
	  btn.style.border="none";
	  btn.style.width="70px";
	  btn.style.font="0.7em verdana,arial";
    btn.style.textTransform="uppercase";
    btn.style.textAlign="center";
    btn.style.color="#FFF"
    btn.style.backgroundColor="#357EBD";
    btn.style.borderRadius="3px";
    btn.style.textDecoration="none";

    btn.appendChild(d.createTextNode('Ok'));
    btn.href = "#";
    btn.focus();
    btn.onclick = function() { removeCustomAlert();return false; }
  
    alertObj.style.display = "block";
    
  }

  function removeCustomAlert() {
    document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
  }


  return (
    <div>
    </div>

  )
}

export default Dialog
