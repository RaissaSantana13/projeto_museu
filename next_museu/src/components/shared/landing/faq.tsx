import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function Faqs() {
  return (
    <section id="faq" className="w-full scroll-mt-16 flex justify-center py-16 md:py-24 bg-muted/30 border-b">
      <div className="container px-4 md:px-6">
        <div className="mb-10 text-center">
          <h3 className="text-2xl font-serif font-bold mb-6">Dúvidas Frequentes (FAQ)</h3>
        </div>
        <Accordion type="single" collapsible className="w-full ">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium hover:text-primary no-underline py-6">
              Como posso doar peças para o museu?
            </AccordionTrigger>
            <AccordionContent>
              A curadoria aceita doações que tenham valor histórico comprovado. Entre em contato pelo e-mail
              acervo@museu.org.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium hover:text-primary no-underline py-6">
              O acervo digital é gratuito?
            </AccordionTrigger>
            <AccordionContent>
              Sim, a visualização básica é livre para todos. Pesquisas acadêmicas profundas exigem cadastro no sistema.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
