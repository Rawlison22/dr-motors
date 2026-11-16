import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_PHONE = '5583993499317';
const paymentOptions = [
  {
    value: 'financing',
    label: 'Financiamento',
    description: 'Quero uma simulação',
  },
  {
    value: 'credit_card',
    label: 'Cartão de crédito',
    description: 'Consultar condições',
  },
  {
    value: 'cash',
    label: 'À vista',
    description: 'Consultar condições',
  },
  {
    value: 'talk_to_store',
    label: 'Falar direto com a loja',
    description: 'Sem preencher dados',
  },
] as const;

const inquirySchema = z
  .object({
    paymentMethod: z.enum(['financing', 'credit_card', 'cash', 'talk_to_store']).optional(),
    model: z.string(),
    name: z.string(),
    cpf: z.string(),
    birthDate: z.string(),
    phone: z.string(),
    income: z.string(),
    consent: z.boolean(),
  })
  .superRefine((values, context) => {
    if (!values.paymentMethod) {
      context.addIssue({
        code: 'custom',
        path: ['paymentMethod'],
        message: 'Selecione a forma de pagamento.',
      });
      return;
    }

    // Se for "Falar direto com a loja", não exige mais nada
    if (values.paymentMethod === 'talk_to_store') {
      return;
    }

    if (!values.model) {
      context.addIssue({
        code: 'custom',
        path: ['model'],
        message: 'Selecione o modelo da moto.',
      });
    }

    if (values.paymentMethod !== 'financing') return;

    if (!values.name.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['name'],
        message: 'Informe seu nome.',
      });
    }

    if (!isValidCpf(values.cpf)) {
      context.addIssue({
        code: 'custom',
        path: ['cpf'],
        message: 'Informe um CPF válido.',
      });
    }

    if (!values.birthDate) {
      context.addIssue({
        code: 'custom',
        path: ['birthDate'],
        message: 'Informe sua data de nascimento.',
      });
    }

    if (values.phone.replace(/\D/g, '').length < 10) {
      context.addIssue({
        code: 'custom',
        path: ['phone'],
        message: 'Informe um telefone com DDD.',
      });
    }

    if (!Number.isFinite(parseIncome(values.income)) || parseIncome(values.income) <= 0) {
      context.addIssue({
        code: 'custom',
        path: ['income'],
        message: 'Informe uma renda mensal válida.',
      });
    }

    if (!values.consent) {
      context.addIssue({
        code: 'custom',
        path: ['consent'],
        message: 'Autorize o envio dos dados para continuar.',
      });
    }
  });

type InquiryValues = z.infer<typeof inquirySchema>;

type InquiryDialogProps = {
  open: boolean;
  initialModel?: string;
  models: string[];
  onOpenChange: (open: boolean) => void;
};

const emptyValues = (model = ''): InquiryValues => ({
  paymentMethod: undefined,
  model,
  name: '',
  cpf: '',
  birthDate: '',
  phone: '',
  income: '',
  consent: false,
});

export function InquiryDialog({
  open,
  initialModel,
  models,
  onOpenChange,
}: InquiryDialogProps) {
  const form = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: emptyValues(initialModel),
  });
  const paymentMethod = form.watch('paymentMethod');

  useEffect(() => {
    if (open) form.reset(emptyValues(initialModel));
  }, [form.reset, initialModel, open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) form.reset(emptyValues());
    onOpenChange(nextOpen);
  };

  const sendToWhatsApp = form.handleSubmit((values) => {
    const model = values.model;
    let message: string;

    if (values.paymentMethod === 'financing') {
      const [year, month, day] = values.birthDate.split('-');
      message = [
        `Olá! Vi no catálogo da DR Motors e gostei da ${model}.`,
        'Gostaria de solicitar uma simulação de financiamento.',
        '',
        'DADOS PARA SIMULAÇÃO',
        `Nome: ${values.name.trim()}`,
        `CPF: ${values.cpf}`,
        `Data de nascimento: ${day}/${month}/${year}`,
        `Telefone: ${values.phone.trim()}`,
        `Renda: ${formatIncome(parseIncome(values.income))}`,
        `Modelo da moto: ${model}`,
      ].join('\n');
    } else if (values.paymentMethod === 'credit_card') {
      message = `Olá! Vi no catálogo da DR Motors e tenho interesse na ${model}. Gostaria de me informar sobre as condições para pagamento no cartão de crédito.`;
    } else if (values.paymentMethod === 'cash') {
      message = `Olá! Vi no catálogo da DR Motors e tenho interesse na ${model}. Gostaria de consultar as condições para pagamento à vista.`;
    } else {
      // talk_to_store
      message = `Olá! Gostaria de falar diretamente com a loja DR Motors.`;
    }

    const whatsappLink = document.createElement('a');
    whatsappLink.href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    whatsappLink.click();
    handleOpenChange(false);
  });

  const changePaymentMethod = (
    value: (typeof paymentOptions)[number]['value'],
    onChange: (value: (typeof paymentOptions)[number]['value']) => void,
  ) => {
    onChange(value);
    form.clearErrors();

    if (value !== 'financing') {
      form.resetField('name');
      form.resetField('cpf');
      form.resetField('birthDate');
      form.resetField('phone');
      form.resetField('income');
      form.resetField('consent');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="contact-dialog">
        <DialogHeader className="contact-dialog-header">
          <p className="contact-dialog-eyebrow">Atendimento DR Motors</p>
          <DialogTitle className="contact-dialog-title">
            Como podemos ajudar?
          </DialogTitle>
          <DialogDescription className="contact-dialog-description">
            Escolha a forma de pagamento para iniciar sua conversa pelo WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="inquiry-form"
            onSubmit={sendToWhatsApp}
            noValidate
            data-testid="form-whatsapp-inquiry"
          >
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="inquiry-field">
                  <fieldset className="payment-fieldset">
                    <legend className="inquiry-label">Forma de pagamento</legend>
                    <div
                      className="payment-options"
                      role="radiogroup"
                      aria-label="Forma de pagamento"
                    >
                      {paymentOptions.map((option) => (
                        <label
                          className={`payment-option${field.value === option.value ? ' is-selected' : ''}`}
                          key={option.value}
                        >
                          <input
                            type="radio"
                            name={field.name}
                            value={option.value}
                            checked={field.value === option.value}
                            onChange={() =>
                              changePaymentMethod(option.value, field.onChange)
                            }
                            onBlur={field.onBlur}
                            data-testid={`radio-payment-${option.value}`}
                          />
                          <span className="payment-option-mark" aria-hidden="true" />
                          <span className="payment-option-copy">
                            <strong>{option.label}</strong>
                            <small>{option.description}</small>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <FormMessage className="inquiry-error" />
                </FormItem>
              )}
            />

            {paymentMethod !== 'talk_to_store' && (
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="inquiry-field">
                    <FormLabel className="inquiry-label">Modelo da moto</FormLabel>
                    <FormControl>
                      <select
                        className="inquiry-input"
                        {...field}
                        data-testid="select-inquiry-model"
                      >
                        <option value="">Selecione um modelo</option>
                        {models.map((model) => (
                          <option value={model} key={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage className="inquiry-error" />
                  </FormItem>
                )}
              />
            )}

            {paymentMethod === 'financing' && (
              <section className="financing-fields" aria-labelledby="financing-heading">
                <div className="financing-heading">
                  <h3 id="financing-heading">Dados para simulação</h3>
                  <p>Preencha seus dados para a equipe preparar o atendimento.</p>
                </div>
                <div className="financing-grid">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="inquiry-field">
                        <FormLabel className="inquiry-label">Nome completo</FormLabel>
                        <FormControl>
                          <input
                            className="inquiry-input"
                            autoComplete="name"
                            placeholder="Seu nome"
                            {...field}
                            data-testid="input-financing-name"
                          />
                        </FormControl>
                        <FormMessage className="inquiry-error" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem className="inquiry-field">
                        <FormLabel className="inquiry-label">CPF</FormLabel>
                        <FormControl>
                          <input
                            className="inquiry-input"
                            inputMode="numeric"
                            autoComplete="off"
                            maxLength={14}
                            placeholder="000.000.000-00"
                            {...field}
                            onChange={(event) =>
                              field.onChange(maskCpf(event.currentTarget.value))
                            }
                            data-testid="input-financing-cpf"
                          />
                        </FormControl>
                        <FormMessage className="inquiry-error" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="inquiry-field">
                        <FormLabel className="inquiry-label">
                          Data de nascimento
                        </FormLabel>
                        <FormControl>
                          <input
                            className="inquiry-input"
                            type="date"
                            autoComplete="bday"
                            {...field}
                            data-testid="input-financing-birth-date"
                          />
                        </FormControl>
                        <FormMessage className="inquiry-error" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="inquiry-field">
                        <FormLabel className="inquiry-label">Telefone</FormLabel>
                        <FormControl>
                          <input
                            className="inquiry-input"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            placeholder="(83) 99999-9999"
                            {...field}
                            data-testid="input-financing-phone"
                          />
                        </FormControl>
                        <FormMessage className="inquiry-error" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="income"
                    render={({ field }) => (
                      <FormItem className="inquiry-field">
                        <FormLabel className="inquiry-label">Renda mensal</FormLabel>
                        <FormControl>
                          <input
                            className="inquiry-input"
                            inputMode="decimal"
                            autoComplete="off"
                            placeholder="Ex.: 2.500,00"
                            {...field}
                            onChange={(event) => field.onChange(event.currentTarget.value)}
                            data-testid="input-financing-income"
                          />
                        </FormControl>
                        <FormMessage className="inquiry-error" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="consent-field">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          name={field.name}
                          data-testid="checkbox-financing-consent"
                        />
                      </FormControl>
                      <FormLabel className="consent-copy">
                        Autorizo a DR Motors, enviar os meus dados para simulação e análise de crédito junto aos bancos disponíveis.
                      </FormLabel>
                      <FormMessage className="inquiry-error" />
                    </FormItem>
                  )}
                />
                <p className="privacy-note">
                  Os dados não são salvos neste catálogo. Ao continuar, eles serão
                  incluídos na mensagem do WhatsApp.
                </p>
              </section>
            )}

            {paymentMethod && paymentMethod !== 'financing' && paymentMethod !== 'talk_to_store' && (
              <p className="payment-note">
                Sua mensagem será preparada com o modelo e a forma de pagamento
                selecionados.
              </p>
            )}

            <button
              type="submit"
              className="inquiry-submit"
              data-testid="button-send-whatsapp-inquiry"
            >
              <MessageCircle size={17} />
              <span>
                {paymentMethod === 'financing'
                  ? 'Enviar dados para simulação'
                  : paymentMethod === 'talk_to_store'
                    ? 'Falar com a loja no WhatsApp'
                    : 'Continuar para o WhatsApp'}
              </span>
            </button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function parseIncome(value: string) {
  const normalized = value.trim().replace(/\s/g, '').replace(/^R\$\s?/, '');
  const amount = normalized.includes(',')
    ? normalized.replace(/\./g, '').replace(',', '.')
    : normalized;
  return Number(amount);
}

function formatIncome(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function maskCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function isValidCpf(value: string) {
  const cpf = value.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const firstDigit = cpf
    .slice(0, 9)
    .split('')
    .reduce((sum, digit, index) => sum + Number(digit) * (10 - index), 0);
  const firstCheck = (firstDigit * 10) % 11;
  const expectedFirst = firstCheck === 10 ? 0 : firstCheck;
  if (expectedFirst !== Number(cpf[9])) return false;

  const secondDigit = cpf
    .slice(0, 10)
    .split('')
    .reduce((sum, digit, index) => sum + Number(digit) * (11 - index), 0);
  const secondCheck = (secondDigit * 10) % 11;
  const expectedSecond = secondCheck === 10 ? 0 : secondCheck;
  return expectedSecond === Number(cpf[10]);
}