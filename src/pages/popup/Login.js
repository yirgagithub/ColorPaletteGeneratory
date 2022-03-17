import React from 'react'
import { useNavigate } from "react-router-dom";

const Login = () => {

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

  function onLoginClick(){
    var email = document.getElementById("username").value
    var password = document.getElementById("password").value
    chrome.runtime.sendMessage({command: "login", data:{email: email, password: password}}, (response) =>{
      if(response && response.status == 'success'){
        console.log('response', response)
        navigate("/main")
      }else if(response.status == 'error'){
        document.getElementById('loginError').style.display = 'block'
      }
      
    })
  }

  function onInputClick(){
    document.getElementById('loginError').style.display = 'none'
  }

  function onRegisterClickL(){
    navigate("/signup")
  }

return (


  <div>
    <h2>Login Form</h2>

      <div className="imgcontainer">
        <h3>Login</h3>
      </div>

      <div className="container">
        <label htmlFor='uname'><b>Email</b></label>
        <input onClick={onInputClick} style={inputStyle} type="email" placeholder="Enter Username" name="uname" id="username" required />

        <label htmlFor='psw'><b>Password</b></label>
        <input onClick={onInputClick} style={inputStyle} type="password" placeholder="Enter Password" name="psw" id="password" required />
        <span style={{color:'red',display:'none'}} id="loginError">Incorrect username or password</span>
        <button style={buttonStyle} onClick={onLoginClick} >Login</button>

      </div>
      <button onClick={onRegisterClickL} >Register Instead</button>

  </div>

)
}

export default Login
