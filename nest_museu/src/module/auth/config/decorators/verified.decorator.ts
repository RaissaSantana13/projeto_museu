import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { VerifiedGuard } from '../guards/verified.guard';

export const Verified = () => UseGuards(AuthGuard, VerifiedGuard);
