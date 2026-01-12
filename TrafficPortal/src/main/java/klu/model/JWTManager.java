package klu.model;

import java.util.Date;


import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTManager {

	@Value("${security.jwt.secret}")
	private String secKey;

	private SecretKey key;

	@PostConstruct
	public void init() {
		this.key = Keys.hmacShaKeyFor(secKey.getBytes());
	}

	public String generateToken(String email) {
		Map<String, Object> data = new HashMap<>();
		data.put("email", email);
		return Jwts.builder()
				.setClaims(data)
				.setIssuedAt(new Date())
				.setExpiration(new Date(new Date().getTime() + 3600000))
				.signWith(key)
				.compact();
	}

	public String validateToken(String token) {
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token)
				.getBody();
		Date expiry = claims.getExpiration();
		if (expiry == null || expiry.before(new Date()))
			return "401";
		return claims.get("email", String.class);
	}
}