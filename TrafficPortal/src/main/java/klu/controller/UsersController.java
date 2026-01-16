package klu.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import klu.model.Users;
import klu.model.UsersManager;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/users")
public class UsersController {

	@Autowired
	UsersManager um;

	@PostMapping("/signup")
	public String signup(@RequestBody Users U) {
		return um.addUser(U);
	}

	@PostMapping("/signin")
	public String signin(@RequestBody Users U) {
		return um.ValidateCredentials(U.getEmail(), U.getPassword());
	}

	@GetMapping("/forgotpassword/{email}")
	public String forgotPassword(@PathVariable("email") String emailid) {

		return um.recoverPassword(emailid);
	}

	@PostMapping("/getfullname")
	public String getFullname(@RequestBody Map<String, String> data) {
		return um.getFullname(data.get("csrid"));
	}

	@PostMapping("/getdetails")
	public Users getUserDetails(@RequestBody Map<String, String> data) {
		return um.getUserDetails(data.get("csrid"));
	}

	@PostMapping("/update")
	public String updateUser(@RequestBody Users U) {
		return um.updateUser(U);
	}

	@GetMapping("/role/{roleId}")
	public java.util.List<Users> getUsersByRole(@PathVariable("roleId") int roleId) {
		return um.getUsersByRole(roleId);
	}

	@PostMapping("/updateStatus")
	public String updateUserStatus(@RequestBody Map<String, Object> payload) {
		String email = (String) payload.get("email");
		int status = Integer.parseInt(payload.get("status").toString());
		return um.updateUserStatus(email, status);
	}

}