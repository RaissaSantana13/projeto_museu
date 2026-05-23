import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { GenericConverter } from '../../../commons/converter/converter.commons';
import { EmailException } from '../../../commons/excpetions/error/email.exceptions';
import { EntityNotFoundException } from '../../../commons/excpetions/error/entityNotFound.exceptions';
import { Pageable } from '../../../commons/pagination/page.response';
import { Page } from '../../../commons/pagination/paginacao.sistema';
import { ACCOUNT, fieldsAccount } from '../constants/accounts.constants';
import { AccountRequest } from '../dto/request/account.request';
import { AccountResponse } from '../dto/response/account.response';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async listar(
    page: number,
    pageSize: number,
    field: string,
    order: string,
    search?: string,
  ): Promise<Page<AccountResponse>> {
    const pageable = new Pageable(page, pageSize, field, order, fieldsAccount);
    try {
      const query = this.accountRepository
        .createQueryBuilder(ACCOUNT.ENTITY)
        .orderBy(`${ACCOUNT.ENTITY}.${pageable.field}`, pageable.order)
        .skip(pageable.offset)
        .take(pageable.limit);

      if (search) {
        query.where(`${ACCOUNT.ENTITY}.${field} LIKE :search`, {
          search: `%${search}%`,
        });
      }

      const [accounts, totalElements] = await query.getManyAndCount();

      const listaAccounts = GenericConverter.toListResponse(
        AccountResponse,
        accounts,
      );

      return Page.of(listaAccounts, totalElements, pageable);
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  async porId(id: number): Promise<AccountResponse | null> {
    const account = await this.buscarPorId(id);

    if (!account) {
      throw new EntityNotFoundException(
        ACCOUNT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    return GenericConverter.toResponse(AccountResponse, account);
  }

  async salvar(accountRequest: AccountRequest): Promise<AccountResponse> {
    try {
      const novoAccount = GenericConverter.toEntity(Account, accountRequest);

      // 2. IMPORTANTE: Criptografe a senha antes de salvar!
      // Se você usa bcrypt: novoAccount.senha = await bcrypt.hash(accountRequest.senha, 10);
      //novoAccount.senha = await bcrypt.hash(accountRequest.senha, 10);; // Substitua pelo seu método de hash

      const accountSalvo = await this.accountRepository.save(novoAccount);

      return GenericConverter.toResponse(Account, accountSalvo);
    } catch (error: any) {
      // Tratativa para e-mail duplicado (Postgres 23505)
      if (error.code === '23505') {
        throw new EmailException(ACCOUNT.MENSAGEM.EMAIL_CADASTRADO);
      }
      throw new InternalServerErrorException(
        `Erro ao criar usuário: ${error.message}`,
      );
    }
  }

  async atualizar(
    id: number,
    accountRequest: AccountRequest,
  ): Promise<AccountResponse | null> {
    const accountCadastrado = await this.buscarPorId(id);

    if (!accountCadastrado) {
      throw new EntityNotFoundException(
        ACCOUNT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    try {
      const dadosNovos = GenericConverter.toEntity(Account, accountRequest);
      const accountParaSalvar = Object.assign(accountCadastrado, dadosNovos);
      const accountExistente =
        await this.accountRepository.save(accountParaSalvar);

      return GenericConverter.toResponse(Account, accountExistente);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new EmailException(ACCOUNT.MENSAGEM.EMAIL_CADASTRADO);
      }

      throw new InternalServerErrorException(
        `Erro ao processar: ${error.message}`,
      );
    }
  }

  async excluir(id: number): Promise<void> {
    try {
      const account = await this.buscarPorId(id);

      if (!account) {
        throw new EntityNotFoundException(
          ACCOUNT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }

      await this.accountRepository.remove(account);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async buscarPorId(id: number): Promise<Account> {
    try {
      const account = await this.accountRepository
        .createQueryBuilder(ACCOUNT.ENTITY)
        .where(`${ACCOUNT.SEARCH.POR_ID_ACCOUNT} = :id`, { id })
        .getOne();

      if (!account) {
        throw new EntityNotFoundException(
          ACCOUNT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }
      return account;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserAccount(userId: number): Promise<Account> {
    try {
      const account = await this.accountRepository
        .createQueryBuilder(ACCOUNT.ENTITY)
        .where(`${ACCOUNT.SEARCH.POR_ID_USUARIO} = :id`, { userId })
        .getOne();

      if (!account) {
        throw new EntityNotFoundException(
          ACCOUNT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }
      return account;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
