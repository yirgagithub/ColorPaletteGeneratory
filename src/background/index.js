import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get } from "firebase/database";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyColpBA3TmfP0D0ZPonYkDpFpTZRj5sPEo",
  authDomain: "color-palette-generator-d0c5c.firebaseapp.com",
  projectId: "color-palette-generator-d0c5c",
  storageBucket: "color-palette-generator-d0c5c.appspot.com",
  messagingSenderId: "376974756011",
  appId: "1:376974756011:web:37d9e0673a99d68d8c8fee"
};

const firebase = initializeApp(firebaseConfig);


console.log('background script logic here...')
console.log('firebase app', firebase)


  chrome.contextMenus.remove('MyItem', function () {
    chrome.contextMenus.create({
      title: 'Generate Color Palette',
      id: 'MyItem',
      onclick: function (e) {
        generatePalette();
      }

    }, function () { })
  })


function generatePalette() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentUrl = tabs[0].url
    chrome.tabs.sendMessage(tabs[0].id, { "command": "get_colors" }, function (response) {
      var colors = response.message;
      console.log('colors', JSON.stringify(colors))
      let prevData = []
      let data = { currentUrl: currentUrl, data: colors }
      chrome.storage.local.get(['ColorPalette'], function (res) {
        prevData = res.ColorPalette != undefined ? res.ColorPalette : [];
        if (prevData != null && prevData != undefined && prevData.length > 0) {
          prevData = JSON.parse(prevData)
        }

        prevData.push(JSON.stringify(data))
        if (prevData.length > 0) {
          chrome.storage.local.set({ 'ColorPalette': JSON.stringify(prevData) })
        }


      })

    });
  });
}
}


chrome.runtime.onConnect.addListener(function (port) {
  console.log(port.name, "connected");

  if (port.name === 'BrowserAction') {
    console.log(port.name, "BrowserAction");
  }

});


chrome.runtime.onMessage.addListener(function (message, sender, response) {
  if (message.command == 'login') {
    console.log('login button')

    const auth = getAuth();
    signInWithEmailAndPassword(auth, message.data.email, message.data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          response({ type: 'auth', status: 'success', message: true })
        }
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        response({ type: 'auth', status: "error", message: errorMessage })
      });

    return true;
  } else if (message.command == 'auth_check') {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      response({ type: 'auth', status: 'success', message: user })
    } else {
      response({ type: 'auth', status: 'error', message: false })
    }

    return true;
  } else if (message.command == 'register') {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, message.data.email, message.data.password)
      .then((userCredential) => { 
        const user = userCredential.user;
        if(user)
          response({ type: 'auth', status: 'success', message: true })
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        response({ type: 'auth', status: "error", message: errorMessage })
      });
      return true;
  }
});
