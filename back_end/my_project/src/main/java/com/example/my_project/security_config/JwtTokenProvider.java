package com.example.my_project.security_config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.my_project.entity.User;

@Component
public class JwtTokenProvider {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME;

    private SecretKey getSigningKey() {
        logger.info("Khóa bí mật: {}", SECRET_KEY.substring(0, 5) + "...");
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        logger.info("Đang xác thực token: {}", token);
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (SignatureException e) {
            logger.error("Chữ ký không hợp lệ: {}", e.getMessage());
            throw new IllegalArgumentException("Token có chữ ký không hợp lệ");
        } catch (ExpiredJwtException e) {
            logger.error("Token hết hạn: {}", e.getMessage());
            throw new IllegalArgumentException("Token đã hết hạn");
        } catch (JwtException e) {
            logger.error("Lỗi phân tích token: {}", e.getMessage());
            throw new IllegalArgumentException("Lỗi khi phân tích token");
        }
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = getUsernameFromToken(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            Date expiration = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (JwtException e) {
            return true;
        }
    }
}