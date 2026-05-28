package com.antonintacchi.auth.mapper;

import com.antonintacchi.auth.dto.AuthResponse;
import com.antonintacchi.auth.model.UserModel;
import com.antonintacchi.auth.dto.RegisterRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    AuthResponse toAuthResponse(UserModel user);
    UserModel toUser(RegisterRequest request);

}
