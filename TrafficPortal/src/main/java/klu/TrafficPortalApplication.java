package klu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableScheduling
public class TrafficPortalApplication {

  public static void main(String[] args) {
    SpringApplication.run(TrafficPortalApplication.class, args);
  }

  @Bean
  public org.springframework.web.filter.CorsFilter corsFilter() {
    org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
    org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();
    config.setAllowCredentials(true);
    config.addAllowedOrigin("http://localhost:5173");
    config.addAllowedHeader("*");
    config.addAllowedMethod("*");
    source.registerCorsConfiguration("/**", config);
    return new org.springframework.web.filter.CorsFilter(source);
  }
}
