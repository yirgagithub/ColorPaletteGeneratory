import React from 'react'
import { useNavigate } from "react-router-dom";

const Home = () => {
  
  let navigate = useNavigate();

  React.useEffect(() => {
    chrome.runtime.sendMessage({command: "auth_check", data:''}, (response) =>{
      if(response && response.status == 'success'){
        console.log('check auth response', response)
        navigate("/main")
      }else if(response.status == 'error'){
      
      }
      
    })
  })
  return (
    <div>
      <button id="my_sign_in" className='sign_in_no_hover' onClick={() => navigate("/login")}>Sign In</button>
      <br></br>
      <button id="my_signup_up" className='sign_in_no_hover' onClick={() => navigate("/signup")}>
          Sign Up
      </button>
    </div>

  )
}

export default Home
