import React, { Component } from 'react'
import '../css/Projecthomepage.css'
import { BASEURL, callApi, setSession } from '../api';


  

export class Homepage extends Component {
 
  constructor(){
    super();
    this.userRegistration=this.userRegistration.bind(this);
    this.forgotPassword=this.forgotPassword.bind(this);
    this.signin=this.signin.bind(this);
this.forgotPasswordResponse=this.forgotPasswordResponse.bind(this);

  }
  showSignin(){
    let popup =document.getElementById("popup");
    let signin =document.getElementById("signin");
    let signup =document.getElementById("signup");
    let popupHeader =document.getElementById("popupHeader");
    popupHeader.innerHTML="Login";
    signin.style.display="block";
    signup.style.display="none";
    popup.style.display="block";

    username.value="";
    password.value="";
  }
  showSignup(){
    let popup =document.getElementById("popup");
    let signin =document.getElementById("signin");
    let signup =document.getElementById("signup");
    let popupHeader =document.getElementById("popupHeader");
    popupHeader.innerHTML="Signup";
    signin.style.display="none";
    signup.style.display="block";
    popup.style.display="block";

    let fullname = document.getElementById("fullname");
    let email = document.getElementById("email");
    let role = document.getElementById("role");
    let  signuppassword = document.getElementById("signuppassword");
    let confirmpassword = document.getElementById("confirmpassword");
    fullname.value="";
    email.value="";
    role.value="";
    signuppassword.value="";
    confirmpassword.value="";
  }


  closeSignin(event){
    if(event.target.id === "popup"){
      let popup=document.getElementById("popup");
      popup.style.display="none";

    }
  }
  userRegistration()
  {
        let fullname = document.getElementById("fullname");
        let email = document.getElementById("email");
        let role = document.getElementById("role");
        let  signuppassword = document.getElementById("signuppassword");
        let confirmpassword = document.getElementById("confirmpassword");

        let missingFields = [];

        fullname.style.border = "";
        email.style.border = "";
        role.style.border = "";
        signuppassword.style.border = "";
        confirmpassword.style.border = "";

        if(fullname.value.trim() === "") {
          fullname.style.border = "1px solid red";
          missingFields.push("Full Name");
        }
        if(email.value.trim() === "") {
          email.style.border = "1px solid red";
          missingFields.push("Email");
        }
        if(role.value === "") {
          role.style.border = "1px solid red";
          missingFields.push("Role");
        }
        if(signuppassword.value === "") {
          signuppassword.style.border = "1px solid red";
          missingFields.push("Password");
        }
        if(confirmpassword.value === "") {
          confirmpassword.style.border = "1px solid red";
          missingFields.push("Confirm Password");
        }

        if(missingFields.length > 0) {
          alert("Please fill the following fields: " + missingFields.join(", "));
          return;
        }

        if(signuppassword.value !== confirmpassword.value) {
           alert("Passwords do not match!");
           signuppassword.style.border = "1px solid red";
           confirmpassword.style.border = "1px solid red";
           return;
        }

  


        var data = JSON.stringify({
              fullname : fullname.value,
              email : email.value,
              role : role.value,
              password : signuppassword.value
        })
        callApi("POST", "http://localhost:8080/users/signup", data, this.getResponse)
  }
  getResponse(res){
    let resp = res.split('::');
    alert(resp[1]);
    if (resp[0] === "200")
      {
          let signin = document.getElementById("signin");
          let signup = document.getElementById("signup");
          signin.style.display = "block";
          signup.style.display = "none";
      }
  }

  forgotPassword(){
    username.style.border="";
    if(username.value===""){
      username.style.border="1px solid red";
      username.focus()
      return;
    }
    let url="http://localhost:8080/users/forgotpassword/" + username.value;
    callApi("GET", url,"",this.forgotPasswordResponse);
  }
  forgotPasswordResponse(res){
  let responseDiv=document.getElementById("responseDiv");
  let data=res.split("::");

  if(data[0]==="200")
    responseDiv.innerHTML=`<label style='color:green'>${data[1]}</label>`;
  else
    responseDiv.innerHTML=`<label style='color:red'>${data[1]}</label>`;

  }

  signin(){
    let missingFields = [];

    username.style.border = "";
    password.style.border = "";
    responseDiv.innerHTML = "";

    if (username.value.trim() === "") {
        username.style.border = "1px solid red";
        missingFields.push("Email");
    }
    if (password.value === "") {
        password.style.border = "1px solid red";
        missingFields.push("Password");
    }

    if (missingFields.length > 0) {
        alert("Please fill the following fields: " + missingFields.join(", "));
        return;
    }
    let data=JSON.stringify({
      email:username.value,
      password:password.value

    });
    callApi("POST", BASEURL+"users/signin",data,this.signinResponse);

  }
  signinResponse(res){
    let rdata=res.split('::');
    if(rdata[0]==='200'){
      setSession("csrid", rdata[1],1);
      window.location.replace("/dashboard");
    }
    else{
      responseDiv.innerHTML=`<br /><br /><label style ="color:red">${rdata[1]}</label>`;
    }

  }

  render() {
    return (
      <div id='base'>
          <div id='popup' onClick={this.closeSignin}>
            <div className='popupWindow'>
             <div id ='popupHeader'>LogIn</div>
             <div id ='signin'>
              <label className='usernameLabel'>Email</label>
              <input type='text' id='username'/>
              <label className='passwordLabel'>Password</label>
              <input type='password' id='password'/>
              <div className='ForgotPassword'>Forgot <label onClick={this.forgotPassword}>Password?</label></div> 
              <button className='signinButton' onClick={this.signin}>Sign In</button>
              <div className='div1' id='responseDiv'></div> 
              <div className='div2'>
              Dont have an Account?
              <label onClick={this.showSignup}>Sign Up Now</label>
              </div>
               
             
            
             </div>  
             <div id='signup'>
            <label>Full Name :</label>
            <input type='text' id='fullname'/>
            <label>Email :</label>
            <input type='email' id='email'/>
            <label>Select Role :</label>
            <select id='role'>
              <option value=''></option>
              <option value='1'>Admin</option>
              <option value='2'>Manager</option>
              <option value='3'>Driver</option>
              <option value='4'>Customer</option>
            </select>
            <label>Password :</label>  
            <input type='password' id='signuppassword'/>
            <label>Confirm Password:</label>
            <input type='password' id ="confirmpassword" />
            <button onClick={this.userRegistration}>Register Now</button>
            <div>Already have  an Account?<span onClick={this.showSignin}>SIGN IN</span></div>



           </div>
           </div>
           
      </div>
          
            
       
          



        <div id='header'>
          <img className='logo' src='./../../public/images/traffic-symbol-icon-png-1.png' alt='no'/>
          <img className='signinIcon' src='./images/user.png' alt='sign' onClick={this.showSignin}/>
          <label className='signinText' onClick={this.showSignin}>Sign In</label>


        </div>


       <div id='content'>
  <div className='text1'>NeuroFleetX – AI-Driven Urban Mobility Optimization</div>
  <div className='text2'>Smart traffic, smarter cities</div>
  <div className='text3'>Real-time traffic monitoring • AI routing • Fleet intelligence</div>

  <div className='searchBar'>
    <input type='text' className='searchText' placeholder='Search route / vehicle / area'/>
    <input type='text' className='searchLocation' placeholder='City or zone'/>
    <button className='searchButton'>Analyze Traffic</button>
  </div>
</div>




        </div>
    )
  }
}




export default Homepage