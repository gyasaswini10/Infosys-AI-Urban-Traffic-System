package klu.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import klu.repository.UsersRepository;

@Service
public class UsersManager {
	@Autowired
	UsersRepository UR;

	@Autowired
	EmailManager EM;

	@Autowired
	JWTManager JWT;

	public String addUser(Users U) {
		if (UR.validateEmail(U.getEmail()) > 0)
			return "401::Email already exist";

		// Set status based on role
		if (U.getRole() == 1 || U.getRole() == 4) {
			U.setStatus(1); // Auto-approve Admin and Customer
		} else {
			U.setStatus(0); // Pending for Driver and Fleet Manager
		}

		UR.save(U);
		return "200::User Registered Successfully";
	}

	public String recoverPassword(String email) {
		Users U = UR.findById(email).get();
		String message = String.format("Dear %s,\n \n Your Password is: %s", U.getFullname(), U.getPassword());
		return EM.sendEmail(U.getEmail(), "Jobportal: PasswordRecovery", message);
	}

	public String ValidateCredentials(String email, String password) {
		if (UR.validateCresentials(email, password) > 0) {
			Users U = UR.findById(email).get(); // Fetch user to check status
			if (U.getStatus() != null) {
				if (U.getStatus() == 2)
					return "403::Admin has rejected you, contact admin first";
				if (U.getStatus() == 0)
					return "403::Your account is pending Admin approval";
			}
			String token = JWT.generateToken(email);
			return "200::" + token;
		}
		return "401::Invalid Credential(Check Email/Password)";
	}

	public String getFullname(String token) {
		String email = JWT.validateToken(token);
		if (email.compareTo("401") == 0)
			return "401:token Expired!";
		Users U = UR.findById(email).get();
		return U.getFullname();
	}

	public Users getUserDetails(String token) {
		try {
			String email = JWT.validateToken(token);
			if (email.compareTo("401") == 0)
				return null;
			return UR.findById(email).orElse(null);
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}

	public String updateUser(Users U) {
		Users existingUser = UR.findById(U.getEmail()).get();
		existingUser.setFullname(U.getFullname());
		existingUser.setPassword(U.getPassword());
		UR.save(existingUser);
		return "200::Profile Updated Successfully";
	}

	public java.util.List<Users> getUsersByRole(int role) {
		return UR.findByRole(role);
	}

	public java.util.List<Users> getAllUsers() {
		return UR.findAll();
	}

	public String updateUserStatus(String email, int status) {
		Users U = UR.findById(email).get();
		U.setStatus(status);
		UR.save(U);
		return "200::Status Updated";
	}
}
