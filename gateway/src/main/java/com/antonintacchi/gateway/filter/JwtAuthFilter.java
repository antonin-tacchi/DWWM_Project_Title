package com.antonintacchi.gateway.filter;

import com.antonintacchi.gateway.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;

    /** Routes accessibles sans token */
    private static final List<String> PUBLIC_PATHS = List.of(
            "/auth/login",
            "/auth/register",
            "/movies",
            "/tv",
            "/actors",
            "/comments",
            "/ratings",
            "/favorites",
            "/lists",
            "/notifications"
    );

    /** Routes réservées aux admins */
    private static final List<String> ADMIN_PATHS = List.of("/admin");

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path      = exchange.getRequest().getURI().getPath();
        boolean isPublic = isPublic(path);
        boolean isAdmin  = isAdmin(path);

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (!jwtUtil.isValid(token)) {
                if (!isPublic) {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }
                return chain.filter(exchange);
            }

            String email  = jwtUtil.extractEmail(token);
            Long   userId = jwtUtil.extractUserId(token);
            String role   = jwtUtil.extractRole(token);

            // Route admin : seul un admin peut y accéder
            if (isAdmin && !"admin".equals(role)) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }

            ServerWebExchange mutatedExchange = exchange.mutate()
                    .request(exchange.getRequest().mutate()
                            .header("X-User-Email",  email)
                            .header("X-User-Id",     String.valueOf(userId))
                            .header("X-User-Role",   role)
                            .build())
                    .build();

            return chain.filter(mutatedExchange);
        }

        // Pas de token → route protégée ou admin → rejet
        if (!isPublic || isAdmin) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        return chain.filter(exchange);
    }

    private boolean isPublic(String path) {
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    private boolean isAdmin(String path) {
        return ADMIN_PATHS.stream().anyMatch(path::startsWith);
    }

    @Override
    public int getOrder() {
        return -1;
    }

}
