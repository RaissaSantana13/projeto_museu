'use server';

import { getServerDictionary } from '../../lib/get-dictionary';
import { http } from '@/lib/http';
import {
  getVerifyEmailSchema,
  VerifyEmailResponse,
} from '../../schemas/verify-email-schema';
import { ApiResponse } from '../../type/api';

export async function verifayEmailAction(
  _prevState: ApiResponse<VerifyEmailResponse>,
  payload: { email: string },
): Promise<ApiResponse<VerifyEmailResponse>> {
  const dict = await getServerDictionary();
  const parsed = getVerifyEmailSchema(dict).safeParse(payload);
  if (!parsed.success) {
    return {
      status: 400,
      mensagem: dict.auth.validation.invalidEmail,
    };
  }

  try {
    await http.post(
      '/api/v1/credentials/resend-confirmation',
      { email: parsed.data.email.trim().toLowerCase() },
      { maxRedirects: 0 },
    );
    return {
      status: 200,
      mensagem: dict.auth.verifyEmail.resendSuccess,
    };
  } catch {
    return {
      status: 503,
      mensagem: dict.auth.verifyEmail.resendFailed,
    };
  }
}
