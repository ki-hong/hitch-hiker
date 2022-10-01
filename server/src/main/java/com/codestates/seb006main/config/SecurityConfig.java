package com.codestates.seb006main.config;

import com.codestates.seb006main.jwt.JwtUtils;
import com.codestates.seb006main.jwt.filter.JwtAuthenticationFilter;
import com.codestates.seb006main.jwt.filter.JwtAuthorizationFilter;
import com.codestates.seb006main.members.repository.MemberRepository;
import com.codestates.seb006main.oauth.CustomOAuth2SuccessHandler;
import com.codestates.seb006main.oauth.CustomOAuth2Service;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@Order(3)
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final MemberRepository memberRepository;
    private final JwtUtils jwtUtils;
    private final CustomOAuth2Service customOAuth2Service;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.headers().frameOptions().disable();
        http
                .formLogin().disable()
                .httpBasic().disable()
                .apply(new CustomDsl())
                .and()
                .authorizeRequests(authorize -> authorize
//                        .antMatchers(HttpMethod.GET).access("hasRole('ROLE_MEMBER')")
                        .antMatchers(HttpMethod.POST,"/api/posts/**").access("hasRole('ROLE_MEMBER')")
                        .antMatchers(HttpMethod.PATCH,"/api/posts/**","/api/members/**").access("hasRole('ROLE_MEMBER')")
                        .antMatchers(HttpMethod.DELETE,"/api/posts/**","/api/members/**").access("hasRole('ROLE_MEMBER')")
                        .anyRequest().permitAll())
                .oauth2Login()
                .successHandler(oAuth2AuthenticationSuccessHandler())
                .userInfoEndpoint()
                .userService(customOAuth2Service);

        return http.build();
    }

    public class CustomDsl extends AbstractHttpConfigurer<CustomDsl, HttpSecurity> {

        @Override
        public void configure(HttpSecurity builder) throws Exception {
            AuthenticationManager authenticationManager = builder.getSharedObject(AuthenticationManager.class);
            builder
                    .addFilter(corsFilter())
                    .addFilter(new JwtAuthenticationFilter(authenticationManager, jwtUtils))
                    .addFilter(new JwtAuthorizationFilter(authenticationManager, memberRepository, jwtUtils));
        }


    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addExposedHeader("Access_HH");
        config.addExposedHeader("Refresh_HH");
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CustomOAuth2SuccessHandler oAuth2AuthenticationSuccessHandler(){
        return new CustomOAuth2SuccessHandler(jwtUtils,memberRepository);
    }
}
