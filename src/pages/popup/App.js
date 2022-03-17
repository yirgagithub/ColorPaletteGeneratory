import React from 'react'
import Login from './Login.js'
import Routes from './Routes'

class App extends React.Component {
  constructor(){
    super();
  }

  render(){
  return (
    <div id='main' style={{width: "100%", "height": "100%"}}>
     <Routes />
    
    </div>

  )
}
}

export default App
