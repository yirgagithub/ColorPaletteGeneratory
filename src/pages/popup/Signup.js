import React from 'react' 
import { useNavigate } from "react-router-dom";

const Signup = () => {

  let navigate = useNavigate();

  const inputStyle = {
    width: "100%",
    padding: "12px 20px",
    margin: "8px 0",
    display: "inline-block",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    backgroundColor: "#b9bdbc",
    color: "white",
    padding: "14px 20px",
    margin: "8px 0",
    border: "none",
    cursor: "pointer",
    width: "100%",
  }

  function onRegisterClick(){
    var email = document.getElementById("username").value
    var password = document.getElementById("password").value
    chrome.runtime.sendMessage({command: "register", data:{email: email, password: password}}, (response) =>{
      if(response && response.status == 'success'){
        alert('User successfully registered. Login and enjoy')
        navigate("/login")
      }else if(response.status == 'error'){
        document.getElementById('loginError').style.display = 'block'
        document.getElementById('loginError').innerHTML = response.message;
      }
      
    })
  }

  function onInputClick(){
    document.getElementById('loginError').style.display = 'none'
  }

  function onLoginClickR(){
    navigate("/login")
  }


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

  React.useEffect(() => {
    if(document.getElementById) {
      window.alert = function(txt) {
        createCustomAlert(txt);
      }
    }
  })

return (
  <div>
    <h2>Signup Form</h2>

      <div className="imgcontainer">
        <h3>Register</h3>
      </div>

      <div className="container">
        <label htmlFor='uname'><b>Email</b></label>
        <input style={inputStyle} type="text" placeholder="Enter Username" name="uname" id="username" required />

        <label htmlFor='psw'><b>Password</b></label>
        <input style={inputStyle} type="password" placeholder="Enter Password" name="psw" id="password" required />
        <span style={{color:'red',display:'none'}} id="loginError"></span>
        <button style={buttonStyle} onClick={onRegisterClick} >Register</button>

      </div>

    <button onClick={onLoginClickR} >Login</button>

  </div>

)
}

export default Signup
