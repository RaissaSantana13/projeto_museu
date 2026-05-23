import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { EmailException } from '../../../commons/excpetions/error/email.exceptions';
import { MailPayload } from '../config/mail-options';
import { TemplateService } from './email.template.service';

@Injectable()
export default class EmailService {
  private nodemailerTransport: Mail;
  constructor(
    private readonly configService: ConfigService,
    private templateService: TemplateService,
  ) {
    this.nodemailerTransport = createTransport({
      host: this.configService.getOrThrow<string>('EMAIL_HOST'),
      port: this.configService.getOrThrow<number>('EMAIL_PORT'),
      secure: this.configService.getOrThrow<boolean>('EMAIL_SECURE'),
      auth: {
        user: this.configService.getOrThrow<string>('EMAIL_USER'),
        pass: this.configService.getOrThrow<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(options: MailPayload): Promise<void> {
    if (!options.from) {
      throw new EmailException(
        'SMTP_FROM environment variable is not configured',
      );
    }

    if (options.context) {
      Object.entries(options.context).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        if (options.html)
          options.html = options.html.replace(regex, String(value));
        options.text = options.text.replace(regex, String(value));
      });
    }

    if (options.template && options.context) {
      const { html, error } = this.templateService.compile(
        options.template,
        options.context,
      );
      if (error) {
        console.error(
          `Failed to compile email template '${options.template}': ${error}`,
        );
        return;
      }
      options.html = html;
    }

    try {
      await this.nodemailerTransport.sendMail({
        from: options.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      });
    } catch (error) {
      throw new Error(
        `Failed to send email: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async sendRegisterConfirmation(email: string, name: string, token: string) {
    const url = `${this.configService.getOrThrow<string>('REGISTER_CONFIRMATION')}?token=${token}`;
    return this.prepareAndSend(
      email,
      'Verifique seu E-mail',
      'Confirmação de Registro',
      'Obrigado por se registrar! Use o link abaixo para ativar sua conta:',
      url,
      name,
    );
  }

  async sendResendEmail(email: string, name: string, token: string) {
    const url = `${this.configService.getOrThrow<string>('RESEND_EMAIL')}?token=${token}`;
    return this.prepareAndSend(
      email,
      'Novo Link de Ativação',
      'Reenvio de E-mail',
      'Você solicitou um novo link. Clique abaixo para verificar seu endereço:',
      url,
      name,
    );
  }

  async sendresetPassword(email: string, name: string, token: string) {
    const url = `${this.configService.getOrThrow<string>('RESET_PASSWORD')}?token=${token}`;
    return this.prepareAndSend(
      email,
      'Recuperação de Senha',
      'Redefinir Senha',
      'Recebemos um pedido para alterar sua senha. Se não foi você, ignore este e-mail:',
      url,
      name,
    );
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const url = `${this.configService.getOrThrow<string>('VERIFICATION_EMAIL')}?token=${token}`;
    return this.prepareAndSend(
      email,
      'Verificação de Identidade',
      'Verificar Conta',
      'Por favor, confirme sua identidade clicando no botão abaixo:',
      url,
      name,
    );
  }

  async sendEmailConfirmed(email: string, name: string) {
    const url = this.configService.getOrThrow<string>('EMAIL_CONFIRMED');
    return this.prepareAndSend(
      email,
      'Verificação de E-mail',
      'Verificar situação do E-mail',
      'O seu e-mail já está confirmado no sistema',
      url,
      name,
    );
  }

  async sendChangePassword(email: string, name: string) {
    const url = this.configService.getOrThrow<string>('CHANGE_PASSWORD');
    return this.prepareAndSend(
      email,
      'Sua senha foi alterada',
      'Senha Alterada',
      'A senha da sua conta foi modificada com sucesso. Se você não realizou esta ação, recupere seu acesso imediatamente:',
      url,
      name,
    );
  }

  private async prepareAndSend(
    to: string,
    subject: string,
    title: string,
    message: string,
    url: string,
    name: string,
  ) {
    const context = { name, url, title, message };

    // Geramos o HTML usando o template base e os dados dinâmicos
    const html = this.generateHtml(title, message);
    const text = `Olá ${name},\n\n${message}\n\nLink: ${url}`;

    return this.sendMail({
      to,
      from: this.configService.getOrThrow<string>('EMAIL_FROM'),
      subject,
      text,
      html,
      context,
    });
  }

  // --- GERADOR DE TEMPLATE (MÉTODO PADRÃO) ---

  private generateHtml(title: string, message: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #007bff;">${title}</h2>
            <p>Olá <strong>{{name}}</strong>,</p>
            <p>${message}</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{url}}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Acessar Link
              </a>
            </div>
            <p style="font-size: 12px; color: #777;">Se o botão não funcionar, copie este link: {{url}}</p>
          </div>
        </body>
      </html>
    `;
  }
}
