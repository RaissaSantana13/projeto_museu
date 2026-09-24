'use client';

import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { Card, CardContent } from '../ui/card';

interface AuthProps extends ComponentProps<'div'> {
  imgSrc?: string;
  imgClassName?: string;
}

export function Auth({
  className,
  children,
  imgSrc,
  imgClassName,
  ...props
}: AuthProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto p-6 md:p-8 shadow-lg border rounded-2xl h-auto">
        <CardContent className="p-0">
          <section
            className={cn(
              'container w-full flex justify-center px-0',
              className,
            )}
            {...props}
          >
            <div className="w-full flex justify-center">
              <div className="max-w-md w-full px-4 py-6 space-y-6">
                {children}
              </div>
            </div>
            {imgSrc && (
              <AuthImage imgSrc={imgSrc} className={cn('', imgClassName)} />
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

interface AuthImageProps extends ComponentProps<'div'> {
  imgSrc: string;
}

export function AuthImage({ className, ...props }: AuthImageProps) {
  return (
    <div
      className={cn(
        'basis-1/2 relative hidden min-h-screen bg-muted md:block',
        className,
      )}
      {...props}
    >
      {/* <Image src={imgSrc} alt="Image" fill sizes="(max-width: 1200px) 60vw, 38vw" priority className="object-cover" /> */}
    </div>
  );
}

export function AuthHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('space-y-2 text-center', className)} {...props} />;
}

interface AuthTitleProps extends ComponentProps<'h1'> {
  headingId?: string;
}

export function AuthTitle({ className, headingId, ...props }: AuthTitleProps) {
  return (
    <h1
      id={headingId}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className,
      )}
      {...props}
    />
  );
}

export function AuthDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}

export function AuthForm({ className, ...props }: ComponentProps<'div'>) {
  return <div className={className} {...props} />;
}

export function AuthFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('grid gap-6', className)} {...props} />;
}
