import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from '../../../commons/exceptions/error/entity-not-found.exception';
import { Pageable } from '../../../commons/pagination/page.response';
import { Page } from '../../../commons/pagination/pagination.sistema';
import { CONTACT, fieldsContact } from '../constants/contact.constantes';
import { ContactConverter } from '../dto/converter/contact.converter';
import { ContactRequest } from '../dto/request/contact.request';
import { ContactResponse } from '../dto/response/contact.response';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async listar(
    page: number,
    pageSize: number,
    field: string,
    order: string,
    search?: string,
  ): Promise<Page<ContactResponse>> {
    const pageable = new Pageable(page, pageSize, field, order, fieldsContact);
    try {
      const query = this.contactRepository
        .createQueryBuilder(CONTACT.ENTITY)
        .orderBy(`${CONTACT.ENTITY}.${pageable.field}`, pageable.order)
        .skip(pageable.offset)
        .take(pageable.limit);

      if (search) {
        query.where(`${CONTACT.ENTITY}.${field} LIKE :search`, {
          search: `%${search}%`,
        });
      }

      const [contacts, totalElements] = await query.getManyAndCount();

      const listaContacts = ContactConverter.toListContactResponse(contacts);

      return Page.of(listaContacts, totalElements, pageable);
    } catch (error: any) {
      throw new InternalServerErrorException(error);
    }
  }

  async porId(id: number): Promise<ContactResponse | null> {
    const contact = await this.buscarPorId(id);

    if (!contact) {
      throw new EntityNotFoundException(
        CONTACT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    return ContactConverter.toContactResponse(contact);
  }

  async salvar(contactRequest: ContactRequest): Promise<ContactResponse> {
    try {
      const novoContact = ContactConverter.toContact(contactRequest);

      // 2. IMPORTANTE: Criptografe a senha antes de salvar!
      // Se você usa bcrypt: novoContact.senha = await bcrypt.hash(contactRequest.senha, 10);

      const contactSalvo = await this.contactRepository.save(novoContact);

      return ContactConverter.toContactResponse(contactSalvo);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Erro ao salvar contato: ${error.message}`,
      );
    }
  }

  async atualizar(
    id: number,
    contactRequest: ContactRequest,
  ): Promise<ContactResponse | null> {
    const contactCadastrado = await this.buscarPorId(id);

    if (!contactCadastrado) {
      throw new EntityNotFoundException(
        CONTACT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
      );
    }

    try {
      const dadosNovos = ContactConverter.toContact(contactRequest);
      const contactParaSalvar = Object.assign(contactCadastrado, dadosNovos);
      const contactExistente =
        await this.contactRepository.save(contactParaSalvar);

      return ContactConverter.toContactResponse(contactExistente);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Erro ao processar: ${error.message}`,
      );
    }
  }

  async excluir(id: number): Promise<void> {
    try {
      const contact = await this.buscarPorId(id);

      if (!contact) {
        throw new EntityNotFoundException(
          CONTACT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }

      await this.contactRepository.remove(contact);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async buscarPorId(id: number): Promise<Contact> {
    try {
      const contact = await this.contactRepository
        .createQueryBuilder(CONTACT.ENTITY)
        .where(`${CONTACT.SEARCH.POR_ID} = :id`, { id })
        .getOne();

      if (!contact) {
        throw new EntityNotFoundException(
          CONTACT.MENSAGEM.ENTIDADE_NAO_ENCONTRADA,
        );
      }
      return contact;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
