import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { DeepPartial, MoreThan, Not, Repository } from 'typeorm';
import { GenericConverter } from '../../../commons/converter/converter.commons';
import { EntityNotFoundException } from '../../../commons/excpetions/error/entityNotFound.exceptions';
import { Pageable } from '../../../commons/pagination/page.response';
import { Page } from '../../../commons/pagination/paginacao.sistema';
import { fieldsSession, SESSION } from '../constants/session.constants';
import { SessionRequest } from '../dto/request/session.request';
import { SessionResponse } from '../dto/response/session.response';
import { Session } from '../entities/session.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly configService: ConfigService,
  ) {}

  async listar(
    page: number,
    pageSize: number,
    field: string,
    order: string,
    search?: string,
  ): Promise<Page<SessionResponse>> {
    const pageable = new Pageable(page, pageSize, field, order, fieldsSession);
    try {
      const query = this.sessionRepository
        .createQueryBuilder(SESSION.ENTITY)
        .orderBy(`${SESSION.ENTITY}.${pageable.field}`, pageable.order)
        .skip(pageable.offset)
        .take(pageable.limit);

      if (search) {
        query.where(`${SESSION.ENTITY}.${field} LIKE :search`, {
          search: `%${search}%`,
        });
      }

      const [sessions, totalElements] = await query.getManyAndCount();

      const listaSessions = GenericConverter.toListResponse(
        SessionResponse,
        sessions,
      );

      return Page.of(listaSessions, totalElements, pageable);
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  async porId(id: number): Promise<SessionResponse | null> {
    const session = await this.buscarPorId(id);

    if (!session) {
      throw new EntityNotFoundException(
        SESSION.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    return GenericConverter.toResponse(SessionResponse, session);
  }

  async salvar(session: DeepPartial<Session>): Promise<void> {
    if (!session) {
      throw new InternalServerErrorException('Dados da sessão não informados.');
    }
    try {
      const newSession = this.sessionRepository.create(session);
      await this.sessionRepository.save(newSession);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Erro ao criar sessão: ${error.message}`,
      );
    }
  }

  async atualizar(
    id: number,
    sessionRequest: SessionRequest,
  ): Promise<SessionResponse | null> {
    const sessionCadastrado = await this.buscarPorId(id);

    if (!sessionCadastrado) {
      throw new EntityNotFoundException(
        SESSION.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    try {
      const dadosNovos = GenericConverter.toEntity(Session, sessionRequest);

      const sessionParaSalvar = Object.assign(sessionCadastrado, dadosNovos);
      const sessionExistente =
        await this.sessionRepository.save(sessionParaSalvar);

      return GenericConverter.toResponse(SessionResponse, sessionExistente);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Erro ao processar: ${error.message}`,
      );
    }
  }

  async excluir(id: number): Promise<void> {
    try {
      const session = await this.buscarPorId(id);

      if (!session) {
        throw new EntityNotFoundException(
          SESSION.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }

      await this.sessionRepository.remove(session);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async buscarPorId(id: number): Promise<Session> {
    try {
      const session = await this.sessionRepository
        .createQueryBuilder(SESSION.ENTITY)
        .where(`${SESSION.SEARCH.POR_ID} = :id`, { id })
        .getOne();

      if (!session) {
        throw new EntityNotFoundException(
          SESSION.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }
      return session;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async validateSession(token: string): Promise<Session | null> {
    const session = await this.sessionRepository.findOne({
      where: {
        token: token,
        isValid: true,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['usuario'],
    });

    if (!session) {
      return null;
    }
    session.lastUsedAt = new Date();

    return await this.sessionRepository.save(session);
  }

  async createSession(
    usuarioId: number, // No Postgres usamos geralmente number ou uuid
    userAgent: string,
    ipAddress: string,
  ): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const cookieMaxAge = this.configService.get<number>(
      'session.cookieMaxAge',
      604800000,
    );

    const expiresAt = new Date(Date.now() + cookieMaxAge);

    const session = this.sessionRepository.create({
      usuario: { idUsuario: usuarioId },
      token,
      userAgent: userAgent,
      ipAddress,
      expiresAt,
    });

    await this.sessionRepository.save(session);

    return token;
  }

  /**
   * Invalida uma sessão (logout)
   */
  async invalidateSession(token: string): Promise<boolean> {
    const result = await this.sessionRepository.update(
      { token: token },
      { isValid: false },
    );

    const affected = result.affected ?? 0;

    return affected > 0;
  }

  /**
   * Invalida todas as sessões de um usuário
   */
  async invalidateAllSessions(usuarioId: number): Promise<number> {
    const result = await this.sessionRepository.update(
      { usuario: { idUsuario: usuarioId } },
      { isValid: false },
    );

    const affected = result.affected ?? 0;

    return affected;
  }

  /**
   * Obtém todas as sessões ativas de um usuário
   */
  async getUserSessions(usuarioId: number): Promise<Session[]> {
    return this.sessionRepository.find({
      where: {
        usuario: { idUsuario: usuarioId },
        isValid: true,
        expiresAt: MoreThan(new Date()),
      },
      order: { lastUsedAt: 'DESC' },
    });
  }

  /**
   * Obtém sessão por ID
   */
  async getSessionById(sessionId: string): Promise<Session | null> {
    return this.sessionRepository.findOneBy({ idSession: sessionId });
  }

  /**
   * Invalida uma sessão específica por ID (com verificação de posse)
   */
  async invalidateSessionById(
    sessionId: string,
    usuarioId: number,
  ): Promise<boolean> {
    const result = await this.sessionRepository.update(
      {
        idSession: sessionId,
        usuario: { idUsuario: usuarioId },
        isValid: true,
      },
      { isValid: false },
    );

    const affected = result.affected ?? 0;
    if (affected > 0) {
      return true;
    }

    return false;
  }

  /**
   * Invalida todas as sessões exceto a atual
   */
  async invalidateAllSessionsExcept(
    usuarioId: number,
    exceptToken: string,
  ): Promise<number> {
    const result = await this.sessionRepository.update(
      {
        usuario: { idUsuario: usuarioId },
        token: Not(exceptToken),
        isValid: true,
      },
      { isValid: false },
    );

    const affected = result.affected ?? 0;

    return affected;
  }

  /**
   * Busca sessão pelo token
   */
  async getSessionByToken(token: string): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: { token: token },
    });
  }
}
