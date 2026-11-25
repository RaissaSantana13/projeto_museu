import { http } from '../../lib/http';
import { ForgotPasswordResponse } from '../../schemas/forgot-passward-schema';
import {
  NewPasswordCreate,
  NewPasswordResponse,
} from '../../schemas/new-passward-schema';
import {
  RegisterCreate,
  RegisterResponse,
} from '../../schemas/register-schemas';
import { LoginRequest, LoginResponse } from '../../schemas/sigin-schemas';
import { ApiResponse } from '../../type/api';
import { ConnectionService } from './ConnectionService';

export class AuthService extends ConnectionService<LoginResponse> {
  constructor(ENTITY: string) {
    super(ENTITY);
  }

  async signIn(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await http.post<ApiResponse<LoginResponse>>(
      this.url,
      credentials,
      {
        ...this.config,
      },
    );
    return response.data;
  }

  async signInWithCookies(credentials: LoginRequest) {
    const response = await http.post<ApiResponse<LoginResponse>>(
      this.url,
      credentials,
      { ...this.config },
    );
    return {
      body: response.data,
      setCookies: (response.headers['set-cookie'] ?? []) as string[],
    };
  }

  async me(): Promise<ApiResponse<LoginResponse>> {
    const response = await http.get<ApiResponse<LoginResponse>>(this.url, {
      ...this.config,
    });
    return response.data;
  }

  async logout(): Promise<ApiResponse<LoginResponse>> {
    const response = await http.delete<ApiResponse<LoginResponse>>(this.url, {
      ...this.config,
    });
    return response.data;
  }

  async newPassword(
    newPasswordRequest: NewPasswordCreate,
  ): Promise<ApiResponse<NewPasswordResponse>> {
    const response = await http.put<ApiResponse<NewPasswordResponse>>(
      this.url,
      newPasswordRequest,
      {
        ...this.config,
      },
    );
    return response.data;
  }

  async register(
    registerRequest: RegisterCreate,
  ): Promise<ApiResponse<RegisterResponse>> {
    const response = await http.post<ApiResponse<RegisterResponse>>(
      this.url,
      registerRequest,
      {
        ...this.config,
      },
    );
    return response.data;
  }

  async verifyEmail(email: string): Promise<ApiResponse<RegisterResponse>> {
    const response = await http.put<ApiResponse<RegisterResponse>>(
      this.url,
      email,
      {
        ...this.config,
      },
    );
    return response.data;
  }

  async forgotPassword(
    email: string,
  ): Promise<ApiResponse<ForgotPasswordResponse>> {
    const response = await http.put<ApiResponse<ForgotPasswordResponse>>(
      this.url,
      email,
      {
        ...this.config,
      },
    );
    return response.data;
  }
}
