package com.antonintacchi.auth.mapper;

import com.antonintacchi.auth.dto.AuthResponse;
import com.antonintacchi.auth.entity.User;
import com.antonintacchi.auth.dto.RegisterRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    AuthResponse toAuthResponse(User user);
    User toUser(RegisterRequest request);

}
